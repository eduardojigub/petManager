#!/usr/bin/env node
import fs from "node:fs";

import {
  ReleaseError,
  assertRemoteVersions,
  isDirectRun,
  parseEasJsonOutput,
  readStoreVersionFiles,
  reportAndExit,
} from "./store-release-lib.mjs";

function main() {
  const file = process.argv[2];
  if (!file) {
    throw new ReleaseError("Uso: assert-remote-versions.mjs <eas-build-version.json>");
  }
  const remote = parseEasJsonOutput(fs.readFileSync(file, "utf8"));
  const floors = readStoreVersionFiles(process.env.APP_JSON || "app.json");
  const remoteVersions = assertRemoteVersions({
    remote,
    iosFloor: floors.iosBuildNumber,
    androidFloor: floors.androidVersionCode,
  });
  console.log(
    `Contadores remotos da EAS: iOS ${remoteVersions.ios}, Android ${remoteVersions.android}. O próximo build de produção soma 1 em cada plataforma.`,
  );
}

if (isDirectRun(import.meta.url)) {
  try {
    main();
  } catch (error) {
    reportAndExit(error);
  }
}
