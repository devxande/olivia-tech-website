# Captação de leads — Cloudflare Pages Function + D1

O formulário de contato registra cada lead num banco **D1** (SQLite do Cloudflare)
e, em paralelo, abre o WhatsApp já preenchido. A captura é **best-effort**: se o
banco estiver indisponível, o site continua funcionando e o WhatsApp abre normal.

## Peças

| Arquivo | Papel |
|---|---|
| `functions/contact.js` | Pages Function que recebe `POST /contact`, valida e grava no D1 (binding `DB`). |
| `db/schema.sql` | Estrutura da tabela `leads`. |
| `js/main.js` (`saveLead`) | Envia o `fetch` para `/contact` antes de abrir o WhatsApp. |
| Campo honeypot `website` | Anti-spam: invisível; se preenchido, o servidor ignora. |

> A Function POSTa no **próprio domínio**, então a CSP estrita (`form-action 'self'`,
> `connect-src 'self'`) **não precisa de mudança**.

## Setup (uma vez) — exige seu login no Cloudflare

Rode local, autenticando no navegador quando pedir (`npx wrangler login`):

1. **Criar o banco:**
   ```bash
   npm run db:create
   ```
   Anote o `database_id` retornado.

2. **Aplicar o schema em produção:**
   ```bash
   npm run db:schema
   ```

3. **Vincular o banco à Function (painel):**
   Cloudflare → projeto **olivia-tech-website** → **Settings → Functions →
   D1 database bindings → Add binding**:
   - **Variable name:** `DB`
   - **D1 database:** `olivia-tech-leads`

   Depois faça um **Retry deployment** (ou um novo push) para o binding valer.

Enquanto o binding não existe, `/contact` responde `503` e o lead não é gravado —
mas o formulário e o WhatsApp seguem funcionando normalmente.

## Ver os leads

```bash
npm run leads
```

Mostra os 50 mais recentes. Para uma consulta livre:

```bash
npx wrangler d1 execute olivia-tech-leads --remote --command="SELECT * FROM leads ORDER BY created_at DESC"
```

## Testar localmente (opcional)

`wrangler pages dev` emula a Function + um D1 local:

```bash
npx wrangler d1 execute olivia-tech-leads --local --file=db/schema.sql  # cria a tabela local
npm run dev                                                             # sobe o site + Function
```

## LGPD

Os dados coletados (nome, empresa, e-mail, telefone, mensagem) são usados só para
responder à solicitação. O aviso no formulário reflete isso. Se for necessário
retenção/exclusão sob demanda, dá para adicionar uma rotina de expurgo por data
usando a coluna `created_at`.
