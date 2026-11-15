import { getAuth, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from '@react-native-firebase/auth';
import {
  collection,
  getDocsFromServer,
  query,
  where,
} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { db } from '../firebase/Firestore';
import {
  DOG_SCOPED_COLLECTIONS,
  ensureUserIdBackfill,
  USER_MIGRATION_COLLECTION,
} from '../firebase/userIdBackfill';
import { LANGUAGE_STORAGE_KEY } from '../context/LanguageContext';
import {
  FIRESTORE_IN_QUERY_LIMIT,
  OwnedDocument,
  chunk,
  collectStorageUrls,
  dedupeDocuments,
  isFirebaseStorageUrl,
  unique,
} from './accountDeletionPlan';
import {
  DeleteProgress,
  deleteOwnedDocuments,
  deleteStorageUrls,
  deletionFailure,
  firebaseCode,
  isNetworkError,
  isPermissionDenied,
  toOwnedDocuments,
  withTimeout,
} from './remoteDeletion';

const USER_SCOPED_COLLECTIONS = DOG_SCOPED_COLLECTIONS;

export type DeleteAccountFailure =
  | 'wrong-password'
  | 'requires-recent-login'
  | 'network'
  | 'too-many-requests'
  | 'no-password'
  | 'unauthenticated'
  | 'partial'
  | 'local'
  | 'auth-delete'
  | 'unknown';

export class DeleteAccountError extends Error {
  readonly failure: DeleteAccountFailure;

  constructor(failure: DeleteAccountFailure) {
    super(failure);
    this.name = 'DeleteAccountError';
    this.failure = failure;
  }
}

interface DeleteAccountOptions {
  onRemoteDataDeleted?: () => void;
}

/**
 * Deletes the signed-in account on the device.
 *
 * Order: reauthenticate, read the user's documents from the server, delete
 * Storage files referenced by those documents, batch-delete Firestore
 * documents, clear local notifications and AsyncStorage, then delete the
 * Auth user. The login is removed only after remote data is confirmed gone,
 * so a failure leaves the account signed in and able to retry.
 *
 * This repo has no Cloud Function. Deletion runs as the signed-in user and
 * needs security rules that allow that user to read and delete documents
 * whose userId is their uid, plus the Storage files those documents point at.
 * Owner rules reject a list filtered only by dogId. That lookup is best-effort
 * so a legacy document can still be removed before the rules are deployed;
 * after deploy, permission-denied is ignored and the userId query is enough
 * for documents the backfill already stamped.
 */
export async function deleteCurrentAccount(
  password: string,
  options?: DeleteAccountOptions,
): Promise<void> {
  const user = getAuth().currentUser;
  if (!user) throw new DeleteAccountError('unauthenticated');

  const email = user.email?.trim() ?? '';
  if (!email) throw new DeleteAccountError('no-password');

  const usesPassword = user.providerData.some((provider) => provider.providerId === 'password');
  if (user.providerData.length > 0 && !usesPassword) {
    throw new DeleteAccountError('no-password');
  }

  const credential = EmailAuthProvider.credential(email, password);
  try {
    await withTimeout(reauthenticateWithCredential(user, credential));
  } catch (error) {
    throw mapReauthError(error);
  }

  const photoUrl = user.photoURL;
  try {
    await ensureUserIdBackfill(user.uid);
  } catch (error) {
    if (isNetworkError(error)) throw new DeleteAccountError('network');
    console.warn('Account backfill failed', firebaseCode(error));
    throw new DeleteAccountError('unknown');
  }

  let documents: OwnedDocument[];
  try {
    documents = await collectUserDocuments(user.uid);
  } catch (error) {
    if (error instanceof DeleteAccountError) throw error;
    if (isNetworkError(error)) throw new DeleteAccountError('network');
    console.warn('Account data lookup failed', firebaseCode(error));
    throw new DeleteAccountError('unknown');
  }

  const urls = unique([
    ...documents.flatMap((item) => collectStorageUrls(item.data)),
    ...(photoUrl && isFirebaseStorageUrl(photoUrl) ? [photoUrl] : []),
  ]);

  if (urls.length > 0) {
    ensureRemoteProgress(await deleteStorageUrls(urls));
  }
  if (documents.length > 0) {
    ensureRemoteProgress(await deleteOwnedDocuments(documents));
  }

  try {
    options?.onRemoteDataDeleted?.();
  } catch (error) {
    console.warn('Selected pet reset failed', error);
  }

  try {
    await clearLocalAccountState();
  } catch (error) {
    console.warn('Local account cleanup failed', firebaseCode(error));
    throw new DeleteAccountError('local');
  }

  await deleteAuthUser(email, password);
}

async function collectUserDocuments(userId: string): Promise<OwnedDocument[]> {
  const dogProfiles = await fetchByUserId('dogProfiles', userId);
  const byUser = await Promise.all(
    USER_SCOPED_COLLECTIONS.map((collectionName) => fetchByUserId(collectionName, userId)),
  );
  const dogIds = unique(dogProfiles.map((dog) => dog.id));
  const byDog = dogIds.length
    ? await Promise.all(
        DOG_SCOPED_COLLECTIONS.map((collectionName) => fetchByDogIds(collectionName, dogIds)),
      )
    : [];

  return dedupeDocuments([
    ...dogProfiles,
    ...byUser.flat(),
    ...byDog.flat(),
    { collectionName: USER_MIGRATION_COLLECTION, id: userId, data: { userId } },
  ]);
}

async function fetchByUserId(collectionName: string, userId: string): Promise<OwnedDocument[]> {
  const snapshot = await withTimeout(
    getDocsFromServer(query(collection(db, collectionName), where('userId', '==', userId))),
  );
  return toOwnedDocuments(collectionName, snapshot.docs);
}

async function fetchByDogIds(collectionName: string, dogIds: readonly string[]): Promise<OwnedDocument[]> {
  const documents: OwnedDocument[] = [];
  for (const ids of chunk(dogIds, FIRESTORE_IN_QUERY_LIMIT)) {
    try {
      const snapshot = await withTimeout(
        getDocsFromServer(query(collection(db, collectionName), where('dogId', 'in', ids))),
      );
      documents.push(...toOwnedDocuments(collectionName, snapshot.docs));
    } catch (error) {
      if (isPermissionDenied(error)) {
        console.warn(`Legacy ${collectionName} lookup by dogId was denied by security rules`);
        return documents;
      }
      throw error;
    }
  }
  return documents;
}

async function clearLocalAccountState(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.warn('Could not dismiss presented notifications', firebaseCode(error));
  }

  const keys = await AsyncStorage.getAllKeys();
  const toRemove = keys.filter((key) => key !== LANGUAGE_STORAGE_KEY);
  if (toRemove.length > 0) {
    await AsyncStorage.multiRemove(toRemove);
  }
}

async function deleteAuthUser(email: string, password: string): Promise<void> {
  const latest = getAuth().currentUser;
  if (!latest) throw new DeleteAccountError('unauthenticated');

  try {
    const credential = EmailAuthProvider.credential(email, password);
    const refreshed = await withTimeout(reauthenticateWithCredential(latest, credential));
    await withTimeout(deleteUser(refreshed.user));
  } catch (error) {
    if (error instanceof DeleteAccountError) throw error;
    if (firebaseCode(error) === 'auth/requires-recent-login') {
      throw new DeleteAccountError('requires-recent-login');
    }
    console.warn('Auth user delete failed', firebaseCode(error));
    throw new DeleteAccountError('auth-delete');
  }
}

function ensureRemoteProgress(progress: DeleteProgress): void {
  const failure = deletionFailure(progress);
  if (failure) throw new DeleteAccountError(failure);
}

function mapReauthError(error: unknown): DeleteAccountError {
  const code = firebaseCode(error);
  if (
    code === 'auth/wrong-password' ||
    code === 'auth/invalid-credential' ||
    code === 'auth/invalid-login-credentials' ||
    code === 'auth/user-mismatch' ||
    code === 'auth/invalid-email' ||
    code === 'auth/missing-password'
  ) {
    return new DeleteAccountError('wrong-password');
  }
  if (code === 'auth/too-many-requests') return new DeleteAccountError('too-many-requests');
  if (code === 'auth/requires-recent-login') return new DeleteAccountError('requires-recent-login');
  if (isNetworkError(error)) return new DeleteAccountError('network');
  console.warn('Reauthentication failed', code);
  return new DeleteAccountError('unknown');
}

