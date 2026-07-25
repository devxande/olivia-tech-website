// Cloudflare Pages Function — rastreio de cliques nos CTAs.
// Recebe POST em /event (mesmo domínio, compatível com a CSP `connect-src 'self'`)
// e grava o evento no banco D1 vinculado como `DB`.
//
// Binding: o mesmo de /contact (Settings → Functions → D1 bindings → DB).
//
// Por que allowlist em vez de texto livre: o endpoint é público, então aceitar
// strings arbitrárias deixaria qualquer um poluir a tabela. Só os rótulos abaixo
// entram; qualquer outro valor é rejeitado com 400.
//
// Não guardamos IP, user-agent nem referer aqui — a medição é agregada e anônima
// (diferente de /contact, onde o lead é um contato identificado de propósito).

const ALLOWED = {
  event: ['cta_click'],
  label: ['solicitar-diagnostico', 'whatsapp'],
  location: ['navbar', 'hero', 'servicos', 'como-funciona', 'contato', 'footer'],
};

export async function onRequestPost({ request, env }) {
  let data;
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      data = await request.json();
    } else {
      // sendBeacon pode chegar como text/plain com corpo JSON.
      data = JSON.parse(await request.text());
    }
  } catch (_) {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }

  const s = (v) => (v == null ? '' : String(v)).trim();
  const event = s(data.event) || 'cta_click';
  const label = s(data.label);
  const location = s(data.location);

  if (
    !ALLOWED.event.includes(event) ||
    !ALLOWED.label.includes(label) ||
    !ALLOWED.location.includes(location)
  ) {
    return json({ ok: false, error: 'invalid_value' }, 400);
  }

  if (!env.DB) return json({ ok: false, error: 'storage_unavailable' }, 503);

  try {
    await env.DB.prepare(
      'INSERT INTO events (event, label, location, created_at) VALUES (?, ?, ?, ?)'
    )
      .bind(event, label, location, new Date().toISOString())
      .run();
  } catch (_) {
    return json({ ok: false, error: 'storage_failed' }, 500);
  }

  // 204: o navegador não precisa de corpo (sendBeacon ignora a resposta).
  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}

// Qualquer método diferente de POST em /event.
export function onRequest({ request }) {
  if (request.method === 'POST') return; // tratado por onRequestPost
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
