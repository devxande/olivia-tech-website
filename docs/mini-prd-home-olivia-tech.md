# Mini PRD — Home Page Olivia Tech

> Especificação funcional enxuta da versão atual aprovada da home page.
> Serve como referência oficial para futuras alterações, documentação e handoff técnico.

- **Produto:** Site institucional Olivia Tech (home page)
- **Direção visual:** 1a — Aurora Técnica
- **Status:** Em produção (`oliviatech.com.br`), com captação de leads, rastreio de conversão e analytics implementados
- **Última atualização:** 26/07/2026

---

## 1. Visão geral do projeto

A Olivia Tech é uma consultoria de infraestrutura de TI, sediada em Brasília, focada em empresas que dependem de uma operação estável e não podem parar. A home page é o principal ponto de entrada digital da marca e tem como função apresentar os serviços, transmitir confiança técnica e converter visitantes em contatos comerciais reais.

A página foi implementada em HTML, CSS e JavaScript puro (sem framework), reaproveitando os tokens de design (cores, tipografia, espaçamentos e efeitos) da direção visual **Aurora Técnica**. Há uma etapa de build leve (minificação de CSS/JS com cache-busting) e um backend serverless mínimo em Cloudflare Pages Functions para captação de leads e rastreio de conversão — ver `README.md` na raiz e os docs específicos.

## 2. Objetivo da home page

Captar clientes reais. A página deve levar o visitante a solicitar um diagnóstico de infraestrutura, seja pelo formulário de contato, seja pelo WhatsApp. Todos os elementos de conteúdo e de navegação convergem para essa conversão.

## 3. Público-alvo

Empresas que precisam de apoio profissional em infraestrutura de TI, especialmente em:

- Redes e Wi-Fi corporativo
- Firewall e segurança de rede
- Servidores e armazenamento
- Backup e continuidade
- VPN, links e failover
- Suporte e consultoria especializada

Perfil de decisor: gestor ou responsável técnico que valoriza clareza, previsibilidade e atendimento próximo, sem jargão desnecessário.

## 4. Proposta de valor

**"Infraestrutura de TI para empresas que não podem parar."**

A Olivia Tech organiza e protege a infraestrutura de TI com responsabilidade técnica em cada decisão e atendimento consultivo. Diferenciais comunicados na página:

1. **Diagnóstico claro** — levantamento técnico antes de qualquer decisão ou proposta.
2. **Planejamento antes da execução** — mudanças estruturadas, documentadas e com risco reduzido.
3. **Comunicação direta** — clareza sobre o que está sendo feito e por quê.
4. **Acompanhamento após a entrega** — seguimos disponíveis para ajustes e dúvidas, dentro do horário de atendimento (não é suporte 24/7 nem plantão contínuo).

## 5. Estrutura da página

Ordem das seções, de cima para baixo:

1. **Navbar** (fixa no topo)
2. **Hero** — apresentação e chamada principal
3. **Serviços** — grade de 6 cards + diagrama editorial "Como as peças se conectam"
4. **Sobre** — texto institucional + princípios de trabalho + ilustração de failover/continuidade
5. **Como funciona** — três passos do processo (Diagnóstico → Plano → Execução e acompanhamento)
6. **Disponibilidade** — horários de atendimento
7. **Contato** — dados de contato + formulário
8. **Rodapé** — logo, contato e direitos autorais

## 6. Conteúdo esperado por seção

| Seção | Conteúdo |
|---|---|
| **Navbar** | Logo Olivia Tech, links (Serviços, Sobre, Como funciona, Contato) e botão "Solicitar diagnóstico". |
| **Hero** | Selo "Consultoria de Infraestrutura de TI · Brasília", título de posicionamento, parágrafo de apoio, botões "Solicitar diagnóstico" e "Falar no WhatsApp", e dois selos de disponibilidade. Fundo com topologia de rede decorativa (SVG). |
| **Serviços** | Título de seção + 6 cards: Redes e Wi-Fi corporativo, Firewall e segurança de rede, Servidores e armazenamento, Backup e continuidade, VPN/links/failover, Suporte e consultoria. Cada card tem ícone, título e descrição curta. Ao final, diagrama editorial "Como as peças se conectam" (SVG inline) ligando internet → firewall → núcleo → servidores/backup/Wi-Fi + VPN. |
| **Sobre** | Texto institucional sobre a atuação da Olivia Tech + os 4 princípios numerados (01 a 04) + ilustração de failover/continuidade (dois links redundantes, SVG inline). |
| **Como funciona** | Três passos do processo: 01 Diagnóstico, 02 Plano, 03 Execução e acompanhamento, com CTA "Solicitar diagnóstico". |
| **Disponibilidade** | Explicação do modelo de atendimento consultivo + dois cards: "Seg–Sex: A partir das 19h" e "Fins de semana: Sob consulta". |
| **Contato** | Título, texto de apoio, canais de contato (e-mail, WhatsApp, horário) e formulário (Nome, Empresa, E-mail, Telefone/WhatsApp, Mensagem). |
| **Rodapé** | Logo, tagline, bloco de contato e aviso de direitos autorais com ano automático. |

## 7. CTAs principais

- **Solicitar diagnóstico** — botão principal (navbar e hero). Rola suavemente até a seção de contato.
- **Falar no WhatsApp** — abre `https://wa.me/5561981399376` em nova aba. Presente no hero e na seção de contato.
- **Enviar pelo WhatsApp** — botão de submissão do formulário: valida os campos, **registra o lead no banco** (`POST /contact` → D1) e abre o WhatsApp com a mensagem já preenchida.
- **E-mail** — `contato@oliviatech.com.br` (confirmado e ativo) como canal alternativo.

## 8. Regras de copy e tom de voz

- **Tom:** profissional, claro, confiável e acessível.
- **Idioma:** português do Brasil.
- Explicar sem jargão desnecessário; priorizar clareza e objetividade.
- Reforçar estabilidade, segurança e organização da operação do cliente.
- Frases curtas e diretas; evitar promessas exageradas.
- **Não inventar** depoimentos, números, estatísticas, certificações, parceiros ou prêmios.
- Manter a consistência do posicionamento: "empresas que não podem parar".

## 9. Restrições e itens fora de escopo

- Sem depoimentos, cases, números ou métricas fictícias (bloco de prova social **adiado** até haver casos reais).
- Sem certificações, selos, parceiros ou prêmios não comprovados.
- Sem área logada, blog, e-commerce ou outras páginas além da home.
- Sem CRM ou automação de marketing.

> Itens que **deixaram** de estar fora de escopo (implementados): backend de captação de leads (D1), rastreio de cliques nos CTAs e analytics sem cookies (Cloudflare Web Analytics).

## 10. Requisitos funcionais atuais

- **RF01** — Navbar fixa no topo durante a rolagem.
- **RF02** — CTAs "Solicitar diagnóstico" rolam suavemente até a seção de contato.
- **RF03** — Links de WhatsApp abrem `https://wa.me/5561981399376` em nova aba.
- **RF04** — Formulário de contato: valida os campos obrigatórios (Nome, Empresa, E-mail), **registra o lead no D1** (`POST /contact`, best-effort) e abre o WhatsApp já preenchido (`https://wa.me/5561981399376`); exibe o estado de sucesso com botão de fallback caso o pop-up seja bloqueado. Se o backend falhar, o WhatsApp continua funcionando (a captação não bloqueia a conversão). Ao gravar um lead, dispara um **e-mail de aviso** (best-effort, via `waitUntil`) para atendimento rápido. Ver `docs/captacao-leads-d1.md` e `docs/notificacao-leads.md`.
- **RF05** — Layout responsivo, com ajustes para telas até 900px e até 560px.
- **RF06** — Ano do rodapé atualizado automaticamente (via `main.js`).
- **RF07** — Ícones em SVG inline (equivalentes Lucide, sem CDN); fontes Manrope e Inter servidas localmente via `@font-face` (subset latin, `font-display: swap`), sem Google Fonts.
- **RF08** — Rastreio de cliques nos CTAs: cada botão marcado (`data-cta`/`data-cta-local`) envia um evento (`POST /event` via `sendBeacon`) gravado no D1, para medir qual CTA e posição convertem. Ver `docs/rastreio-ctas.md`.
- **RF09** — Analytics de páginas sem cookies (Cloudflare Web Analytics, beacon injetado pelo Pages). Ver `docs/web-analytics.md`.
- **RF10** — Clicar na logo da navbar volta ao topo da página.
- **RF11** — Build de produção (`npm run build`): combina e minifica CSS/JS e injeta hash de versão (`?v=…`) nas referências do HTML para cache-busting confiável. Roda no deploy do Cloudflare.

## 11. Pendências técnicas atuais

- **Notificação de lead novo** — hoje o lead cai no D1 mas só é visto rodando `npm run leads`. Um aviso imediato (e-mail via Cloudflare Email Routing ou mensagem no WhatsApp) é o próximo passo recomendado.
- **Presença no Google** (Google Business Profile + Search Console) — SEO local no repo já preparado (JSON-LD, sitemap, canonical, robots); falta a parte em contas Google (verificar propriedade, enviar sitemap, criar/verificar o perfil). Passo a passo em [seo-google.md](seo-google.md).

Resolvidos (antes eram pendências):

- ~~Dependências externas via CDN~~ — ícones são SVG inline e fontes locais (única exceção externa: o beacon do Cloudflare Web Analytics).
- ~~E-mail de contato a confirmar~~ — `contato@oliviatech.com.br` confirmado e ativo.
- ~~Mensagem do WhatsApp sem texto~~ — formulário e CTAs abrem o WhatsApp com a mensagem preenchida.
- ~~Formulário sem backend~~ — leads agora gravam no D1 (`/contact`); WhatsApp mantido como caminho garantido.
- ~~Sem analytics / medição de conversão~~ — Web Analytics (páginas) + rastreio de cliques nos CTAs (`/event`).
- ~~JS/CSS antigo servido a visitantes após deploy~~ — resolvido com cache-busting por hash de versão no build.

## 12. Critérios de aprovação da primeira versão

- [x] Todas as seções renderizam corretamente em desktop e mobile.
- [x] Conteúdo e copy revisados e aprovados, sem informações inventadas.
- [x] CTAs funcionam (rolagem até contato e abertura do WhatsApp correto).
- [x] Formulário exibe corretamente o estado de sucesso.
- [x] Identidade visual fiel à direção Aurora Técnica.
- [x] E-mail de contato confirmado (`contato@oliviatech.com.br`).

## 13. Estrutura de arquivos implementada

```
E:\Olivia Tech\
├── index.html                       # Estrutura e conteúdo da home (refs de css/js com ?v=hash)
├── 404.html                         # Página de erro
├── _headers                         # Cabeçalhos de segurança (CSP) + Cache-Control por rota
├── robots.txt / sitemap.xml         # SEO
├── package.json / build.mjs         # Build de produção (csso + terser + cache-busting)
├── .nvmrc                           # Versão do Node (20) usada no build do Cloudflare
├── css\
│   ├── tokens.css                   # Tokens de design + @font-face (FONTE — versionada)
│   ├── styles.css                   # Estilos de componentes/layout/responsividade (FONTE)
│   └── app.min.css                  # GERADO no build (não versionado)
├── js\
│   ├── main.js                      # FONTE: scroll, formulário, rastreio de CTAs, reveal, etc.
│   └── main.min.js                  # GERADO no build (não versionado)
├── functions\                       # Cloudflare Pages Functions (backend serverless)
│   ├── contact.js                   # POST /contact — grava lead no D1
│   └── event.js                     # POST /event  — grava clique de CTA no D1
├── db\
│   └── schema.sql                   # Tabelas do D1: leads e events
├── assets\                          # favicon, apple-touch-icon, og-image, fonts\ (Manrope/Inter)
└── docs\
    ├── mini-prd-home-olivia-tech.md # Este documento (spec funcional)
    ├── deploy-cloudflare-pages.md   # Guia de publicação + build
    ├── captacao-leads-d1.md         # Backend de leads (/contact + D1)
    ├── notificacao-leads.md         # Aviso de lead novo por e-mail (Email Routing)
    ├── rastreio-ctas.md             # Rastreio de conversão (/event + D1)
    ├── web-analytics.md             # Cloudflare Web Analytics
    └── assets-guia.md               # Guia de assets
```

> **Fontes vs. gerados:** os `.min` e o `node_modules/` **não** são versionados no Git — o Cloudflare os regenera a cada deploy via `npm run build`. Edite sempre as fontes (`css/*.css`, `js/main.js`) e rode `npm run build` antes de commitar.

Dependências externas em runtime: apenas o beacon do **Cloudflare Web Analytics**. Todo o resto (ícones SVG inline, fontes locais) é servido pelo próprio domínio.

## 14. Próximos passos recomendados

Concluídos nesta iteração:

- ~~Confirmar o e-mail de contato oficial~~ (confirmado).
- ~~Adicionar mensagem pré-preenchida nos links de WhatsApp~~ (feito).
- ~~Embutir ícones e fontes para remover dependências de CDN~~ (feito).
- ~~Otimizar a og-image~~ (708 KB → ~59 KB).
- ~~Adicionar cabeçalhos de segurança (`_headers`) para Cloudflare Pages~~ (feito).

Concluídos nas iterações seguintes (2026-07-25/26):

- ~~Backend real de captação de leads~~ — Cloudflare Pages Function `/contact` gravando no D1.
- ~~Analytics sem cookies para medir conversões~~ — Cloudflare Web Analytics.
- ~~Medir qual CTA converte~~ — rastreio de cliques `/event` no D1.
- ~~Build com minificação e cache-busting~~ — `npm run build`.
- ~~Publicar em produção~~ — no ar em `oliviatech.com.br` (Cloudflare Pages, deploy a cada push na `main`).

Próximos (opcionais):

1. **Notificação de lead novo** — e-mail (Cloudflare Email Routing) ou WhatsApp quando um lead entra.
2. **Presença no Google** — Google Business Profile (mapa/busca local) e Search Console (enviar o sitemap). Guia: [seo-google.md](seo-google.md).
3. (Quando houver clientes) Colher 1–2 depoimentos/mini-cases reais — sem inventar.
4. Conteúdo para busca orgânica (1–2 páginas respondendo dúvidas reais do cliente).
