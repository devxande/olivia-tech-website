# Olivia Tech — site institucional

Site da **Olivia Tech**, consultoria de infraestrutura de TI em Brasília/DF.
No ar em **https://oliviatech.com.br** (Cloudflare Pages; cada `push` na `main`
publica automaticamente).

Página única (home) focada em conversão: apresenta os serviços e leva o visitante
a **solicitar um diagnóstico** — pelo formulário (que grava o lead) ou pelo WhatsApp.

---

## Como funciona (arquitetura)

HTML/CSS/JS puro, sem framework, com três camadas leves em cima:

| Camada | O quê | Onde |
|---|---|---|
| **Build** | Minifica e combina CSS/JS e injeta hash de versão nas URLs (cache-busting) | `build.mjs`, `package.json` |
| **Backend** | Cloudflare Pages Functions (serverless) para captar leads e medir conversão | `functions/` |
| **Dados** | Banco D1 (SQLite do Cloudflare) — `olivia-tech-leads` | `db/schema.sql` |

Runtime sem dependências externas, exceto o beacon do Cloudflare Web Analytics.
CSP estrita no `_headers` (`default-src 'self'` + os dois domínios do Analytics).

### Endpoints

| Rota | Método | Faz | Doc |
|---|---|---|---|
| `/contact` | POST | Valida e grava o **lead** no D1 (tabela `leads`) e envia **e-mail de aviso** | [captacao-leads-d1.md](docs/captacao-leads-d1.md) · [notificacao-leads.md](docs/notificacao-leads.md) |
| `/event` | POST | Grava um **clique de CTA** no D1 (tabela `events`), via allowlist | [rastreio-ctas.md](docs/rastreio-ctas.md) |

Ambos são best-effort no front: se o backend falhar, o site (e o WhatsApp)
continua funcionando normalmente.

---

## Comandos

```bash
npm install        # instala as deps de build (csso, terser)
npm run build      # gera css/app.min.css e js/main.min.js + injeta ?v=hash no HTML
npm run dev        # preview local com Functions + D1 (wrangler pages dev)
```

Operação do banco (precisa de `wrangler` autenticado — `npx wrangler login`):

```bash
npm run leads      # últimos leads recebidos
npm run events     # cliques por CTA e posição (medição de conversão)
npm run db:schema  # (re)aplica db/schema.sql em produção (idempotente)
```

Testes da lógica das Functions (runner nativo do Node, sem deps):

```bash
npm test           # node --test functions/
```

> **`.min` e `node_modules/` não são versionados** — o Cloudflare os regenera no
> deploy. Edite as **fontes** (`css/*.css`, `js/main.js`) e rode `npm run build`
> antes de commitar (o build também atualiza o `?v=` no HTML).

---

## Estrutura

```
index.html / 404.html        páginas (refs de css/js com ?v=hash)
_headers                     CSP + Cache-Control por rota
robots.txt / sitemap.xml     SEO
package.json / build.mjs     build (csso + terser + cache-busting)
.nvmrc                       Node 20 (usado no build do Cloudflare)
css/  tokens.css, styles.css (fontes) · app.min.css (gerado)
js/   main.js (fonte) · main.min.js (gerado)
functions/  contact.js (/contact) · event.js (/event)
db/   schema.sql (tabelas leads e events)
assets/  favicon, apple-touch-icon, og-image, fonts/ (Manrope, Inter)
docs/  documentação (ver abaixo)
```

---

## Documentação

- [mini-prd-home-olivia-tech.md](docs/mini-prd-home-olivia-tech.md) — especificação funcional da home (conteúdo, CTAs, requisitos).
- [deploy-cloudflare-pages.md](docs/deploy-cloudflare-pages.md) — publicação no Cloudflare Pages, config de build e domínio.
- [captacao-leads-d1.md](docs/captacao-leads-d1.md) — backend de leads (`/contact` + D1), setup do binding.
- [notificacao-leads.md](docs/notificacao-leads.md) — aviso de lead novo por e-mail (Resend, via `fetch` server-side).
- [rastreio-ctas.md](docs/rastreio-ctas.md) — rastreio de conversão nos CTAs (`/event` + D1).
- [web-analytics.md](docs/web-analytics.md) — Cloudflare Web Analytics (páginas, sem cookies).
- [seo-google.md](docs/seo-google.md) — presença no Google: SEO local (feito no repo) + passo a passo do Search Console e do Business Profile.
- [assets-guia.md](docs/assets-guia.md) — guia de imagens/fontes.

---

## Notas para manutenção

- **Ao adicionar um CTA novo:** marque o elemento com `data-cta` (o rótulo) e
  `data-cta-local` (a posição) no HTML. Se o rótulo ou a posição forem **novos**,
  inclua-os também na constante `ALLOWED` em `functions/event.js` — senão o clique
  é rejeitado (400) e não é contado. Detalhes em [rastreio-ctas.md](docs/rastreio-ctas.md).
- **WhatsApp:** o número (`5561981399376`) fica na constante `WHATSAPP_NUMBER` em
  `js/main.js`; os `href` no HTML são só fallback.
- **Diretriz de conteúdo:** nunca inventar clientes, depoimentos, números,
  certificações ou parceiros. Prova social só com casos reais.
