#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  isDirectRun,
  normalizePrivateKey,
  parseServiceAccount,
  reportAndExit,
} from "./store-release-lib.mjs";

export function materializeStoreCredentials({ ascKeyRaw, playJsonRaw, directory }) {
  const privateKey = normalizePrivateKey(ascKeyRaw);
  const serviceAccount = parseServiceAccount(playJsonRaw);
  fs.mkdirSync(directory, { recursive: true });
  const ascKeyPath = path.join(directory, "AuthKey.p8");
  const playJsonPath = path.join(directory, "play-service-account.json");
  fs.writeFileSync(ascKeyPath, privateKey, { mode: 0o600 });
  fs.writeFileSync(playJsonPath, `${JSON.stringify(serviceAccount)}\n`, { mode: 0o600 });
  fs.chmodSync(ascKeyPath, 0o600);
  fs.chmodSync(playJsonPath, 0o600);
  return { ascKeyPath, playJsonPath, clientEmail: serviceAccount.client_email };
}

function main() {
  const directory = process.env.STORE_CREDENTIALS_DIR || process.env.RUNNER_TEMP || os.tmpdir();
  const written = materializeStoreCredentials({
    ascKeyRaw: process.env.ASC_API_KEY_P8,
    playJsonRaw: process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON,
    directory,
  });
  if (process.env.GITHUB_ENV) {
    fs.appendFileSync(
      process.env.GITHUB_ENV,
      `EXPO_ASC_API_KEY_PATH=${written.ascKeyPath}\nGOOGLE_PLAY_SERVICE_ACCOUNT_JSON_PATH=${written.playJsonPath}\n`,
    );
  }
  console.log(
    `Credenciais de loja gravadas com permissão 600. Service account: ${written.clientEmail}.`,
  );
  return written;
}

if (isDirectRun(import.meta.url)) {
  try {
    main();
  } catch (error) {
    reportAndExit(error);
  }
}
