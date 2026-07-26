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

export async function onRequestPost(context) {
  const { request, env } = context;
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

  // Lead gravado. Avisa por e-mail em segundo plano (best-effort): usa waitUntil
  // para não segurar a resposta nem atrasar a abertura do WhatsApp no front.
  // Se a notificação falhar, o lead já está salvo — o erro morre em silêncio.
  context.waitUntil(notifyNewLead(env, { name, company, email, phone, message }));

  return json({ ok: true });
}

// Qualquer método diferente de POST em /contact.
export function onRequest({ request }) {
  if (request.method === 'POST') return; // tratado por onRequestPost
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}

// Notifica um lead novo por e-mail via Cloudflare Email Routing (send_email
// binding `SEND_EMAIL`). Tudo aqui é best-effort e nunca lança: a resposta ao
// usuário e o WhatsApp já aconteceram; esta notificação é secundária.
//
// Bindings/vars esperados (painel → Settings → Functions):
//   send_email binding  →  Variable name: SEND_EMAIL, destination: NOTIFY_TO
//   NOTIFY_TO   (var)   →  destino verificado no Email Routing (ex.: contato@oliviatech.com.br)
//   NOTIFY_FROM (var)   →  remetente no domínio (ex.: no-reply@oliviatech.com.br)
export async function notifyNewLead(env, lead) {
  try {
    if (!env || !env.SEND_EMAIL) return; // binding ausente: nada a fazer
    const to = (env.NOTIFY_TO || 'contato@oliviatech.com.br').trim();
    const from = (env.NOTIFY_FROM || 'no-reply@oliviatech.com.br').trim();
    const raw = buildLeadEmail({ from, to, lead });
    const { EmailMessage } = await import('cloudflare:email');
    await env.SEND_EMAIL.send(new EmailMessage(from, to, raw));
  } catch (_) {
    // silêncio proposital — o lead já está salvo
  }
}

// Monta a mensagem MIME (texto puro, UTF-8) com os dados do lead. Função pura,
// sem dependências, para poder ser testada isoladamente.
export function buildLeadEmail({ from, to, lead }) {
  const v = (x) => (x && String(x).trim()) || '(não informado)';
  const subject = `Novo lead: ${lead.name} — ${lead.company}`;
  const body = [
    'Novo lead pelo formulário do site Olivia Tech:',
    '',
    `Nome:     ${v(lead.name)}`,
    `Empresa:  ${v(lead.company)}`,
    `E-mail:   ${v(lead.email)}`,
    `Telefone: ${v(lead.phone)}`,
    '',
    'Mensagem:',
    v(lead.message),
    '',
    '— Responda diretamente a este e-mail para falar com o lead.',
  ].join('\r\n');

  const messageId = `<${crypto.randomUUID()}@oliviatech.com.br>`;
  const replyTo = lead.email
    ? `${encodeHeaderWord(lead.name || '')} <${lead.email}>`.trim()
    : '';

  const headers = [
    `From: Olivia Tech <${from}>`,
    `To: <${to}>`,
    replyTo ? `Reply-To: ${replyTo}` : '',
    `Message-ID: ${messageId}`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
    `Subject: ${encodeHeaderWord(subject)}`,
  ].filter(Boolean);

  return headers.join('\r\n') + '\r\n\r\n' + body + '\r\n';
}

// Codifica um cabeçalho como encoded-word RFC 2047 (base64 UTF-8) só quando há
// caractere fora do ASCII imprimível — evita mojibake em assunto/nome com acento.
function encodeHeaderWord(str) {
  const s = String(str || '');
  if (/^[\x20-\x7E]*$/.test(s)) return s;
  const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  return `=?utf-8?B?${b64}?=`;
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
