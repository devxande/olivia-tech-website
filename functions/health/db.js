// Cloudflare Pages Function — health-check com validação do D1.
// Responde GET /health/db com 200 `{"ok":true,"db":true}` se o banco D1 (binding
// `DB`) responder a um `SELECT 1`.
//
// CUSTO: cada chamada faz uma leitura no D1. Por isso NÃO é a rota padrão do
// monitor — apontar um monitor de intervalo curto aqui geraria uma leitura no
// banco a cada check, sem necessidade. Use esta rota só para checagem manual
// (ou um monitor de intervalo longo) quando quiser confirmar o caminho completo
// Pages → D1. Para uptime do site, o monitor deve bater em /health (functions/health.js).

export async function onRequestGet({ env }) {
  if (!env || !env.DB) return json({ ok: false, error: 'storage_unavailable' }, 503);
  try {
    await env.DB.prepare('SELECT 1').first();
  } catch (_) {
    return json({ ok: false, error: 'db_failed' }, 500);
  }
  return json({ ok: true, db: true }, 200);
}

// Qualquer método diferente de GET em /health/db.
export function onRequest({ request }) {
  if (request.method === 'GET') return; // tratado por onRequestGet
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
