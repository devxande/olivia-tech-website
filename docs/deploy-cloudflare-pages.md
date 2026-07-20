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

O projeto não usa Node, React, bundler ou pré-processador. Os arquivos já estão prontos para o navegador. Adicionar um build só traria complexidade sem benefício. Ícones (Lucide) e fontes (Google Fonts) são carregados via CDN em tempo de execução, no próprio navegador.

## Passo a passo — GitHub

1. Crie um repositório novo no GitHub (ex.: `olivia-tech-site`), pode ser **privado**.
2. Na pasta do projeto (`E:\Olivia Tech`), inicialize o Git e envie os arquivos:

   ```bash
   git init
   git add .
   git commit -m "Primeira versão da home page da Olivia Tech"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/olivia-tech-site.git
   git push -u origin main
   ```

3. Confirme no GitHub que o `index.html` aparece na **raiz** do repositório.

## Passo a passo — Cloudflare Pages

1. Acesse o painel da Cloudflare → **Workers & Pages** → **Create** → aba **Pages** → **Connect to Git**.
2. Autorize o GitHub e selecione o repositório do site.
3. Na tela de configuração de build, use:
   - **Framework preset:** `None`
   - **Production branch:** `main`
   - **Build command:** *(vazio)*
   - **Build output directory:** `/`
4. Clique em **Save and Deploy**.
5. Ao terminar, o site fica disponível em uma URL temporária `*.pages.dev`. Teste por ela antes de conectar o domínio.

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

### 3. Vincular o domínio ao projeto Pages
1. No projeto no Cloudflare Pages → aba **Custom domains** → **Set up a custom domain**.
2. Adicione `oliviatech.com.br` e também `www.oliviatech.com.br`.
3. A Cloudflare cria os registros DNS e o certificado HTTPS automaticamente.

> HTTPS é provisionado pela Cloudflare sem custo. Não é necessário configurar certificado manualmente.

## Reutilizando este fluxo em outros sites

Para qualquer site estático futuro, repita o mesmo padrão:
- Repositório no GitHub com `index.html` na raiz.
- Cloudflare Pages: preset `None`, branch `main`, sem build command, output `/`.
- Domínio via nameservers da Cloudflare.
