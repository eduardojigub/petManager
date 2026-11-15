import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { after, before, beforeEach, test } from 'node:test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';

const PROJECT_ID = 'demo-petmanager';

let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
    storage: {
      rules: readFileSync(new URL('../storage.rules', import.meta.url), 'utf8'),
      host: '127.0.0.1',
      port: 9199,
    },
  });
});

after(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.collection('dogProfiles').doc('dogA').set({ userId: 'alice', name: 'Rex' });
    await db.collection('dogProfiles').doc('dogA2').set({ userId: 'alice', name: 'Nina' });
    await db.collection('dogProfiles').doc('dogB').set({ userId: 'bob', name: 'Luna' });
    await db.collection('healthRecords').doc('hrOwned').set({
      userId: 'alice',
      dogId: 'dogA',
      type: 'Vaccine',
    });
    await db.collection('healthRecords').doc('hrLegacy').set({ dogId: 'dogA', type: 'Medication' });
    await db.collection('healthRecords').doc('hrBob').set({
      userId: 'bob',
      dogId: 'dogB',
      type: 'Vaccine',
    });
    await db.collection('expenses').doc('exOwned').set({
      userId: 'alice',
      dogId: 'dogA',
      amount: 5,
      title: 'Coleira',
    });
    await db.collection('expenses').doc('exLegacy').set({ dogId: 'dogA', amount: 12, title: 'Racao' });
    await db.collection('schedules').doc('scOwned').set({
      userId: 'alice',
      dogId: 'dogA',
      description: 'Consulta',
    });
    await db.collection('schedules').doc('scLegacy').set({ dogId: 'dogA', description: 'Banho' });

    const storage = context.storage();
    for (const path of ['dogProfiles/legacy.jpg', 'healthRecords/legacy.jpg', 'userAvatars/legacy.jpg']) {
      await storage.ref(path).putString('legacy', 'raw', { contentType: 'image/jpeg' });
    }
  });
});

function aliceDb() {
  return testEnv.authenticatedContext('alice').firestore();
}

function bobDb() {
  return testEnv.authenticatedContext('bob').firestore();
}

test('unsigned users cannot read a dog profile', async () => {
  const anon = testEnv.unauthenticatedContext().firestore();
  await assertFails(anon.collection('dogProfiles').doc('dogA').get());
});

test('owner can list only their dog profiles by userId', async () => {
  const snap = await assertSucceeds(
    aliceDb().collection('dogProfiles').where('userId', '==', 'alice').get(),
  );
  assert.deepEqual(snap.docs.map((item) => item.id).sort(), ['dogA', 'dogA2']);
});

test('a user cannot query another userId', async () => {
  await assertFails(bobDb().collection('dogProfiles').where('userId', '==', 'alice').get());
});

test('dog profile create must use the signed-in userId and update cannot change it', async () => {
  const db = aliceDb();
  await assertSucceeds(db.collection('dogProfiles').doc('dogNew').set({ userId: 'alice', name: 'Max' }));
  await assertFails(db.collection('dogProfiles').doc('stolen').set({ userId: 'bob', name: 'Max' }));
  await assertFails(db.collection('dogProfiles').doc('dogA').update({ userId: 'bob' }));
  await assertSucceeds(db.collection('dogProfiles').doc('dogA').update({ name: 'Rexy' }));
});

test('owner can delete their dog profile and nobody else can', async () => {
  await assertFails(bobDb().collection('dogProfiles').doc('dogA').delete());
  await assertSucceeds(aliceDb().collection('dogProfiles').doc('dogA').delete());
});

for (const collectionName of ['healthRecords', 'expenses', 'schedules']) {
  test(`${collectionName} list by userId hides other owners and legacy docs`, async () => {
    const snap = await assertSucceeds(
      aliceDb().collection(collectionName).where('userId', '==', 'alice').get(),
    );
    assert.equal(snap.docs.every((item) => item.data().userId === 'alice'), true);
    assert.equal(
      snap.docs.some((item) => item.id.endsWith('Legacy') || item.id === 'hrBob'),
      false,
    );
  });

  test(`${collectionName} list by userId and dogId is allowed for the owner`, async () => {
    const snap = await assertSucceeds(
      aliceDb()
        .collection(collectionName)
        .where('userId', '==', 'alice')
        .where('dogId', '==', 'dogA')
        .get(),
    );
    assert.equal(snap.size > 0, true);
  });

  test(`${collectionName} list by dogId alone is denied`, async () => {
    const db = aliceDb();
    await assertFails(db.collection(collectionName).where('dogId', '==', 'dogA').get());
    await assertFails(db.collection(collectionName).where('dogId', 'in', ['dogA']).get());
  });
}

test('health record create requires the caller userId and their dog', async () => {
  const db = aliceDb();
  await assertSucceeds(
    db.collection('healthRecords').doc('created').set({ userId: 'alice', dogId: 'dogA', type: 'Other' }),
  );
  await assertFails(
    db.collection('healthRecords').doc('noOwner').set({ dogId: 'dogA', type: 'Other' }),
  );
  await assertFails(
    db.collection('healthRecords').doc('wrongOwner').set({ userId: 'bob', dogId: 'dogA', type: 'Other' }),
  );
  await assertFails(
    db.collection('healthRecords').doc('wrongDog').set({ userId: 'alice', dogId: 'dogB', type: 'Other' }),
  );
});

test('owner can patch their record without changing userId', async () => {
  const db = aliceDb();
  await assertSucceeds(db.collection('healthRecords').doc('hrOwned').update({ notificationId: 'n1' }));
  await assertFails(db.collection('healthRecords').doc('hrOwned').update({ userId: 'bob' }));
  await assertFails(bobDb().collection('healthRecords').doc('hrOwned').update({ type: 'Other' }));
});

test('owner can move a record only to another dog they own', async () => {
  await assertSucceeds(aliceDb().collection('expenses').doc('exOwned').update({ dogId: 'dogA2' }));
  await assertFails(aliceDb().collection('schedules').doc('scOwned').update({ dogId: 'dogB' }));
});

test('dog owner can read and claim a legacy document, and cannot reassign it', async () => {
  const legacy = await assertSucceeds(aliceDb().collection('healthRecords').doc('hrLegacy').get());
  assert.equal(legacy.exists, true);
  await assertFails(bobDb().collection('healthRecords').doc('hrLegacy').get());

  await assertSucceeds(
    aliceDb().collection('healthRecords').doc('hrLegacy').update({ userId: 'alice' }),
  );
  await assertSucceeds(
    aliceDb().collection('expenses').doc('exLegacy').update({ userId: 'alice', title: 'Racao especial' }),
  );
  await assertFails(
    aliceDb().collection('schedules').doc('scLegacy').update({ userId: 'alice', dogId: 'dogA2' }),
  );
  await assertFails(bobDb().collection('schedules').doc('scLegacy').update({ userId: 'bob' }));
});

test('dog owner can delete a legacy document by id and another user cannot', async () => {
  await assertFails(bobDb().collection('schedules').doc('scLegacy').delete());
  await assertSucceeds(aliceDb().collection('schedules').doc('scLegacy').delete());
});

test('userMigrations is private to that uid, including a missing flag doc', async () => {
  const missing = await assertSucceeds(aliceDb().collection('userMigrations').doc('alice').get());
  assert.equal(missing.exists, false);
  await assertSucceeds(aliceDb().collection('userMigrations').doc('alice').delete());
  await assertFails(bobDb().collection('userMigrations').doc('alice').delete());

  await assertSucceeds(
    aliceDb().collection('userMigrations').doc('alice').set({
      userId: 'alice',
      userIdBackfillCompleted: true,
      updated: 2,
    }),
  );
  await assertFails(bobDb().collection('userMigrations').doc('alice').get());
  await assertFails(bobDb().collection('userMigrations').doc('alice').set({ userId: 'bob' }));
  await assertFails(aliceDb().collection('userMigrations').doc('bob').set({ userId: 'alice' }));
  await assertSucceeds(aliceDb().collection('userMigrations').doc('alice').delete());
});

test('deleting one pet removes its owned records and leaves the other pets in place', async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.collection('healthRecords').doc('hrA2').set({
      userId: 'alice',
      dogId: 'dogA2',
      type: 'Vaccine',
      image: 'https://firebasestorage.googleapis.com/v0/b/demo/o/users%2Falice%2FhealthRecords%2Fa2.jpg',
    });
    await db.collection('expenses').doc('exRecurring').set({
      userId: 'alice',
      dogId: 'dogA',
      amount: 9,
      title: 'Racao mensal',
      recurring: true,
      recurringFrequency: 'monthly',
    });
    await db.collection('expenses').doc('exA2').set({
      userId: 'alice',
      dogId: 'dogA2',
      amount: 4,
      title: 'Brinquedo',
    });
    await db.collection('schedules').doc('scA2').set({
      userId: 'alice',
      dogId: 'dogA2',
      description: 'Passeio',
      notificationId: 'other-pet',
    });
  });

  const db = aliceDb();
  const childCollections = ['healthRecords', 'expenses', 'schedules'];
  for (const collectionName of childCollections) {
    const snap = await assertSucceeds(
      db.collection(collectionName).where('userId', '==', 'alice').where('dogId', '==', 'dogA').get(),
    );
    assert.equal(snap.size > 0, true);
    assert.equal(snap.docs.every((item) => item.data().dogId === 'dogA'), true);
    if (collectionName === 'expenses') {
      assert.equal(snap.docs.some((item) => item.id === 'exRecurring' && item.data().recurring === true), true);
    }
    for (const item of snap.docs) {
      await assertSucceeds(item.ref.delete());
    }
  }

  await assertSucceeds(db.collection('dogProfiles').doc('dogA').delete());

  for (const collectionName of childCollections) {
    const gone = await assertSucceeds(
      db.collection(collectionName).where('userId', '==', 'alice').where('dogId', '==', 'dogA').get(),
    );
    assert.equal(gone.size, 0);
    const kept = await assertSucceeds(
      db.collection(collectionName).where('userId', '==', 'alice').where('dogId', '==', 'dogA2').get(),
    );
    assert.equal(kept.size > 0, true);
  }

  const nina = await assertSucceeds(db.collection('dogProfiles').doc('dogA2').get());
  assert.equal(nina.exists, true);
  const bobRecords = await assertSucceeds(
    bobDb().collection('healthRecords').where('userId', '==', 'bob').where('dogId', '==', 'dogB').get(),
  );
  assert.equal(bobRecords.size, 1);
  await assertFails(bobDb().collection('expenses').doc('exA2').delete());
  await assertFails(bobDb().collection('dogProfiles').doc('dogA2').delete());
});

test('unknown collections are denied', async () => {
  await assertFails(aliceDb().collection('secrets').doc('one').set({ userId: 'alice' }));
  await assertFails(aliceDb().collection('secrets').doc('one').get());
});

test('new images are scoped to users/{uid} and must be images', async () => {
  const owned = testEnv.authenticatedContext('alice').storage().ref('users/alice/healthRecords/photo.jpg');
  await assertSucceeds(owned.putString('jpeg-bytes', 'raw', { contentType: 'image/jpeg' }));
  await assertSucceeds(owned.getMetadata());
  await assertFails(
    testEnv.authenticatedContext('bob').storage().ref('users/alice/healthRecords/photo.jpg').getMetadata(),
  );
  await assertFails(
    testEnv
      .authenticatedContext('alice')
      .storage()
      .ref('users/bob/healthRecords/photo.jpg')
      .putString('x', 'raw', { contentType: 'image/jpeg' }),
  );
  await assertFails(
    testEnv
      .authenticatedContext('alice')
      .storage()
      .ref('users/alice/healthRecords/notes.txt')
      .putString('x', 'raw', { contentType: 'text/plain' }),
  );
  await assertSucceeds(owned.delete());
});

test('legacy images stay readable and deletable by a signed-in user, but are not listable or writable', async () => {
  const aliceStorage = testEnv.authenticatedContext('alice').storage();
  await assertSucceeds(aliceStorage.ref('dogProfiles/legacy.jpg').getMetadata());
  await assertSucceeds(aliceStorage.ref('healthRecords/legacy.jpg').getMetadata());
  await assertSucceeds(
    testEnv.authenticatedContext('bob').storage().ref('userAvatars/legacy.jpg').getMetadata(),
  );
  await assertFails(aliceStorage.ref('dogProfiles').listAll());
  await assertFails(
    aliceStorage.ref('dogProfiles/new.jpg').putString('x', 'raw', { contentType: 'image/jpeg' }),
  );
  await assertFails(
    testEnv.unauthenticatedContext().storage().ref('healthRecords/legacy.jpg').getMetadata(),
  );
  await assertSucceeds(aliceStorage.ref('healthRecords/legacy.jpg').delete());
});
