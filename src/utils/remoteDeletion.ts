import {
  deleteDoc,
  doc,
  writeBatch,
} from '@react-native-firebase/firestore';
import { deleteObject, getStorage, refFromURL } from '@react-native-firebase/storage';
import { db } from '../firebase/Firestore';
import {
  FIRESTORE_BATCH_LIMIT,
  OwnedDocument,
  chunk,
} from './accountDeletionPlan';

const STORAGE_DELETE_CONCURRENCY = 5;
const REMOTE_CALL_TIMEOUT_MS = 20000;

export interface DeleteProgress {
  deleted: number;
  hardFailures: number;
  networkFailures: number;
  /** A timed-out write may already have landed, so the caller must not assume a clean retry from zero. */
  uncertain: boolean;
}

export function emptyProgress(): DeleteProgress {
  return { deleted: 0, hardFailures: 0, networkFailures: 0, uncertain: false };
}

export function deletionFailure(progress: DeleteProgress): 'partial' | 'network' | null {
  if (progress.uncertain || progress.hardFailures > 0) return 'partial';
  if (progress.networkFailures > 0) return progress.deleted > 0 ? 'partial' : 'network';
  return null;
}

export function toOwnedDocuments(
  collectionName: string,
  docs: ReadonlyArray<{ id: string; data: () => unknown }>,
): OwnedDocument[] {
  return docs.map((document) => {
    const raw = document.data();
    const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
    return { collectionName, id: document.id, data };
  });
}

export async function deleteStorageUrls(urls: readonly string[]): Promise<DeleteProgress> {
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

export async function deleteOwnedDocuments(documents: readonly OwnedDocument[]): Promise<DeleteProgress> {
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

function recordResult(
  progress: DeleteProgress,
  result: 'deleted' | 'network' | 'failed' | 'uncertain',
): void {
  if (result === 'deleted') progress.deleted += 1;
  else if (result === 'network') progress.networkFailures += 1;
  else if (result === 'uncertain') progress.uncertain = true;
  else progress.hardFailures += 1;
}

export function isPermissionDenied(error: unknown): boolean {
  const code = firebaseCode(error);
  return code === 'permission-denied' || code.endsWith('/permission-denied');
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

export function isNetworkError(error: unknown): boolean {
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

export function firebaseCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string') return code;
  }
  return '';
}

export function withTimeout<T>(promise: Promise<T>): Promise<T> {
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
