/**
 * Backfill manual de userId nas coleções de saúde, despesas e agenda.
 *
 * O Admin SDK ignora as security rules. Use isto para documentos antigos
 * que o app não consegue listar depois que firestore.rules estiver publicada.
 * O backfill do app (no login) cobre o mesmo trabalho ANTES desse deploy.
 *
 * Para cada dogProfiles com userId, grava esse userId nos documentos da mesma
 * dogId em healthRecords, expenses e schedules quando o campo está ausente,
 * vazio ou não é string. Não sobrescreve um userId de outra pessoa.
 * Perfis sem userId são só reportados: não há como saber o dono.
 *
 * Idempotente. Rode de novo à vontade.
 *
 * Uso, a partir da raiz do repositório:
 *   export GOOGLE_APPLICATION_CREDENTIALS=/caminho/serviceAccount.json
 *   node scripts/backfill-user-id.mjs --dry-run
 *   node scripts/backfill-user-id.mjs
 *
 * Ou:
 *   node scripts/backfill-user-id.mjs --service-account /caminho/serviceAccount.json
 *
 * A conta de serviço precisa de permissão para ler e gravar o Firestore
 * (papel Firebase Admin ou Cloud Datastore User). O projeto padrão é
 * petmanager-6621d. Passe --project para outro.
 *
 * Se FIRESTORE_EMULATOR_HOST estiver definido, o script recusa rodar para
 * não escrever no emulador achando que é produção. Passe --allow-emulator
 * só quando for de propósito.
 */

import { readFileSync } from 'node:fs';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const DOG_SCOPED_COLLECTIONS = ['healthRecords', 'expenses', 'schedules'];
const BATCH_LIMIT = 400;

const dryRun = process.argv.includes('--dry-run');
const allowEmulator = process.argv.includes('--allow-emulator');

function readArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) {
    console.error(`Faltou o valor de ${flag}.`);
    process.exit(1);
  }
  return value;
}

function needsOwner(value) {
  return typeof value !== 'string' || value.trim() === '';
}

function loadCredential() {
  const file = readArg('--service-account');
  if (file) {
    return cert(JSON.parse(readFileSync(file, 'utf8')));
  }
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error(
      'Defina GOOGLE_APPLICATION_CREDENTIALS ou passe --service-account <arquivo.json>.',
    );
    process.exit(1);
  }
  return applicationDefault();
}

if (process.env.FIRESTORE_EMULATOR_HOST && !allowEmulator) {
  console.error(
    'FIRESTORE_EMULATOR_HOST está definido. Remova a variável ou passe --allow-emulator.',
  );
  process.exit(1);
}

const projectId =
  readArg('--project') ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  'petmanager-6621d';

let db;
try {
  initializeApp({
    credential: loadCredential(),
    projectId,
  });
  db = getFirestore();
} catch (error) {
  console.error('Não foi possível iniciar o Firebase Admin.');
  console.error(error instanceof Error ? error.message : 'Erro desconhecido');
  process.exit(1);
}

async function main() {
  console.log(`${dryRun ? 'Simulação' : 'Backfill'} no projeto ${projectId}.`);

  const dogs = await db.collection('dogProfiles').get();
  const summary = {
    dogs: dogs.size,
    dogsWithoutOwner: [],
    scanned: 0,
    stamped: 0,
    alreadyOwned: 0,
    skippedForeign: 0,
  };
  let batch = db.batch();
  let batchCount = 0;

  async function flush() {
    if (batchCount === 0) return;
    if (!dryRun) await batch.commit();
    batch = db.batch();
    batchCount = 0;
  }

  for (const dog of dogs.docs) {
    const ownerId = dog.get('userId');
    if (needsOwner(ownerId)) {
      summary.dogsWithoutOwner.push(dog.id);
      continue;
    }

    for (const collectionName of DOG_SCOPED_COLLECTIONS) {
      const children = await db.collection(collectionName).where('dogId', '==', dog.id).get();
      for (const child of children.docs) {
        summary.scanned += 1;
        const current = child.get('userId');
        if (!needsOwner(current)) {
          if (current === ownerId) summary.alreadyOwned += 1;
          else summary.skippedForeign += 1;
          continue;
        }
        summary.stamped += 1;
        if (!dryRun) {
          batch.update(child.ref, { userId: ownerId });
          batchCount += 1;
          if (batchCount >= BATCH_LIMIT) await flush();
        }
      }
    }
  }

  await flush();

  console.log(`Perfis de cão: ${summary.dogs}`);
  console.log(`Perfis sem userId (filhos não alterados): ${summary.dogsWithoutOwner.length}`);
  if (summary.dogsWithoutOwner.length > 0) {
    console.log(`Ids: ${summary.dogsWithoutOwner.slice(0, 20).join(', ')}`);
  }
  console.log(`Documentos lidos: ${summary.scanned}`);
  console.log(`Já tinham o userId do cão: ${summary.alreadyOwned}`);
  console.log(`Mantidos porque o userId é de outra conta: ${summary.skippedForeign}`);
  console.log(`${dryRun ? 'Seriam gravados' : 'Gravados'}: ${summary.stamped}`);
}

main().catch((error) => {
  console.error('Backfill falhou.');
  console.error(error instanceof Error ? error.message : 'Erro desconhecido');
  process.exit(1);
});
