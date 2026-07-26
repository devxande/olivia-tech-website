# Notificação de lead novo — e-mail via Cloudflare Email Routing

Quando o formulário grava um lead no D1 com sucesso, a Function `/contact` dispara
um **e-mail de aviso** para que o lead seja atendido rápido (lead B2B esfria). O
envio usa o **`send_email` binding** do Cloudflare Email Routing — sem serviço
externo, sem API key e sem dependência nova (o MIME é montado à mão em
`functions/contact.js`).

O aviso é **best-effort e assíncrono**: roda via `context.waitUntil(...)`, então
não segura a resposta ao usuário nem atrasa a abertura do WhatsApp. Se a
notificação falhar, o erro morre em silêncio — o lead **já está salvo** no D1.

## O que chega no e-mail

Assunto `Novo lead: <nome> — <empresa>` e corpo com **nome, empresa, e-mail,
telefone e mensagem**. O `Reply-To` aponta para o e-mail do lead, então basta
**responder o e-mail** para falar direto com ele.

## Peças

| Arquivo | Papel |
|---|---|
| `functions/contact.js` (`notifyNewLead`) | Dispara o e-mail após o `INSERT` bem-sucedido, via `waitUntil`. |
| `functions/contact.js` (`buildLeadEmail`) | Monta a mensagem MIME (texto puro, UTF-8). Função pura, testável. |
| `functions/contact.test.js` | Testes com mock: montagem do MIME e comportamento best-effort. |

## Setup (uma vez) — exige seu login no painel do Cloudflare

O `send_email` binding só entrega para **endereços de destino verificados** no
Email Routing. Passos:

1. **Ativar o Email Routing** no domínio `oliviatech.com.br`
   (Cloudflare → domínio → **Email → Email Routing**), se ainda não estiver.

2. **Verificar o destino:** em **Email Routing → Destination addresses**, adicione
   e confirme `contato@oliviatech.com.br` (clique no link de verificação que chega
   na caixa). Só endereços verificados podem receber do binding.

3. **Adicionar o binding na Function:** Cloudflare → projeto
   **olivia-tech-website** → **Settings → Functions → Send Email bindings →
   Add binding**:
   - **Variable name:** `SEND_EMAIL`
   - **Destination address:** `contato@oliviatech.com.br` (o destino verificado)

4. **(Opcional) Variáveis de ambiente** em **Settings → Environment variables**,
   caso queira mudar remetente/destino sem tocar no código:
   - `NOTIFY_TO`   → destino (padrão: `contato@oliviatech.com.br`)
   - `NOTIFY_FROM` → remetente no domínio (padrão: `no-reply@oliviatech.com.br`)

5. **Retry deployment** (ou novo push) para o binding valer.

Enquanto o binding `SEND_EMAIL` não existir, o lead continua sendo gravado
normalmente e **nenhum e-mail é enviado** (a notificação simplesmente não roda).

## Testar

Lógica com mock (runner nativo do Node, sem dependências):

```bash
npm test
```

Ponta a ponta, após o deploy: envie um lead de teste pelo formulário do site,
confirme que o e-mail chegou em `contato@oliviatech.com.br` e depois apague o
lead de teste do D1:

```bash
npx wrangler d1 execute olivia-tech-leads --remote --command="DELETE FROM leads WHERE email='<email-do-teste>'"
```

## Por que não outro canal

- **Serviço transacional (Resend etc.):** melhor entregabilidade, mas exige conta
  externa + API key como secret. Ficou como plano B se a entrega do Email Routing
  não for suficiente.
- **WhatsApp:** a API oficial (Meta/WhatsApp Business Cloud) exige conta Business,
  número dedicado e template aprovado para mensagens iniciadas pela empresa —
  inviável para um aviso simples. O WhatsApp segue como **caminho de contato do
  cliente**, não de notificação.
