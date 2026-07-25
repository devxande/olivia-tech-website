# Medir conversão — Cloudflare Web Analytics

Analytics de tráfego **grátis e sem cookies** (privacy-friendly, LGPD-tranquilo):
page views, referrers, países, dispositivos e Core Web Vitals. Sem impacto de
consentimento de cookies.

## Método: injeção automática do Pages (sem código no repo)

1. Cloudflare → **Workers & Pages** → projeto **olivia-tech-website**.
2. Aba **Metrics** (ou **Analytics**) → **Web Analytics** → **Enable**.
   - No fluxo do Pages, o Cloudflare **injeta o beacon automaticamente** nas
     páginas servidas; não é preciso colar `<script>` no HTML.
3. Aguarde alguns minutos e confirme os primeiros page views no painel
   **Web Analytics**.

> Alternativa (não usada aqui): setup manual com a tag
> `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"..."}'></script>`
> no `index.html`. Dá controle/versionamento, mas exige o token do site.

## CSP

O beacon exige dois domínios do próprio Cloudflare, já liberados no `_headers`
(liberação cirúrgica, sem cookies):

- `script-src` → `https://static.cloudflareinsights.com`
- `connect-src` → `https://cloudflareinsights.com`

Todo o resto da CSP segue estrito (`default-src 'self'`, `object-src 'none'`, etc.).

## Verificar que está funcionando

No site publicado, no DevTools:
- **Network:** aparece `beacon.min.js` (de `static.cloudflareinsights.com`) e um
  POST para `cloudflareinsights.com/cdn-cgi/rum`.
- **Console:** sem violações de CSP.

## Limitação

O Web Analytics mede **páginas**, não eventos personalizados. O rastreio de
cliques nos CTAs (qual botão e qual posição convertem) é feito por conta própria
pela Function `/event` — ver `docs/rastreio-ctas.md`.
