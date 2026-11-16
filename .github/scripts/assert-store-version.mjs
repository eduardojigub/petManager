#!/usr/bin/env node
import {
  assertMarketingVersion,
  assertStoreVersions,
  isDirectRun,
  readStoreVersionFiles,
  reportAndExit,
} from "./store-release-lib.mjs";

export function checkStoreVersionFiles({
  appJsonPath,
  expectedVersion,
  sourceLabel,
}) {
  const files = readStoreVersionFiles(appJsonPath);
  const checked = assertStoreVersions(files, { expectedVersion, sourceLabel });
  return checked;
}

function main() {
  const expectedVersion = process.env.EXPECTED_VERSION
    ? assertMarketingVersion(process.env.EXPECTED_VERSION)
    : "";
  const sourceLabel = expectedVersion ? "main" : "deste commit";
  const files = checkStoreVersionFiles({
    appJsonPath: process.env.APP_JSON || "app.json",
    expectedVersion,
    sourceLabel,
  });
  console.log(`Versão de loja em ${sourceLabel}: ${files.marketingVersion}.`);
  console.log(
    `Piso do build iOS: ${files.iosBuildNumber}. Piso do versionCode Android: ${files.androidVersionCode}.`,
  );
}

if (isDirectRun(import.meta.url)) {
  try {
    main();
  } catch (error) {
    reportAndExit(error);
  }
}
