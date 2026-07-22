# Deploy — Cloudflare Pages + GitHub

> Guia de publicação da home page da Olivia Tech.
> Fluxo reutilizável para futuros sites estáticos.

## Resumo da configuração

| Item | Valor |
|---|---|
| **Tipo do projeto** | Site estático puro (HTML, CSS, JavaScript) |
| **Necessita build?** | **Não** — servir os arquivos diretamente |
| **Framework preset** | `None` |
| **Production branch** | `main` |
| **Build command** | *(deixar em branco)* |
| **Build output directory** | `/` (raiz do repositório) |
| **Variáveis de ambiente** | Nenhuma |
| **Arquivo de config no repo** | Não é necessário |

> Este é um site estático sem etapa de build. **Não** use build command nem output directory customizado.
> O `index.html` está na raiz, então o Cloudflare Pages serve tudo direto, sem processamento.

## Por que sem build?

O projeto não usa Node, React, bundler ou pré-processador. Os arquivos já estão prontos para o navegador. Adicionar um build só traria complexidade sem benefício. Ícones são SVG inline e as fontes (Manrope/Inter) são servidas localmente via `@font-face` — **não há dependências de CDN externo** em tempo de execução.

## Cabeçalhos de segurança (`_headers`)

O repositório inclui um arquivo `_headers` na raiz. O Cloudflare Pages o aplica automaticamente no deploy (sem configuração no painel). Ele define uma Content-Security-Policy estrita (`default-src 'self'`, sem CDNs), além de `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY` e `Strict-Transport-Security`. Como todo recurso é servido do próprio domínio, a CSP não precisa de exceções.

> Se no futuro for adicionado algum recurso externo (script, fonte, imagem de outro domínio), a CSP precisará ser ajustada no `_headers`, senão o recurso será bloqueado pelo navegador.

## Passo a passo — GitHub

> **Status atual:** o repositório já existe em
> `https://github.com/devxande/olivia-tech-website` com a branch `main`
> e o `index.html` na raiz. Os passos abaixo ficam como referência para
> reproduzir o fluxo do zero em outro site.

1. Crie um repositório novo no GitHub, pode ser **privado**.
2. Na pasta do projeto, inicialize o Git e envie os arquivos:

   ```bash
   git init
   git add .
   git commit -m "Primeira versão do site"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```

3. Confirme no GitHub que o `index.html` aparece na **raiz** do repositório.

> **Produção sai da `main`.** Trabalhe features em branches separados e faça
> merge na `main` (via PR) quando prontos — só então o deploy de produção é
> atualizado. Outros branches geram apenas *preview deployments*.

## Passo a passo — Cloudflare Pages

### Valores exatos para colar (tela de build)

| Campo | Valor |
|---|---|
| **Project name** | `olivia-tech-website` |
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | *(vazio)* |
| **Build output directory** | `/` |
| **Root directory** | *(vazio / raiz)* |
| **Environment variables** | *(nenhuma)* |

### Passos

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → aba **Pages** → **Connect to Git**.
2. Clique em **Connect GitHub** e autorize a Cloudflare. Em *Repository access*, libere o `olivia-tech-website` (ou "All repositories").
3. Selecione **`devxande/olivia-tech-website`** → **Begin setup**.
4. Na tela de configuração de build, preencha os valores da tabela acima. O ponto principal: preset `None`, **sem** build command, output `/`.
5. Clique em **Save and Deploy** (o primeiro build leva ~1 min).
6. Ao terminar, o site fica em uma URL `https://olivia-tech-website.pages.dev`. **Teste por ela primeiro** (home, CTAs, formulário abrindo o WhatsApp) antes de conectar o domínio.

> A cada `git push` na branch `main`, o Cloudflare Pages republica o site automaticamente.

## Domínio customizado — Cloudflare + Registro.br

O domínio `oliviatech.com.br` está no Registro.br. Para apontá-lo ao Cloudflare Pages, o caminho recomendado é **usar a Cloudflare como DNS do domínio** (troca de nameservers no Registro.br).

### 1. Adicionar o domínio à Cloudflare
1. No painel da Cloudflare → **Add a site** → digite `oliviatech.com.br`.
2. Escolha o plano **Free**.
3. A Cloudflare mostrará **2 nameservers** (ex.: `xxx.ns.cloudflare.com` e `yyy.ns.cloudflare.com`). Anote-os.

### 2. Trocar os nameservers no Registro.br
1. Acesse [registro.br](https://registro.br) → faça login → selecione `oliviatech.com.br`.
2. Vá em **DNS** / **Alterar servidores DNS** (opção "usar outro provedor de DNS").
3. Substitua os nameservers atuais pelos **dois da Cloudflare**.
4. Salve. A propagação pode levar de alguns minutos a algumas horas.

> **Atenção:** trocar os nameservers move **todo o DNS** do domínio para a
> Cloudflare. Se houver e-mail nesse domínio (registros MX) ou outros
> registros ativos, anote-os antes e recrie-os na Cloudflare para não
> derrubar esses serviços.

### 3. Vincular o domínio ao projeto Pages
1. No projeto no Cloudflare Pages → aba **Custom domains** → **Set up a custom domain**.
2. Adicione `oliviatech.com.br` e também `www.oliviatech.com.br`.
3. A Cloudflare cria os registros DNS e o certificado HTTPS automaticamente.

> HTTPS é provisionado pela Cloudflare sem custo. Não é necessário configurar certificado manualmente.

### 4. Definir o domínio canônico (evitar conteúdo duplicado)
1. Escolha uma versão principal — recomendado o apex `oliviatech.com.br`.
2. No domínio → **Rules → Redirect Rules → Create rule**:
   - **If:** *Hostname* `equals` `www.oliviatech.com.br`
   - **Then:** *Static redirect* → `https://oliviatech.com.br` → tipo **301**
3. (Ou o inverso, se preferir o `www` como principal.)
4. Assim o site responde por um único endereço canônico, sem duplicar conteúdo.

## Verificação pós-deploy

Depois do primeiro deploy (na URL `*.pages.dev` e, em seguida, no domínio próprio):

- [ ] Home carrega com CSS, JS, ícones (SVG inline) e fontes locais renderizados.
- [ ] Nenhuma requisição a domínios externos (verificar aba Network: sem `unpkg`, `googleapis`, `gstatic`).
- [ ] CTAs "Solicitar diagnóstico" rolam até a seção de contato.
- [ ] Formulário: submit vazio bloqueia; envio válido abre o WhatsApp preenchido.
- [ ] Console do navegador sem erros (inclusive sem violações de CSP).
- [ ] Cabeçalhos presentes: conferir em [securityheaders.com](https://securityheaders.com) ou pela aba Network (resposta do documento deve trazer `content-security-policy`, `x-frame-options`, etc.).
- [ ] Preview social: colar a URL no WhatsApp/redes e confirmar que o card com a `og-image.jpg` aparece.
- [ ] Acesso via HTTPS com o redirect canônico funcionando (`www` ↔ apex).

## Reutilizando este fluxo em outros sites

Para qualquer site estático futuro, repita o mesmo padrão:
- Repositório no GitHub com `index.html` na raiz.
- Cloudflare Pages: preset `None`, branch `main`, sem build command, output `/`.
- Domínio via nameservers da Cloudflare.
