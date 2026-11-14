import { getAuth, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from '@react-native-firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocsFromServer,
  query,
  where,
  writeBatch,
} from '@react-native-firebase/firestore';
import { deleteObject, getStorage, refFromURL } from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { db } from '../firebase/Firestore';
import { LANGUAGE_STORAGE_KEY } from '../context/LanguageContext';
import {
  FIRESTORE_BATCH_LIMIT,
  FIRESTORE_IN_QUERY_LIMIT,
  OwnedDocument,
  chunk,
  collectStorageUrls,
  dedupeDocuments,
  isFirebaseStorageUrl,
  unique,
} from './accountDeletionPlan';

const DOG_SCOPED_COLLECTIONS = ['schedules', 'healthRecords', 'expenses'] as const;
const USER_SCOPED_COLLECTIONS = ['schedules', 'healthRecords', 'expenses'] as const;
const STORAGE_DELETE_CONCURRENCY = 5;
const REMOTE_CALL_TIMEOUT_MS = 20000;

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

interface DeleteProgress {
  deleted: number;
  hardFailures: number;
  networkFailures: number;
  /** A timed-out write may already have landed, so the account must stay active. */
  uncertain: boolean;
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
 * needs security rules that already allow that user to read and delete these
 * documents and their Storage files.
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
    ensureRemoteProgress(await deleteDocuments(documents));
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

  return dedupeDocuments([...dogProfiles, ...byUser.flat(), ...byDog.flat()]);
}

function toOwnedDocuments(
  collectionName: string,
  docs: ReadonlyArray<{ id: string; data: () => unknown }>,
): OwnedDocument[] {
  return docs.map((document) => {
    const raw = document.data();
    const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    return { collectionName, id: document.id, data };
  });
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
    const snapshot = await withTimeout(
      getDocsFromServer(query(collection(db, collectionName), where('dogId', 'in', ids))),
    );
    documents.push(...toOwnedDocuments(collectionName, snapshot.docs));
  }
  return documents;
}

async function deleteStorageUrls(urls: readonly string[]): Promise<DeleteProgress> {
  const storage = getStorage();
  const progress = emptyProgress();

  for (const group of chunk(urls, STORAGE_DELETE_CONCURRENCY)) {
    const results = await Promise.all(
      group.map(async (url) => {
        try {
          await withTimeout(deleteObject(refFromURL(storage, url)));
          return 'deleted' as const;
        } catch (error) {
          if (isIgnorableStorageError(error)) return 'deleted' as const;
          if (error instanceof NetworkTimeoutError) return 'uncertain' as const;
          if (isNetworkError(error)) return 'network' as const;
          console.warn('Storage delete failed', firebaseCode(error));
          return 'failed' as const;
        }
      }),
    );

    for (const result of results) {
      recordResult(progress, result);
    }
    if (progress.networkFailures > 0 || progress.uncertain) break;
  }

  return progress;
}

async function deleteDocuments(documents: readonly OwnedDocument[]): Promise<DeleteProgress> {
  const progress = emptyProgress();

  for (const group of chunk(documents, FIRESTORE_BATCH_LIMIT)) {
    const batch = writeBatch(db);
    for (const item of group) {
      batch.delete(doc(db, item.collectionName, item.id));
    }

    try {
      await withTimeout(batch.commit());
      progress.deleted += group.length;
    } catch (batchError) {
      if (batchError instanceof NetworkTimeoutError) {
        progress.uncertain = true;
        break;
      }
      if (isNetworkError(batchError)) {
        progress.networkFailures += group.length;
        break;
      }

      const individual = await Promise.all(
        group.map(async (item) => {
          try {
            await withTimeout(deleteDoc(doc(db, item.collectionName, item.id)));
            return 'deleted' as const;
          } catch (error) {
            if (error instanceof NetworkTimeoutError) return 'uncertain' as const;
            if (isNetworkError(error)) return 'network' as const;
            console.warn('Firestore delete failed', firebaseCode(error));
            return 'failed' as const;
          }
        }),
      );

      for (const result of individual) {
        recordResult(progress, result);
      }
      if (progress.networkFailures > 0 || progress.uncertain) break;
    }
  }

  return progress;
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

function emptyProgress(): DeleteProgress {
  return { deleted: 0, hardFailures: 0, networkFailures: 0, uncertain: false };
}

function recordResult(
  progress: DeleteProgress,
  result: 'deleted' | 'network' | 'failed' | 'uncertain',
): void {
  if (result === 'deleted') progress.deleted += 1;
  else if (result === 'network') progress.networkFailures += 1;
  else if (result === 'uncertain') progress.uncertain = true;
  else progress.hardFailures += 1;
}

function ensureRemoteProgress(progress: DeleteProgress): void {
  if (progress.uncertain || progress.hardFailures > 0) {
    throw new DeleteAccountError('partial');
  }
  if (progress.networkFailures > 0) {
    throw new DeleteAccountError(progress.deleted > 0 ? 'partial' : 'network');
  }
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

function isIgnorableStorageError(error: unknown): boolean {
  const code = firebaseCode(error);
  return (
    code === 'storage/object-not-found' ||
    code === 'object-not-found' ||
    code === 'storage/invalid-url' ||
    code === 'invalid-url'
  );
}

function isNetworkError(error: unknown): boolean {
  const code = firebaseCode(error);
  if (
    code === 'auth/network-request-failed' ||
    code === 'firestore/unavailable' ||
    code === 'firestore/deadline-exceeded' ||
    code === 'storage/retry-limit-exceeded' ||
    code === 'storage/canceled' ||
    code === 'network-request-failed' ||
    code.endsWith('/unavailable') ||
    code.includes('network')
  ) {
    return true;
  }

  const message = error instanceof Error ? error.message : '';
  return /network request failed|network error|offline|timed out|timeout|unavailable/i.test(message);
}

function firebaseCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string') return code;
  }
  return '';
}

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new NetworkTimeoutError());
    }, REMOTE_CALL_TIMEOUT_MS);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

class NetworkTimeoutError extends Error {
  readonly code = 'network-request-failed';

  constructor() {
    super('Network request timed out');
    this.name = 'NetworkTimeoutError';
  }
}
