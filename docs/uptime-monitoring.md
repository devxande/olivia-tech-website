# Monitoramento de uptime

Um site que vende "infraestrutura que não para" não pode ficar fora do ar sem o
dono saber. Este doc cobre: (1) o endpoint próprio de health-check e (2) o passo
a passo de um monitor externo **gratuito** que avisa por e-mail se o site cair.

## Endpoint de health-check (no repo)

| Rota | Método | Faz | Toca no D1? | Cache |
|---|---|---|---|---|
| `/health` | GET | Responde `200 {"ok":true}` — só confirma que o Pages está servindo Functions | **Não** | `no-store` |
| `/health/db` | GET | Responde `200 {"ok":true,"db":true}` após um `SELECT 1` no D1 | **Sim** (1 leitura por chamada) | `no-store` |

Arquivos: `functions/health.js` (`/health`) e `functions/health/db.js` (`/health/db`).

- **`/health` é a rota do monitor.** É barata de propósito: não abre o banco nem
  chama serviço externo, então pode ser batida a cada poucos minutos sem custo.
  Métodos diferentes de GET respondem `405`.
- **`/health/db` é para checagem manual** (ou um monitor de intervalo longo).
  Cada chamada é **uma leitura no D1** — não aponte um monitor de intervalo curto
  aqui, senão você paga uma leitura no banco a cada check sem necessidade. Serve
  para confirmar, quando quiser, que o caminho completo Pages → D1 está de pé.
  Se o binding `DB` faltar, responde `503`; se o `SELECT 1` falhar, `500`.

### CSP e cache

- **CSP:** a política estrita do `_headers` (bloco `/*`) não afeta estas rotas.
  A CSP governa como um **documento HTML** carrega recursos no navegador; a
  resposta de `/health` é JSON, então o monitor (e o navegador) ignoram a CSP.
  Nada a liberar.
- **Cache:** a Function já devolve `Cache-Control: no-store`, e o `_headers`
  reforça (`/health` e `/health/*`). Sem isso, uma camada de cache poderia servir
  um `200` velho enquanto o site estivesse fora — o monitor veria "no ar" durante
  uma queda.

### Testar

Local (`npm run dev` sobe o `wrangler pages dev` com as Functions e o D1):

```bash
curl -i http://127.0.0.1:8788/health        # 200 {"ok":true}
curl -i http://127.0.0.1:8788/health/db     # 200 {"ok":true,"db":true}
curl -i -X POST http://127.0.0.1:8788/health # 405
```

Produção:

```bash
curl -i https://oliviatech.com.br/health     # 200 {"ok":true}
```

A lógica do handler tem teste no runner nativo do Node (`functions/health.test.js`),
rodado por `npm test`.

## Monitor externo gratuito — UptimeRobot (passo a passo)

**Recomendado: [UptimeRobot](https://uptimerobot.com).** Plano gratuito com 50
monitores, checagem a cada 5 min e alerta por e-mail — suficiente e sem cartão.
A criação da conta e a configuração são **suas** (não automatizo login em serviço
externo). O que preencher, exatamente:

1. **Criar conta:** acesse https://uptimerobot.com → *Register* / *Sign Up*.
   Confirme o e-mail (o endereço que você confirmar já vira o destino do alerta).
2. **Novo monitor:** no painel, *+ New monitor* (ou *Add New Monitor*).
   - **Monitor Type:** `HTTP(s)`
   - **Friendly Name:** `Olivia Tech — health`
   - **URL (or IP):** `https://oliviatech.com.br/health`
   - **Monitoring interval:** `5 minutes` (o mínimo do plano gratuito)
   - Se aparecer *Monitor Timeout* / *HTTP Method*, deixe **GET** e o timeout
     padrão.
   - (Opcional) Em *Advanced* → *Response / keyword*: para não confiar só no
     código de status, marque para exigir a palavra-chave `ok` no corpo — assim
     um `200` com corpo errado também dispara alerta.
3. **Alerta por e-mail:** em *Alert Contacts* (ou *Notifications*), confirme que
   o seu e-mail está como contato **ativo** e associado a este monitor. É o
   padrão, mas confira. Você pode adicionar mais contatos (e-mail extra) aqui.
4. **Salvar:** *Create Monitor*. Em ~1 min o status fica *Up* (verde).
5. **Testar o alerta (opcional):** pause o monitor e retome, ou aguarde uma queda
   real. Para um teste controlado sem derrubar o site, crie um monitor temporário
   apontando para uma URL inexistente (ex.: `https://oliviatech.com.br/naoexiste`)
   — ela responde `404`, o monitor cai e você recebe o e-mail. Apague depois.

> **Por que apontar em `/health` e não na home:** a home é uma página cheia
> (HTML + CSS + JS) e cacheada na borda; um `200` dela pode vir do cache mesmo
> com a Function fora. O `/health` é `no-store` e exercita o runtime de Functions
> — é o sinal mais honesto de "o Pages está mesmo servindo". Se preferir o mais
> simples possível, apontar na home (`https://oliviatech.com.br/`) também
> funciona como teste de "o site abre".

### Alternativa

- **[Better Stack (Uptime)](https://betterstack.com/uptime)** — plano gratuito com
  checagem a cada 3 min, alerta por e-mail e página de status pública. Vale se
  você quiser uma *status page* hospedada junto. Setup análogo: monitor HTTP(s)
  para `https://oliviatech.com.br/health`, intervalo, e-mail.

## Cloudflare Health Checks (nativo) — quando usar

O Cloudflare tem **Health Checks** nativos no painel (*Traffic* → *Health Checks*,
em contas com o recurso disponível) — não implementei nada disso aqui, é config
no painel. Diferença de propósito:

- **Monitor externo (UptimeRobot):** checa de **fora** da rede Cloudflare. Se o
  Cloudflare ou o Pages caírem inteiros, ele percebe e te avisa. É o que você
  quer para "o dono fica sabendo se o site sai do ar". **Use este por padrão.**
- **Cloudflare Health Checks:** roda **dentro** do Cloudflare, voltado a origens
  em setups com balanceamento/failover (Load Balancing). Para um site estático no
  Pages, sem múltiplas origens, agrega pouco sobre o monitor externo — e um
  problema do próprio Cloudflare não seria reportado por uma ferramenta que roda
  nele. Considere só se um dia houver origem própria e failover.
