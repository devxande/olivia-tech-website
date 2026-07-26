# Notificação de lead novo — e-mail via Resend

Quando o formulário grava um lead no D1 com sucesso, a Function `/contact` dispara
um **e-mail de aviso** para que o lead seja atendido rápido (lead B2B esfria). O
envio usa o **Resend** (API transacional) por um `fetch` HTTPS server-side.

> **Por que não o Email Routing do Cloudflare?** O `send_email` binding existe em
> Workers, mas **não é exposto em Pages Functions** (não aparece na lista de
> bindings do projeto Pages). Como o site roda em Pages, esse caminho não é
> possível sem um Worker separado — optou-se pelo Resend, que funciona direto via
> `fetch`. A CSP do site não afeta isso: ela vale para o browser, não para
> chamadas feitas de dentro da Function.

O aviso é **best-effort e assíncrono**: roda via `context.waitUntil(...)`, então
não segura a resposta ao usuário nem atrasa a abertura do WhatsApp. Se o envio
falhar (rede, erro do Resend, key ausente), o erro morre em silêncio — o lead
**já está salvo** no D1.

## O que chega no e-mail

Assunto `Novo lead: <nome> — <empresa>` e corpo (texto puro) com **nome, empresa,
e-mail, telefone e mensagem**. O `reply_to` aponta para o e-mail do lead, então
basta **responder o e-mail** para falar direto com ele.

## Peças

| Arquivo | Papel |
|---|---|
| `functions/contact.js` (`notifyNewLead`) | Faz o POST no Resend após o `INSERT` bem-sucedido, via `waitUntil`. |
| `functions/contact.js` (`buildLeadEmail`) | Monta o payload JSON do Resend. Função pura, testável. |
| `functions/contact.test.js` | Testes com mock de `fetch`: payload e comportamento best-effort. |

## Setup (uma vez) — exige sua ação

1. **Conta no Resend** ([resend.com](https://resend.com)) e **verificação do
   domínio** `oliviatech.com.br`: no painel do Resend, em **Domains → Add Domain**,
   adicione `oliviatech.com.br` e crie no DNS do Cloudflare os registros que ele
   pedir (SPF/DKIM — normalmente uns TXT e um CNAME). Sem o domínio verificado, o
   Resend só envia de `onboarding@resend.dev` (bom só para teste).

2. **Criar a API key** no Resend (**API Keys → Create**) — permissão de envio.

3. **Configurar no projeto Pages** (Cloudflare → **olivia-tech-website** →
   **Settings → Variables and Secrets → Add**):
   - Tipo **Secret** → nome `RESEND_API_KEY`, valor = a key do Resend. **(secret,
     não plaintext)**
   - Tipo **Plaintext** → nome `NOTIFY_TO`, valor = destino do aviso. Padrão do
     código: `contato@oliviatech.com.br` (que o alias do Email Routing encaminha
     para `allexandrels3@gmail.com`). Pode apontar direto para o Gmail se preferir.
   - *(opcional)* Tipo **Plaintext** → nome `NOTIFY_FROM`, remetente num domínio
     **verificado no Resend** (padrão: `Olivia Tech <no-reply@oliviatech.com.br>`).

4. **Redeploy:** Deployments → último deploy → **Retry deployment** (ou um novo
   push) para as variáveis valerem.

Enquanto `RESEND_API_KEY` não existir, o lead continua sendo gravado normalmente e
**nenhum e-mail é enviado** (a notificação simplesmente não roda).

## Testar

Lógica com mock (runner nativo do Node, sem dependências):

```bash
npm test
```

Ponta a ponta, após o deploy: envie um lead de teste pelo formulário do site,
confirme que o e-mail chegou no destino e depois apague o lead de teste do D1:

```bash
npx wrangler d1 execute olivia-tech-leads --remote --command="DELETE FROM leads WHERE email='<email-do-teste>'"
```

## Segurança

A `RESEND_API_KEY` fica só como **Secret** no Cloudflare (nunca no repositório
nem no front). O envio é server-side; a CSP estrita do site permanece inalterada.
Nenhuma dependência de build foi adicionada — o envio usa `fetch` nativo.
