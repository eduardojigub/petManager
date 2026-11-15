import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { materializeStoreCredentials } from "./write-store-credentials.mjs";
import {
  ReleaseError,
  assertRemoteVersions,
  assertStoreVersions,
  formatBuildSummary,
  normalizePrivateKey,
  parseEasJsonOutput,
  parseServiceAccount,
  readStoreVersionFiles,
  summarizeEasBuild,
} from "./store-release-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function writeFixture(directory) {
  const appJsonPath = path.join(directory, "app.json");
  const plistPath = path.join(directory, "Info.plist");
  fs.writeFileSync(
    appJsonPath,
    JSON.stringify({
      expo: {
        version: "2.0.6",
        ios: { buildNumber: "204" },
        android: { versionCode: 204 },
      },
    }),
  );
  fs.writeFileSync(
    plistPath,
    `<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0"><dict>
  <key>CFBundleShortVersionString</key>
  <string>2.0.6</string>
  <key>CFBundleVersion</key>
  <string>204</string>
</dict></plist>`,
  );
  return { appJsonPath, plistPath };
}

test("app.json e Info.plist do repositório concordam na versão de loja", () => {
  const files = readStoreVersionFiles(path.join(root, "app.json"), path.join(root, "ios/PetLife/Info.plist"));
  assert.equal(files.marketingVersion, "2.0.6");
  assert.equal(files.marketingVersion, files.iosMarketingVersion);
  assert.equal(files.iosBuildNumber, files.iosPlistBuildNumber);
  assert.equal(files.iosBuildNumber, 205);
  assert.equal(files.androidVersionCode, 205);
  assert.doesNotThrow(() => assertStoreVersions(files, { sourceLabel: "deste commit" }));
});

test("recusa versão de loja divergente entre app.json e Info.plist", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "store-version-"));
  const paths = writeFixture(directory);
  const plist = fs.readFileSync(paths.plistPath, "utf8").replace("2.0.6", "2.0.7");
  fs.writeFileSync(paths.plistPath, plist);
  const files = readStoreVersionFiles(paths.appJsonPath, paths.plistPath);
  assert.throws(
    () => assertStoreVersions(files, { sourceLabel: "deste commit" }),
    /CFBundleShortVersionString/,
  );
});

test("contador remoto abaixo do piso impede o build", () => {
  assert.throws(
    () => assertRemoteVersions({ remote: { buildNumber: "10", versionCode: "204" }, iosFloor: 204, androidFloor: 204 }),
    ReleaseError,
  );
  assert.deepEqual(
    assertRemoteVersions({ remote: { buildNumber: "204", versionCode: 210 }, iosFloor: 204, androidFloor: 204 }),
    { ios: 204, android: 210 },
  );
  assert.throws(
    () => assertRemoteVersions({ remote: {}, iosFloor: 204, androidFloor: 204 }),
    /eas build:version:set/,
  );
});

test("JSON da EAS com prefixo ainda vira um resumo de build finished", () => {
  const payload = parseEasJsonOutput(
    `aguarde\n${JSON.stringify([
      {
        id: "build-1",
        status: "finished",
        platform: "IOS",
        appVersion: "2.0.6",
        appBuildVersion: "205",
        gitCommitHash: "abc",
        buildProfile: "production",
        distribution: "STORE",
      },
    ])}`,
  );
  const build = summarizeEasBuild(payload);
  assert.equal(build.platform, "ios");
  assert.equal(build.appBuildVersion, "205");
  const summary = formatBuildSummary(build);
  assert.match(summary, /TestFlight/);
  assert.match(summary, /build `205`/);
  assert.doesNotMatch(summary, /workflow de promoção/i);
});

test("resumo recusa build que não terminou", () => {
  assert.throws(
    () => summarizeEasBuild({ id: "build-1", status: "errored", appBuildVersion: "1" }),
    /errored/i,
  );
});

test("chave .p8 e JSON da Play aceitam PEM, base64 e quebras escapadas", () => {
  const pem = "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n";
  assert.equal(normalizePrivateKey(pem), pem);
  assert.equal(normalizePrivateKey(Buffer.from(pem).toString("base64")), pem);
  assert.equal(
    normalizePrivateKey("-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----"),
    pem,
  );
  assert.throws(() => normalizePrivateKey("nao-e-chave"), ReleaseError);

  const account = {
    client_email: "play@project.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n",
  };
  assert.equal(parseServiceAccount(JSON.stringify(account)).client_email, account.client_email);
  assert.equal(
    parseServiceAccount(Buffer.from(JSON.stringify(account)).toString("base64")).client_email,
    account.client_email,
  );
  assert.throws(() => parseServiceAccount("{}"), /client_email/);
});

test("credenciais são gravadas com permissão 600 e sem vazar a chave no nome", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "store-creds-"));
  const { privateKey } = crypto.generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const pem = privateKey.export({ type: "pkcs8", format: "pem" });
  const written = materializeStoreCredentials({
    ascKeyRaw: pem,
    playJsonRaw: JSON.stringify({
      client_email: "play@project.iam.gserviceaccount.com",
      private_key: "secret-key",
    }),
    directory,
  });
  assert.equal(fs.statSync(written.ascKeyPath).mode & 0o777, 0o600);
  assert.equal(fs.statSync(written.playJsonPath).mode & 0o777, 0o600);
  assert.equal(fs.readFileSync(written.ascKeyPath, "utf8"), pem.endsWith("\n") ? pem : `${pem}\n`);
  assert.equal(JSON.parse(fs.readFileSync(written.playJsonPath, "utf8")).private_key, "secret-key");
});

test("eas.json usa versão remota, loja no production e apk no preview", () => {
  const eas = JSON.parse(fs.readFileSync(path.join(root, "eas.json"), "utf8"));
  assert.equal(eas.cli.appVersionSource, "remote");
  assert.equal(eas.cli.promptToConfigurePushNotifications, false);
  assert.equal(eas.build.production.autoIncrement, true);
  assert.equal(eas.build.production.distribution, "store");
  assert.equal(eas.build.production.android.buildType, "app-bundle");
  assert.equal(eas.build.preview.autoIncrement, undefined);
  assert.equal(eas.build.preview.ios.distribution, "internal");
  assert.equal(eas.build.preview.android.distribution, "internal");
  assert.equal(eas.build.preview.android.buildType, "apk");
  assert.equal(eas.submit.internal.android.track, "internal");
  assert.equal(eas.submit.internal.android.releaseStatus, "completed");
  assert.equal(eas.submit.internal.ios.ascAppId, "6737129802");
  assert.equal(eas.submit.internal.ios.appleTeamId, "BV4VDJR9GL");
  assert.equal(eas.submit.production, undefined);
});

test("o workflow de teste interno é manual e não publica em produção", () => {
  const workflowDir = path.join(root, ".github/workflows");
  const names = fs.readdirSync(workflowDir);
  assert.deepEqual(names, ["internal-testing.yml"]);
  const yaml = fs.readFileSync(path.join(workflowDir, "internal-testing.yml"), "utf8");
  assert.match(yaml, /workflow_dispatch:/);
  assert.doesNotMatch(yaml, /^\s*push:/m);
  assert.doesNotMatch(yaml, /git push/);
  assert.match(yaml, /contents:\s*read/);
  assert.match(yaml, /--profile production/);
  assert.match(yaml, /--profile internal/);
  assert.match(yaml, /track: internal|profile internal/);
  assert.doesNotMatch(yaml, /promote-production/);
});
