// Testes da lógica de notificação de leads (functions/contact.js).
// Runner nativo do Node, sem dependências:  node --test "functions/*.test.js"
//
// Cobrem a função pura que monta o payload do Resend e o comportamento
// best-effort de notifyNewLead (guarda quando falta a key; nunca lança).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLeadEmail, notifyNewLead } from './contact.js';

const FROM = 'Olivia Tech <no-reply@oliviatech.com.br>';
const TO = 'contato@oliviatech.com.br';
const LEAD = {
  name: 'João Ração',
  company: 'Café & Cia Ltda',
  email: 'joao@cafeecia.com.br',
  phone: '+55 61 99999-0000',
  message: 'Preciso de suporte de infraestrutura para 3 filiais.',
};

test('buildLeadEmail inclui todos os campos do lead no corpo de texto', () => {
  const p = buildLeadEmail({ from: FROM, to: TO, lead: LEAD });
  assert.match(p.text, /João Ração/);
  assert.match(p.text, /Café & Cia Ltda/);
  assert.match(p.text, /joao@cafeecia\.com\.br/);
  assert.match(p.text, /\+55 61 99999-0000/);
  assert.match(p.text, /3 filiais/);
});

test('buildLeadEmail monta o payload do Resend (from, to[], subject)', () => {
  const p = buildLeadEmail({ from: FROM, to: TO, lead: LEAD });
  assert.equal(p.from, FROM);
  assert.deepEqual(p.to, [TO]);
  assert.equal(p.subject, 'Novo lead: João Ração — Café & Cia Ltda');
});

test('buildLeadEmail define reply_to para o e-mail do lead', () => {
  const p = buildLeadEmail({ from: FROM, to: TO, lead: LEAD });
  assert.equal(p.reply_to, 'joao@cafeecia.com.br');
});

test('buildLeadEmail omite reply_to quando o lead não tem e-mail', () => {
  const p = buildLeadEmail({ from: FROM, to: TO, lead: { ...LEAD, email: '' } });
  assert.ok(!('reply_to' in p), 'reply_to não deve existir sem e-mail do lead');
});

test('buildLeadEmail mostra "(não informado)" para telefone/mensagem vazios', () => {
  const p = buildLeadEmail({ from: FROM, to: TO, lead: { ...LEAD, phone: '', message: '' } });
  assert.match(p.text, /Telefone: \(não informado\)/);
  assert.match(p.text, /Mensagem:\n\(não informado\)/);
});

test('notifyNewLead não faz nada e não lança quando falta a RESEND_API_KEY', async () => {
  // Sem key, nem deve tentar chamar fetch.
  const orig = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return new Response('{}');
  };
  try {
    await assert.doesNotReject(notifyNewLead({}, LEAD));
    await assert.doesNotReject(notifyNewLead({ RESEND_API_KEY: '' }, LEAD));
    assert.equal(called, false, 'não deve chamar fetch sem key');
  } finally {
    globalThis.fetch = orig;
  }
});

test('notifyNewLead faz POST no Resend com auth e payload corretos', async () => {
  const orig = globalThis.fetch;
  let url, opts;
  globalThis.fetch = async (u, o) => {
    url = u;
    opts = o;
    return new Response(JSON.stringify({ id: 'abc' }), { status: 200 });
  };
  try {
    await notifyNewLead({ RESEND_API_KEY: 'test_key', NOTIFY_TO: TO, NOTIFY_FROM: FROM }, LEAD);
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(opts.method, 'POST');
    assert.equal(opts.headers.authorization, 'Bearer test_key');
    const body = JSON.parse(opts.body);
    assert.deepEqual(body.to, [TO]);
    assert.match(body.subject, /Novo lead/);
  } finally {
    globalThis.fetch = orig;
  }
});

test('notifyNewLead engole erro do fetch (best-effort)', async () => {
  const orig = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error('falha simulada de rede');
  };
  try {
    await assert.doesNotReject(notifyNewLead({ RESEND_API_KEY: 'k' }, LEAD));
  } finally {
    globalThis.fetch = orig;
  }
});
