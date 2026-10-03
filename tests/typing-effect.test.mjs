import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

test('typing animation clears both delayed and active work on unmount or text change', () => {
  const source = readFileSync(new URL('../hooks/useTypingEffect.ts', import.meta.url), 'utf8');
  const routeModule = { exports: {} };
  let effect, delay, cleanup;
  const intervals = new Set(), timeouts = new Set();
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    module: routeModule, exports: routeModule.exports,
    require: () => ({ useState: (value) => [value, () => {}], useEffect: (fn) => { effect = fn; } }),
    setTimeout: (fn) => { delay = fn; timeouts.add(1); return 1; }, clearTimeout: (id) => timeouts.delete(id),
    setInterval: () => { intervals.add(2); return 2; }, clearInterval: (id) => intervals.delete(id),
  });
  routeModule.exports.useTypingEffect('hello');
  cleanup = effect(); cleanup();
  assert.equal(timeouts.size, 0);
  cleanup = effect(); delay();
  assert.equal(intervals.size, 1);
  cleanup();
  assert.equal(intervals.size, 0);
  assert.equal(timeouts.size, 0);
});
