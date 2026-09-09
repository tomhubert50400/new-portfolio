import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const resumePaths = ["fr", "en"].map(
  (locale) =>
    new URL(`../public/Hubert_Tom_CV_${locale.toUpperCase()}.pdf`, import.meta.url),
);
const heroPath = new URL("../components/sections/Hero.tsx", import.meta.url);
const localePaths = ["fr", "en", "kr"].map(
  (locale) => new URL(`../messages/${locale}.json`, import.meta.url),
);

test("the hero exposes translated French and English resume downloads", async () => {
  const [frenchResume, englishResume, hero, ...localeFiles] = await Promise.all([
    ...resumePaths.map((path) => readFile(path)),
    readFile(heroPath, "utf8"),
    ...localePaths.map((path) => readFile(path, "utf8")),
  ]);

  assert.equal(frenchResume.subarray(0, 4).toString(), "%PDF");
  assert.equal(englishResume.subarray(0, 4).toString(), "%PDF");
  assert.match(hero, /href="\/Hubert_Tom_CV_FR\.pdf"/);
  assert.match(hero, /download="Hubert_Tom_CV_FR\.pdf"/);
  assert.match(hero, /href="\/Hubert_Tom_CV_EN\.pdf"/);
  assert.match(hero, /download="Hubert_Tom_CV_EN\.pdf"/);
  assert.match(hero, /t\("downloadCvFr"\)/);
  assert.match(hero, /t\("downloadCvEn"\)/);

  for (const localeFile of localeFiles) {
    const messages = JSON.parse(localeFile);
    for (const key of ["downloadCvFr", "downloadCvEn"]) {
      assert.equal(typeof messages.hero[key], "string");
      assert.ok(messages.hero[key].trim().length > 0);
    }
  }
});
