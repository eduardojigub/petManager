import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from '@react-native-firebase/firestore';
import { db } from './Firestore';

export const DOG_SCOPED_COLLECTIONS = ['healthRecords', 'expenses', 'schedules'] as const;
export const USER_MIGRATION_COLLECTION = 'userMigrations';

const BATCH_LIMIT = 450;

export type BackfillStatus = 'completed' | 'skipped' | 'rules-blocked';

export interface BackfillResult {
  status: BackfillStatus;
  updated: number;
}

const inFlight = new Map<string, Promise<BackfillResult>>();
const blockedThisSession = new Set<string>();

function cacheKey(userId: string): string {
  return `userIdBackfill:${userId}`;
}

function isPermissionDenied(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('code' in error)) return false;
  const code = (error as { code?: unknown }).code;
  if (typeof code !== 'string') return false;
  return code === 'permission-denied' || code.endsWith('/permission-denied');
}

/**
 * True when the document has no usable owner. A userId already set to someone
 * else is left untouched so the backfill cannot take over that document.
 */
export function documentNeedsOwner(data: { userId?: unknown } | undefined): boolean {
  const current = data?.userId;
  return typeof current !== 'string' || current.trim() === '';
}

async function rememberDone(userId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(cacheKey(userId), '1');
  } catch (error) {
    console.warn('userId backfill cache write failed');
  }
}

/**
 * Stamps userId on the signed-in user's dog-scoped documents that lack it.
 *
 * Idempotent. The Firestore flag `userMigrations/{uid}` makes it once per
 * user; AsyncStorage skips the read on later launches of the same install.
 * Listing those documents by dogId only works before the owner rules are
 * deployed. After that, Firestore rejects the query and this returns
 * `rules-blocked` without setting the flag. Run scripts/backfill-user-id.mjs
 * in that case.
 */
export function ensureUserIdBackfill(userId: string): Promise<BackfillResult> {
  const existing = inFlight.get(userId);
  if (existing) return existing;

  const run = performBackfill(userId).finally(() => {
    inFlight.delete(userId);
  });
  inFlight.set(userId, run);
  return run;
}

async function performBackfill(userId: string): Promise<BackfillResult> {
  if (blockedThisSession.has(userId)) {
    return { status: 'rules-blocked', updated: 0 };
  }

  try {
    const cached = await AsyncStorage.getItem(cacheKey(userId));
    if (cached === '1') return { status: 'skipped', updated: 0 };
  } catch (error) {
    console.warn('userId backfill cache read failed');
  }

  const flagRef = doc(db, USER_MIGRATION_COLLECTION, userId);
  try {
    const flag = await getDoc(flagRef);
    if (flag.exists() && flag.data()?.userIdBackfillCompleted === true) {
      await rememberDone(userId);
      return { status: 'skipped', updated: 0 };
    }
  } catch (error) {
    if (isPermissionDenied(error)) {
      blockedThisSession.add(userId);
      console.warn('userId backfill cannot read the migration flag');
      return { status: 'rules-blocked', updated: 0 };
    }
    throw error;
  }

  const pending: Array<{ collectionName: string; id: string }> = [];
  let updated = 0;
  try {
    const dogs = await getDocs(
      query(collection(db, 'dogProfiles'), where('userId', '==', userId)),
    );

    for (const dog of dogs.docs) {
      for (const collectionName of DOG_SCOPED_COLLECTIONS) {
        const snapshot = await getDocs(
          query(collection(db, collectionName), where('dogId', '==', dog.id)),
        );
        for (const child of snapshot.docs) {
          if (documentNeedsOwner(child.data())) {
            pending.push({ collectionName, id: child.id });
          }
        }
      }
    }

    for (let index = 0; index < pending.length; index += BATCH_LIMIT) {
      const slice = pending.slice(index, index + BATCH_LIMIT);
      const batch = writeBatch(db);
      for (const item of slice) {
        batch.update(doc(db, item.collectionName, item.id), { userId });
      }
      await batch.commit();
      updated += slice.length;
    }

    await setDoc(flagRef, {
      userId,
      userIdBackfillCompleted: true,
      completedAt: new Date().toISOString(),
      updated,
    });
    await rememberDone(userId);
    return { status: 'completed', updated };
  } catch (error) {
    if (isPermissionDenied(error)) {
      blockedThisSession.add(userId);
      console.warn(
        'userId backfill stopped because security rules denied a legacy read or write',
      );
      return { status: 'rules-blocked', updated };
    }
    throw error;
  }
}
