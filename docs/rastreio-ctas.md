# Rastreio de cliques nos CTAs

Mede **qual botão e qual posição convertem** — o que o Cloudflare Web Analytics
não dá (ele mede páginas, não eventos). Mesmo padrão da captação de leads:
Pages Function + D1, sem serviço externo e sem mudança na CSP.

## Peças

| Arquivo | Papel |
|---|---|
| `functions/event.js` | Recebe `POST /event`, valida contra allowlist e grava no D1 (binding `DB`). |
| `db/schema.sql` | Tabela `events` (`event`, `label`, `location`, `created_at`). |
| `js/main.js` (`setupCtaTracking` / `sendEvent`) | Delegação de clique em `[data-cta]` → `navigator.sendBeacon('/event')`. |
| `index.html` | Cada CTA carrega `data-cta` (o quê) e `data-cta-local` (onde). |

## O que é medido

| `label` | `location` |
|---|---|
| `solicitar-diagnostico` | `navbar`, `hero`, `servicos`, `como-funciona` |
| `whatsapp` | `hero`, `contato`, `footer` |

São **7 CTAs** no total. Os valores aceitos vivem na constante `ALLOWED` em
`functions/event.js` — o endpoint é público, então texto livre seria um convite a
poluir a tabela: qualquer valor fora da lista responde `400` e não grava nada.

**Ao adicionar um CTA novo:** marque com `data-cta` + `data-cta-local` no HTML
e, se o rótulo ou a posição forem novos, inclua-os na `ALLOWED`. Sem isso o
clique é rejeitado silenciosamente (o front é best-effort de propósito).

## Privacidade

Grava só os dois rótulos e o horário — **sem IP, user-agent, referer ou
identificador de sessão**. É contagem agregada e anônima, não perfil de
visitante. (Diferente de `/contact`, onde o lead é um contato identificado de
propósito — ver `docs/captacao-leads-d1.md`.)

## Ver os resultados

```bash
npm run events
```

Retorna cliques por `label` + `location`, do maior para o menor, com a data do
último. Para a série temporal:

```bash
npx wrangler d1 execute olivia-tech-leads --remote --command="SELECT date(created_at) AS dia, label, location, COUNT(*) AS cliques FROM events GROUP BY dia, label, location ORDER BY dia DESC"
```

## Por que `sendBeacon`

O CTA do WhatsApp navega para fora (`wa.me`), e um `fetch` comum pode ser
cancelado quando a página é descarregada — o clique mais importante seria
justamente o que se perde. `sendBeacon` entrega em background mesmo com a página
saindo. `fetch` com `keepalive` fica como fallback para navegador sem suporte.

## Limitação conhecida

Isto conta **cliques, não conversões completas**. Um clique no WhatsApp não
garante que a pessoa enviou a mensagem. Para o funil fechado, cruze com os leads
gravados em `/contact` (`npm run leads`).
