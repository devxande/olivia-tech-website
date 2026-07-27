// Testes da lógica do health-check (functions/health.js).
// Runner nativo do Node, sem dependências:  node --test "functions/*.test.js"
//
// Cobrem o corpo/headers do 200 em GET e o 405 em métodos não-GET.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestGet, onRequest } from './health.js';

test('GET /health responde 200 com {"ok":true} em JSON', async () => {
  const res = onRequestGet();
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /application\/json/);
  const body = await res.json();
  assert.deepEqual(body, { ok: true });
});

test('GET /health nunca é cacheado (Cache-Control: no-store)', () => {
  const res = onRequestGet();
  assert.equal(res.headers.get('cache-control'), 'no-store');
});

test('onRequest deixa GET passar para onRequestGet (retorna undefined)', () => {
  const res = onRequest({ request: { method: 'GET' } });
  assert.equal(res, undefined);
});

test('métodos diferentes de GET em /health respondem 405', async () => {
  for (const method of ['POST', 'PUT', 'DELETE', 'HEAD']) {
    const res = onRequest({ request: { method } });
    assert.equal(res.status, 405, `${method} deveria dar 405`);
    const body = await res.json();
    assert.equal(body.error, 'method_not_allowed');
  }
});
