// Cloudflare Pages Function — health-check leve para monitor de uptime externo.
// Responde GET /health com 200 e um corpo mínimo `{"ok":true}`.
//
// De propósito NÃO toca no D1 nem em nenhum serviço externo: só confirma que o
// Pages está de pé e servindo Functions. É a rota que o monitor externo
// (UptimeRobot) bate a cada poucos minutos, então precisa ser barata e rápida —
// sem custo de leitura no banco a cada check.
//
// Se quiser um check que também valide o D1, use a rota separada `/health/db`
// (functions/health/db.js) — ela faz um `SELECT 1` e por isso conta como uma
// leitura no D1 a cada chamada; não aponte o monitor para ela por padrão.
//
// Sem cache: a resposta traz `Cache-Control: no-store` (e o _headers reforça),
// senão o monitor poderia ver um 200 velho em cache enquanto o site está fora.

export function onRequestGet() {
  return json({ ok: true }, 200);
}

// Qualquer método diferente de GET em /health.
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
