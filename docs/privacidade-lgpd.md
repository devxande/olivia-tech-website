# Aviso de Privacidade (LGPD)

Página pública em [`/privacidade.html`](../privacidade.html), linkada no rodapé da
home e do 404 e na nota do formulário de contato. Existe porque o site passou a
**coletar dados pessoais** (formulário → banco D1) e a **enviá-los por e-mail**
via Resend (processador transacional, servidores nos EUA) — obrigação real, não
só menção nos docs.

> **Não é parecer jurídico.** O texto é um aviso informativo, em linguagem
> simples. Se um dia precisar de validação jurídica formal, isso é com um
> advogado — este arquivo e a página só descrevem, com honestidade, o que o site
> de fato faz com os dados.

## O que a página cobre

- **Dados coletados** (só via formulário, envio voluntário): nome, empresa,
  e-mail, telefone (opcional), mensagem (opcional).
- **Finalidade:** responder ao contato/diagnóstico. **Base legal LGPD:**
  consentimento + procedimentos preliminares de contrato, a pedido do titular.
- **Compartilhamento (operadores):** Cloudflare (hospedagem + banco D1) e Resend
  (aviso de lead por e-mail, pode trafegar nos EUA). Sem venda nem uso para
  marketing.
- **Medição do site:** cliques em CTAs (`/event`) e Cloudflare Web Analytics são
  **agregados e anônimos, sem cookies, sem identificar o visitante** — separados
  do formulário, que é o único ponto com dado pessoal.
- **Retenção:** descrita de forma qualitativa ("enquanto necessário / houver
  relação"), sem prazo numérico — ver pendências abaixo.
- **Direitos do titular** (acesso, correção, exclusão etc.) e **como exercer:**
  `contato@oliviatech.com.br`.
- **Data de última atualização** (hoje: 26/07/2026).

## Depende de dados que só o titular tem — NÃO inventar

Estes pontos foram deixados de fora de propósito, para não colocar informação
inventada no site. Quando o usuário definir, atualizar a página **e** a data de
"Última atualização":

- **Prazo de retenção específico** (ex.: "excluímos após 24 meses sem contato").
  Hoje o texto é qualitativo.
- **Razão social / CNPJ e endereço** do controlador — se quiser identificar
  formalmente a empresa como controladora.
- **Encarregado (DPO) / canal dedicado**, caso opte por um diferente do
  `contato@oliviatech.com.br`.
- **`sameAs` / redes sociais** — não é de privacidade, mas fica pendente junto
  (ver `seo-google.md`).

## Onde mexer

- Conteúdo: [`privacidade.html`](../privacidade.html) (usa as classes
  `.legal-hero` / `.legal` em `css/styles.css`).
- Estilos: bloco "Página legal (Privacidade)" em `css/styles.css`.
- **Build:** `privacidade.html` está no loop de injeção de `?v=` do
  [`build.mjs`](../build.mjs) — rode `npm run build` após editar CSS/JS.
- Também referenciada no [`sitemap.xml`](../sitemap.xml).
- CSP: a página não usa nada externo além do que a home já usa (fontes locais,
  `app.min.css`, `main.min.js`) — não precisou de ajuste no `_headers`.
