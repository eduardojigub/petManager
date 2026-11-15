/** Firestore rejects a write batch with more than 500 operations. */
export const FIRESTORE_BATCH_LIMIT = 500;

/** A Firestore `in` filter accepts at most 30 values. */
export const FIRESTORE_IN_QUERY_LIMIT = 30;

export interface OwnedDocument {
  collectionName: string;
  id: string;
  data: Record<string, unknown>;
}

const MEDIA_FIELD = /(image|photo|avatar|picture|receipt|attachment|file|media)/i;

export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (size < 1) {
    throw new Error('chunk size must be at least 1');
  }

  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

export function dedupeDocuments(documents: readonly OwnedDocument[]): OwnedDocument[] {
  const byPath = new Map<string, OwnedDocument>();
  for (const document of documents) {
    byPath.set(`${document.collectionName}/${document.id}`, document);
  }
  return [...byPath.values()];
}

export function isFirebaseStorageUrl(value: string): boolean {
  return (
    value.startsWith('gs://') ||
    value.includes('firebasestorage.googleapis.com') ||
    value.includes('.firebasestorage.app')
  );
}

function collectFromValue(value: unknown, urls: string[], fieldLooksLikeMedia: boolean): void {
  if (typeof value === 'string') {
    if (fieldLooksLikeMedia && isFirebaseStorageUrl(value)) {
      urls.push(value);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectFromValue(item, urls, fieldLooksLikeMedia);
    }
    return;
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      collectFromValue(nested, urls, fieldLooksLikeMedia || MEDIA_FIELD.test(key));
    }
  }
}

/**
 * New uploads live under `users/{uid}/`. Older files still use the shared
 * prefixes `dogProfiles/`, `healthRecords/` and `userAvatars/`. Account
 * deletion only removes a file whose download URL is stored on the user's
 * own documents. Text fields are ignored so a pasted link cannot target
 * someone else's file.
 */
export function collectStorageUrls(data: Record<string, unknown> | null | undefined): string[] {
  if (!data) return [];

  const urls: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    collectFromValue(value, urls, MEDIA_FIELD.test(key));
  }
  return urls;
}
