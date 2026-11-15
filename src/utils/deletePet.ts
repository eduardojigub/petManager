import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from '@react-native-firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocFromServer,
  getDocs,
  getDocsFromServer,
  query,
  where,
} from '@react-native-firebase/firestore';
import { db } from '../firebase/Firestore';
import { queryOwnedByDog } from '../firebase/FirestoreService';
import { DOG_SCOPED_COLLECTIONS, ensureUserIdBackfill } from '../firebase/userIdBackfill';
import { SELECTED_DOG_STORAGE_KEY } from '../context/DogProfileContext';
import { DogProfile } from '../types/dogProfile';
import {
  OwnedDocument,
  collectStorageUrls,
  dedupeDocuments,
  unique,
} from './accountDeletionPlan';
import { cancelNotification } from './notificationHelper';
import {
  deleteOwnedDocuments,
  deleteStorageUrls,
  deletionFailure,
  firebaseCode,
  isNetworkError,
  toOwnedDocuments,
  withTimeout,
} from './remoteDeletion';

export type DeletePetFailure = 'unauthenticated' | 'network' | 'partial' | 'unknown';

export class DeletePetError extends Error {
  readonly failure: DeletePetFailure;

  constructor(failure: DeletePetFailure) {
    super(failure);
    this.name = 'DeletePetError';
    this.failure = failure;
  }
}

/**
 * Deletes one pet and the data that belongs to it.
 *
 * Order is fixed so a failure can be retried from the edit screen:
 *   1. Stamp missing userId values while the login backfill can still see them.
 *   2. Read this pet's documents with userId + dogId (the query the owner rules allow).
 *   3. Delete Storage files those documents point at.
 *   4. Cancel local notifications stored on those documents.
 *   5. Delete health records, schedules and expenses.
 *   6. Delete the dogProfiles document last.
 *
 * The profile stays until the related documents are gone. A retry finds whatever
 * is left, treats a missing Storage file as already deleted, and continues.
 */
export async function deletePetCascade(dogId: string): Promise<void> {
  const userId = getAuth().currentUser?.uid;
  if (!userId) throw new DeletePetError('unauthenticated');
  if (!dogId) throw new DeletePetError('unknown');

  try {
    await ensureUserIdBackfill(userId);
  } catch (error) {
    if (isNetworkError(error)) throw new DeletePetError('network');
    console.warn('Pet delete backfill failed', firebaseCode(error));
    throw new DeletePetError('unknown');
  }

  let profile: OwnedDocument | null;
  let children: OwnedDocument[];
  try {
    profile = await fetchOwnedProfile(dogId, userId);
    children = await fetchOwnedChildren(userId, dogId);
  } catch (error) {
    if (error instanceof DeletePetError) throw error;
    if (isNetworkError(error)) throw new DeletePetError('network');
    console.warn('Pet delete lookup failed', firebaseCode(error));
    throw new DeletePetError('unknown');
  }

  const urls = unique([
    ...(profile ? collectStorageUrls(profile.data) : []),
    ...children.flatMap((item) => collectStorageUrls(item.data)),
  ]);

  let removedRemoteData = false;
  if (urls.length > 0) {
    ensureProgress(await deleteStorageUrls(urls));
    removedRemoteData = true;
  }

  try {
    await cancelPetNotifications(children);
    if (children.length > 0) {
      ensureProgress(await deleteOwnedDocuments(children));
      removedRemoteData = true;
    }
    if (profile) {
      await withTimeout(deleteDoc(doc(db, 'dogProfiles', profile.id)));
    }
  } catch (error) {
    if (error instanceof DeletePetError) {
      if (removedRemoteData && error.failure === 'network') {
        throw new DeletePetError('partial');
      }
      throw error;
    }
    console.warn('Pet delete write failed', firebaseCode(error));
    if (removedRemoteData) throw new DeletePetError('partial');
    if (isNetworkError(error)) throw new DeletePetError('network');
    throw new DeletePetError('unknown');
  }
}

/**
 * Picks the pet that follows the deleted one in the current list.
 * When the deleted pet was last, the previous one is used.
 * When the deleted pet is already absent, the first remaining pet is used.
 */
export function pickNextDog<T extends { id: string }>(
  profiles: readonly T[],
  deletedId: string,
): T | null {
  const index = profiles.findIndex((profile) => profile.id === deletedId);
  if (index === -1) return profiles[0] ?? null;
  if (index + 1 < profiles.length) return profiles[index + 1];
  if (index > 0) return profiles[index - 1];
  return null;
}

export async function selectDogAfterDeletion(
  deletedId: string,
  setSelectedDog: (dog: DogProfile | null) => void,
): Promise<void> {
  const userId = getAuth().currentUser?.uid;
  if (!userId) {
    await persistSelectedDog(null, setSelectedDog);
    return;
  }

  const snapshot = await getDocs(
    query(collection(db, 'dogProfiles'), where('userId', '==', userId)),
  );
  const profiles = snapshot.docs.map((item: { id: string; data: () => Omit<DogProfile, 'id'> }) => ({
    ...item.data(),
    id: item.id,
  }));
  await persistSelectedDog(pickNextDog(profiles, deletedId), setSelectedDog);
}

async function persistSelectedDog(
  dog: DogProfile | null,
  setSelectedDog: (dog: DogProfile | null) => void,
): Promise<void> {
  try {
    if (dog) {
      await AsyncStorage.setItem(SELECTED_DOG_STORAGE_KEY, dog.id);
    } else {
      await AsyncStorage.removeItem(SELECTED_DOG_STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Failed to persist selected pet', error);
  }
  setSelectedDog(dog);
}

async function fetchOwnedProfile(dogId: string, userId: string): Promise<OwnedDocument | null> {
  const snapshot = await withTimeout(getDocFromServer(doc(db, 'dogProfiles', dogId)));
  if (!snapshot.exists()) return null;

  const raw = snapshot.data();
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  if (data.userId !== userId) {
    throw new DeletePetError('unknown');
  }
  return { collectionName: 'dogProfiles', id: dogId, data };
}

async function fetchOwnedChildren(userId: string, dogId: string): Promise<OwnedDocument[]> {
  const groups = await Promise.all(
    DOG_SCOPED_COLLECTIONS.map(async (collectionName) => {
      const snapshot = await withTimeout(
        getDocsFromServer(queryOwnedByDog(collectionName, userId, dogId)),
      );
      return toOwnedDocuments(collectionName, snapshot.docs);
    }),
  );
  return dedupeDocuments(groups.flat());
}

async function cancelPetNotifications(documents: readonly OwnedDocument[]): Promise<void> {
  const ids = unique(
    documents
      .map((item) => item.data.notificationId)
      .filter((value): value is string => typeof value === 'string' && value.trim() !== ''),
  );
  await Promise.all(ids.map((id) => cancelNotification(id)));
}

function ensureProgress(progress: { deleted: number; hardFailures: number; networkFailures: number; uncertain: boolean }): void {
  const failure = deletionFailure(progress);
  if (failure === 'partial') throw new DeletePetError('partial');
  if (failure === 'network') throw new DeletePetError('network');
}
