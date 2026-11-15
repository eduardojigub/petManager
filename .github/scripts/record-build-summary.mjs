#!/usr/bin/env node
import fs from "node:fs";

import {
  ReleaseError,
  appendStepSummary,
  formatBuildSummary,
  isDirectRun,
  parseEasJsonOutput,
  reportAndExit,
  summarizeEasBuild,
  writeGitHubOutput,
} from "./store-release-lib.mjs";

function main() {
  const file = process.argv[2];
  if (!file) {
    throw new ReleaseError("Uso: record-build-summary.mjs <eas-build.json>");
  }
  const build = summarizeEasBuild(parseEasJsonOutput(fs.readFileSync(file, "utf8")));
  const summary = formatBuildSummary(build);
  console.log(summary);
  appendStepSummary(summary);
  writeGitHubOutput("build_id", build.id);
  writeGitHubOutput("app_version", build.appVersion ?? "");
  writeGitHubOutput("app_build_version", build.appBuildVersion);
}

if (isDirectRun(import.meta.url)) {
  try {
    main();
  } catch (error) {
    reportAndExit(error);
  }
}
