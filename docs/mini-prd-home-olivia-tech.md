# Mini PRD — Home Page Olivia Tech

> Especificação funcional enxuta da versão atual aprovada da home page.
> Serve como referência oficial para futuras alterações, documentação e handoff técnico.

- **Produto:** Site institucional Olivia Tech (home page)
- **Direção visual:** 1a — Aurora Técnica
- **Status:** Primeira versão implementada, com melhorias de robustez/segurança aplicadas
- **Última atualização:** 21/07/2026

---

## 1. Visão geral do projeto

A Olivia Tech é uma consultoria de infraestrutura de TI, sediada em Brasília, focada em empresas que dependem de uma operação estável e não podem parar. A home page é o principal ponto de entrada digital da marca e tem como função apresentar os serviços, transmitir confiança técnica e converter visitantes em contatos comerciais reais.

A página foi implementada como site estático (HTML, CSS e JavaScript puro, sem build), reaproveitando os tokens de design (cores, tipografia, espaçamentos e efeitos) da direção visual **Aurora Técnica**.

## 2. Objetivo da home page

Captar clientes reais. A página deve levar o visitante a solicitar um diagnóstico de infraestrutura, seja pelo formulário de contato, seja pelo WhatsApp. Todos os elementos de conteúdo e de navegação convergem para essa conversão.

## 3. Público-alvo

Pequenas e médias empresas que precisam de apoio profissional em infraestrutura de TI, especialmente em:

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
- **Enviar pelo WhatsApp** — botão de submissão do formulário: valida os campos e abre o WhatsApp com a mensagem já preenchida.
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

- Sem depoimentos, cases, números ou métricas fictícias.
- Sem certificações, selos, parceiros ou prêmios não comprovados.
- Sem backend real de formulário nesta versão.
- Sem área logada, blog, e-commerce ou outras páginas além da home.
- Sem integrações de analytics, CRM ou automação nesta versão.

## 10. Requisitos funcionais atuais

- **RF01** — Navbar fixa no topo durante a rolagem.
- **RF02** — CTAs "Solicitar diagnóstico" rolam suavemente até a seção de contato.
- **RF03** — Links de WhatsApp abrem `https://wa.me/5561981399376` em nova aba.
- **RF04** — Formulário de contato: valida os campos obrigatórios (Nome, Empresa, E-mail) e, ao enviar, monta a mensagem e abre o WhatsApp já preenchido (`https://wa.me/5561981399376`); exibe o estado de sucesso "Quase lá — conclua no WhatsApp." com botão de fallback caso o pop-up seja bloqueado. Não há envio/armazenamento de dados no servidor.
- **RF05** — Layout responsivo, com ajustes para telas até 900px e até 560px.
- **RF06** — Ano do rodapé atualizado automaticamente (via `main.js`).
- **RF07** — Ícones em SVG inline (equivalentes Lucide, sem CDN); fontes Manrope e Inter servidas localmente via `@font-face` (subset latin, `font-display: swap`), sem Google Fonts.

## 11. Pendências técnicas atuais

- **Formulário sem backend** — por design nesta versão: não há envio/armazenamento no servidor; a conversão acontece pelo WhatsApp. Definir um destino real (serviço de formulário/e-mail) é um passo futuro opcional.

Resolvidos (antes eram pendências):

- ~~Dependências externas via CDN~~ — ícones agora são SVG inline e as fontes são servidas localmente; o site não depende mais de CDNs externos.
- ~~E-mail de contato a confirmar~~ — `contato@oliviatech.com.br` confirmado e ativo.
- ~~Mensagem do WhatsApp sem texto~~ — o formulário e os CTAs abrem o WhatsApp com a mensagem já preenchida.

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
├── index.html                       # Estrutura e conteúdo da home page
├── _headers                         # Cabeçalhos de segurança para Cloudflare Pages (CSP etc.)
├── robots.txt                       # Diretrizes de rastreamento + link do sitemap
├── sitemap.xml                      # Sitemap (URL única da home)
├── css\
│   ├── tokens.css                   # Tokens de design + @font-face das fontes locais
│   └── styles.css                   # Estilos de componentes, layout, diagramas e responsividade
├── js\
│   └── main.js                      # Rolagem até contato, formulário/WhatsApp, reveal, ano do rodapé
├── assets\
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── og-image.jpg                 # Preview social otimizado (1200×630, ~59 KB)
│   └── fonts\                       # Manrope e Inter (woff2 variável, subset latin; 1 arquivo por família)
└── docs\
    ├── mini-prd-home-olivia-tech.md # Este documento
    └── deploy-cloudflare-pages.md   # Guia de publicação
```

Dependências externas: **nenhuma** em tempo de execução. Ícones (SVG inline) e fontes (`@font-face` local) são servidos pelo próprio domínio.

## 14. Próximos passos recomendados

Concluídos nesta iteração:

- ~~Confirmar o e-mail de contato oficial~~ (confirmado).
- ~~Adicionar mensagem pré-preenchida nos links de WhatsApp~~ (feito).
- ~~Embutir ícones e fontes para remover dependências de CDN~~ (feito).
- ~~Otimizar a og-image~~ (708 KB → ~59 KB).
- ~~Adicionar cabeçalhos de segurança (`_headers`) para Cloudflare Pages~~ (feito).

Próximos (opcionais, fora do escopo desta iteração):

1. Definir o destino do formulário e integrar um backend real (e-mail ou serviço de formulário), se desejado.
2. (Opcional) Adicionar analytics sem cookies (ex.: Cloudflare Web Analytics) para medir conversões, com nota de privacidade no rodapé.
3. (Quando houver clientes) Colher 1–2 depoimentos reais — sem inventar.
4. Publicar/atualizar a versão aprovada em produção.
