// Testes da lógica de notificação de leads (functions/contact.js).
// Runner nativo do Node, sem dependências:  node --test functions/contact.test.js
//
// Cobrem a função pura de montagem do e-mail e o comportamento best-effort de
// notifyNewLead (guarda quando o binding falta; nunca lança).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLeadEmail, notifyNewLead } from './contact.js';

const LEAD = {
  name: 'João Ração',
  company: 'Café & Cia Ltda',
  email: 'joao@cafeecia.com.br',
  phone: '+55 61 99999-0000',
  message: 'Preciso de suporte de infraestrutura para 3 filiais.',
};

test('buildLeadEmail inclui todos os campos do lead no corpo', () => {
  const raw = buildLeadEmail({ from: 'no-reply@oliviatech.com.br', to: 'contato@oliviatech.com.br', lead: LEAD });
  assert.match(raw, /João Ração/);
  assert.match(raw, /Café & Cia Ltda/);
  assert.match(raw, /joao@cafeecia\.com\.br/);
  assert.match(raw, /\+55 61 99999-0000/);
  assert.match(raw, /3 filiais/);
});

test('buildLeadEmail monta cabeçalhos MIME válidos', () => {
  const raw = buildLeadEmail({ from: 'no-reply@oliviatech.com.br', to: 'contato@oliviatech.com.br', lead: LEAD });
  assert.match(raw, /^From: Olivia Tech <no-reply@oliviatech\.com\.br>/m);
  assert.match(raw, /^To: <contato@oliviatech\.com\.br>/m);
  assert.match(raw, /^Message-ID: <.+@oliviatech\.com\.br>/m);
  assert.match(raw, /^MIME-Version: 1\.0/m);
  assert.match(raw, /^Content-Type: text\/plain; charset=utf-8/m);
  // separador headers/corpo
  assert.ok(raw.includes('\r\n\r\n'), 'deve ter linha em branco entre cabeçalhos e corpo');
});

test('buildLeadEmail codifica assunto com acento em encoded-word RFC 2047', () => {
  const raw = buildLeadEmail({ from: 'no-reply@oliviatech.com.br', to: 'contato@oliviatech.com.br', lead: LEAD });
  assert.match(raw, /^Subject: =\?utf-8\?B\?.+\?=/m);
});

test('buildLeadEmail define Reply-To para o e-mail do lead', () => {
  const raw = buildLeadEmail({ from: 'no-reply@oliviatech.com.br', to: 'contato@oliviatech.com.br', lead: LEAD });
  assert.match(raw, /^Reply-To: .*<joao@cafeecia\.com\.br>/m);
});

test('buildLeadEmail mostra "(não informado)" para telefone/mensagem vazios', () => {
  const raw = buildLeadEmail({
    from: 'no-reply@oliviatech.com.br',
    to: 'contato@oliviatech.com.br',
    lead: { ...LEAD, phone: '', message: '' },
  });
  assert.match(raw, /Telefone: \(não informado\)/);
});

test('notifyNewLead não faz nada e não lança quando o binding está ausente', async () => {
  await assert.doesNotReject(notifyNewLead({}, LEAD));
  await assert.doesNotReject(notifyNewLead({ SEND_EMAIL: undefined }, LEAD));
});

test('notifyNewLead engole erro do envio (best-effort)', async () => {
  const env = {
    SEND_EMAIL: {
      send() {
        throw new Error('falha simulada no send_email');
      },
    },
  };
  // Mesmo com o send lançando (e sem cloudflare:email disponível no Node),
  // notifyNewLead resolve sem propagar erro.
  await assert.doesNotReject(notifyNewLead(env, LEAD));
});
