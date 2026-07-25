// Cloudflare Pages Function — captação de leads do formulário de contato.
// Recebe POST em /contact (mesmo domínio, compatível com a CSP `form-action 'self'`)
// e grava o lead no banco D1 vinculado como `DB`.
//
// Binding necessário (painel do Cloudflare → Settings → Functions → D1 bindings):
//   Variable name: DB   →   database: olivia-tech-leads
//
// A captura é best-effort no front: se aqui falhar, o site ainda abre o WhatsApp.

const LIMITS = { name: 200, company: 200, email: 200, phone: 60, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  let data;
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      data = await request.json();
    } else {
      const form = await request.formData();
      data = Object.fromEntries(form);
    }
  } catch (_) {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }

  const s = (v) => (v == null ? '' : String(v)).trim();
  const name = s(data.name);
  const company = s(data.company);
  const email = s(data.email);
  const phone = s(data.phone);
  const message = s(data.message);

  // Honeypot anti-spam: campo invisível que humanos não preenchem.
  // Se veio preenchido, respondemos ok sem gravar (não damos pista ao bot).
  if (s(data.website)) return json({ ok: true });

  if (!name || !company || !email) return json({ ok: false, error: 'missing_fields' }, 400);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'invalid_email' }, 400);
  if (
    name.length > LIMITS.name ||
    company.length > LIMITS.company ||
    email.length > LIMITS.email ||
    phone.length > LIMITS.phone ||
    message.length > LIMITS.message
  ) {
    return json({ ok: false, error: 'too_long' }, 400);
  }

  if (!env.DB) return json({ ok: false, error: 'storage_unavailable' }, 503);

  try {
    await env.DB.prepare(
      'INSERT INTO leads (name, company, email, phone, message, user_agent, referer, created_at) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(
        name,
        company,
        email,
        phone || null,
        message || null,
        request.headers.get('user-agent') || null,
        request.headers.get('referer') || null,
        new Date().toISOString()
      )
      .run();
  } catch (_) {
    return json({ ok: false, error: 'storage_failed' }, 500);
  }

  return json({ ok: true });
}

// Qualquer método diferente de POST em /contact.
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
