import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const resumePath = new URL("../public/Hubert_Tom_CV.pdf", import.meta.url);
const heroPath = new URL("../components/sections/Hero.tsx", import.meta.url);
const localePaths = ["fr", "en", "kr"].map(
  (locale) => new URL(`../messages/${locale}.json`, import.meta.url),
);

test("the hero exposes a translated downloadable public resume", async () => {
  const [resume, hero, ...localeFiles] = await Promise.all([
    readFile(resumePath),
    readFile(heroPath, "utf8"),
    ...localePaths.map((path) => readFile(path, "utf8")),
  ]);

  assert.equal(resume.subarray(0, 4).toString(), "%PDF");
  assert.match(hero, /href="\/Hubert_Tom_CV\.pdf"/);
  assert.match(hero, /download="Hubert_Tom_CV\.pdf"/);
  assert.match(hero, /t\("downloadCv"\)/);

  for (const localeFile of localeFiles) {
    const messages = JSON.parse(localeFile);
    assert.equal(typeof messages.hero.downloadCv, "string");
    assert.ok(messages.hero.downloadCv.trim().length > 0);
  }
});
