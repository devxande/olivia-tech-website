# Avaliação visual, conversão e ideias — Olivia Tech

> Relatório de consultoria de produto/design sobre o site em produção
> (https://oliviatech.com.br). **Somente análise e recomendações** — nada aqui
> foi implementado. Cada item aprovado vira uma tarefa separada.
>
> - **Data:** 27/07/2026
> - **Base:** site ao vivo (desktop 1280×720 e mobile 375×812, medições reais no
>   navegador), código-fonte (`index.html`, `css/tokens.css`, `css/styles.css`,
>   `js/main.js`), spec (`docs/mini-prd-home-olivia-tech.md`) e demais docs.
> - **Restrições respeitadas:** site estático + CSP estrita, sem prova social
>   inventada, tom plural institucional, posicionamento fixo.

Legenda de cada recomendação: **O quê / Por quê / Esforço (B·M·A) / Prioridade (P1·P2·P3)**.

---

## Resumo do estado atual

O site está num nível raro para um projeto novo: identidade coesa (Aurora
Técnica), tokens bem organizados, acessibilidade levada a sério
(reduced-motion em toda animação, skip-link, ARIA no menu e no formulário,
fontes locais, A11y 100 no Lighthouse), backend de leads funcionando e medição
de conversão por CTA já no ar. Sem erros de console em produção. As
recomendações abaixo são de **lapidação e conversão**, não de conserto — o
maior ganho disponível hoje está na *mensagem* (a ambiguidade do termo
"diagnóstico") e em captação fora do site, não em estética.

Números medidos ao vivo que embasam vários itens:

| Medição | Desktop 1280×720 | Mobile 375×812 |
|---|---|---|
| Altura total da página | 8.656 px | 12.666 px |
| Posição da seção Contato | 7.421 px (~86%) | 10.364 px (~82%) |
| Altura da seção Serviços | 2.661 px | — |
| Altura do hero | 860 px (> dobra de 720) | 787 px |
| H1 | 82 px | 34 px |
| CTA primário do hero (topo) | ~707 px (na borda da dobra) | 554 px (visível) |
| Botão CTA da navbar (altura) | 39 px | 35 px (alvo de toque < 44 px) |
| Campos do formulário | 48 px de altura, fonte 16 px (sem zoom no iOS) ✅ | idem ✅ |
| Overflow horizontal indevido | nenhum | nenhum (só decorativos) ✅ |

---

## 1. Avaliação visual e de UX

### O que já está forte (manter)

- **Consistência de tokens:** praticamente tudo usa `tokens.css`; os poucos
  `rgba(79, 216, 224, …)` hard-coded são variações de alfa do ciano, aceitável.
- **Microinterações com bom gosto e responsabilidade:** reveal on-scroll que
  degrada para "sempre visível" sem JS, malha do hero só em desktop e pausada
  fora da viewport, spotlight só com ponteiro fino, tudo atrás de
  `prefers-reduced-motion`. É um padrão acima da média.
- **Mobile:** carrossel da vitrine com scroll-snap funciona (medido: 1.160 px de
  conteúdo em 327 px de janela), diagrama largo rola horizontalmente sem quebrar
  a página, inputs com 16 px (evita zoom forçado no iOS), FAQ com alvo de toque
  de 92 px.
- **Contraste:** já auditado (A11y 96→100 na iteração anterior); links sobre
  fundo escuro usam ciano/inverso corretos, `--color-link-on-light` resolve o
  teal sobre claro.

### 1.1 Foco de teclado invisível nos botões e na navegação — **P1 · Esforço B**

- **O quê:** criar um estilo global `:focus-visible` (ex.: `outline: 2px solid
  var(--color-accent); outline-offset: 2px;` ou `box-shadow: var(--ring-accent)`)
  para `.btn`, links da navbar, links do rodapé e o botão hambúrguer.
- **Por quê:** hoje só skip-link, FAQ, campos do formulário e links do bloco de
  contato têm foco customizado (`styles.css:141`, `908`, `1007`, `1044`). Os
  CTAs — justamente os elementos de conversão — dependem do outline padrão do
  navegador, que em Chrome sobre o fundo roxo escuro fica quase imperceptível.
  Quem navega por teclado literalmente perde o botão principal.

### 1.2 Hero estoura a primeira dobra em laptops comuns — **P2 · Esforço B**

- **O quê:** em viewports baixos (ex.: `@media (max-height: 760px)` em
  desktop), reduzir o padding vertical do hero e/ou o H1 de `--text-7xl` (82 px)
  para `--text-6xl`.
- **Por quê:** medido em 1280×720 (resolução típica de notebook corporativo): o
  hero tem 860 px e o CTA primário começa em ~707 px — na borda exata da dobra.
  Uma fração dos visitantes vê o título mas não os botões sem rolar. É ajuste
  de duas linhas de CSS com impacto direto no elemento mais importante da página.

### 1.3 Seção Serviços longa demais (2.661 px) — **P2 · Esforço M**

- **O quê:** enxugar a sequência *grid de 6 cards → vitrine de 4 media-cards →
  diagrama*. Opções, da mais leve à mais estrutural: (a) mover o diagrama "Como
  as peças se conectam" para a seção Sobre (onde já existe o diagrama de
  failover — os dois se complementam); (b) reduzir a vitrine para 2 cards em
  desktop; (c) transformar a vitrine em carrossel também no desktop.
- **Por quê:** são três blocos visuais consecutivos contando histórias parecidas.
  Um terço da página inteira é uma única seção; o ritmo trava antes de "Sobre" e
  "Como funciona" — que são as seções que constroem confiança. Trade-off honesto:
  a vitrine é bonita e diferencia o site; a recomendação é redistribuir, não
  cortar.

### 1.4 Rolagem total no mobile (12,7 mil px) até o contato — **P1 · Esforço M**

- **O quê:** CTA persistente no mobile. A forma mais limpa dentro da identidade:
  uma barra fina fixa no rodapé da tela (aparece após rolar ~1 dobra, some na
  seção de contato) com "Solicitar diagnóstico" + ícone do WhatsApp. Marcar com
  `data-cta-local="sticky-mobile"` para medir no `/event` (lembrar de incluir na
  allowlist de `functions/event.js`).
- **Por quê:** no mobile o contato está a ~10.400 px do topo. A navbar tem o CTA,
  mas com 35 px de altura e competindo com hambúrguer + marca. Sticky CTA em
  landing B2B mobile é padrão consolidado e o rastreio existente permite provar
  o efeito em vez de supor. Risco: poluição visual — mitigado por aparecer só
  após a primeira dobra.

### 1.5 Alvo de toque do CTA da navbar mobile — **P3 · Esforço B**

- **O quê:** subir o padding vertical do `.navbar__cta` no breakpoint ≤560 px
  para altura ≥44 px (hoje 35 px, `styles.css:1900`).
- **Por quê:** diretriz de alvo de toque (WCAG 2.5.8 / HIG). Item pequeno, mas é
  o botão de conversão mais presente na tela.

### 1.6 Menu mobile sem CTA — **P3 · Esforço B**

- **O quê:** incluir "Solicitar diagnóstico" como último item (destacado) do
  painel do menu mobile.
- **Por quê:** quem abre o hambúrguer demonstrou intenção de navegar; hoje o
  painel lista 4 âncoras e nenhuma ação. Custo quase zero, e o clique é medível.

---

## 2. Conversão — o caminho até "solicitar diagnóstico"

### O que já ajuda (manter)

- Dois caminhos claros (formulário → WhatsApp, e WhatsApp direto), com lead
  gravado no D1 **antes** de depender do WhatsApp — o backend não bloqueia a
  conversão.
- Formulário com fricção baixa: só 3 campos obrigatórios, validação inline com
  mensagens claras, honeypot invisível, nota de privacidade em linguagem humana.
- Rastreio por CTA e posição já implantado — dá para tomar as decisões abaixo
  com dado, não com opinião.

### 2.1 A ambiguidade do "diagnóstico" é a maior fuga de conversão — **P1 · Esforço B**

- **O quê:** padronizar a nomenclatura em toda a página:
  - **"Diagnóstico"** = o serviço técnico pago (como a FAQ já define).
  - **"Conversa inicial"** (ou "primeira conversa") = o passo sem compromisso.
  - Perto dos CTAs principais (hero e navbar), acrescentar a microcopy que a
    seção "Como funciona" já usa: *"A primeira conversa é sem compromisso."*
- **Por quê:** hoje o visitante clica em "Solicitar diagnóstico" no hero e só
  descobre na 2ª pergunta da FAQ que o diagnóstico é pago. Quem não lê a FAQ
  pode se sentir surpreendido no WhatsApp (atrito e desconfiança — o oposto do
  posicionamento "sem surpresas"); quem lê pode desistir de clicar por achar que
  já está contratando. A solução não é esconder o preço — é antecipar a promessa
  correta: *o clique compra uma conversa, não um contrato*. Isso é coerente com
  a diretriz de honestidade e provavelmente **aumenta** o clique.

### 2.2 Tornar o diagnóstico um produto concreto — **P1 · Esforço M**

- **O quê:** um bloco (na seção "Como funciona" ou logo após) chamado, por
  exemplo, **"O que você recebe no diagnóstico"**, listando o entregável real:
  levantamento do que existe (rede, servidores, backup, riscos), retrato
  escrito da infraestrutura, prioridades recomendadas — apenas o que o dono
  realmente entrega. Se houver formato definido (nº de páginas, prazo em dias,
  reunião de apresentação), incluir.
- **Por quê:** sem prova social (corretamente vetada até haver casos reais), a
  credibilidade precisa vir da **concretude do método**. "Você recebe um
  documento com X, Y, Z em N dias" é verificável e vendável sem inventar nada.
  É o substituto honesto do depoimento. ⚠️ *Depende de o dono confirmar o
  formato real do entregável — perguntar antes de escrever.*

### 2.3 Responder as objeções que faltam na FAQ — **P2 · Esforço B**

- **O quê:** adicionar 2–3 perguntas com respostas reais (a coletar com o dono):
  1. *"Quanto custa?"* — mesmo sem tabela, uma ordem de grandeza ou "como o
     preço é formado" (por porte/escopo) reduz o medo de perguntar.
  2. *"Quanto tempo leva um diagnóstico?"*
  3. *"Minha empresa é pequena — vale a pena?"* (define o cliente mínimo).
- **Por quê:** preço e prazo são as duas objeções nº 1 de serviço B2B; hoje
  nenhuma é tocada. Responder com franqueza filtra curiosos e qualifica o lead
  que chega no WhatsApp. ⚠️ *Não publicar valores sem o dono definir.*

### 2.4 Copy do estado de sucesso do formulário — **P2 · Esforço B**

- **O quê:** ajustar o texto de sucesso ("Quase lá — conclua no WhatsApp") para
  também dizer que **o contato já foi registrado** e que, se a pessoa não usar
  WhatsApp, receberá retorno pelo e-mail informado.
- **Por quê:** o lead já está salvo no D1 nesse momento, mas o texto atual
  transmite que sem o passo do WhatsApp nada aconteceu. Quem fecha a aba ali sai
  achando que falhou — e o dono, que recebe o e-mail de aviso, pode responder
  normalmente. É alinhar a mensagem com o que o sistema já faz.

### 2.5 Usar os dados de `/event` para decidir — **P2 · Esforço B (recorrente)**

- **O quê:** rotina mensal: `npm run events` + Web Analytics → comparar cliques
  por CTA/posição com leads gravados; decidir a próxima mudança de conversão
  com base nisso (ex.: se o CTA da seção Serviços nunca é clicado, o problema é
  outro).
- **Por quê:** a instrumentação já existe e está paga (custo zero); o que falta
  é o hábito de ler. Evita otimizar no escuro.

---

## 3. Copy e mensagem

O tom geral está excelente — honesto, direto, sem jargão, e a FAQ do horário
das 19h ("é uma escolha, não uma limitação") é um case de como transformar
restrição em posicionamento. Ajustes pontuais:

### 3.1 Segunda frase do lead do hero — **P1 · Esforço B** (junto com 2.1)

- **O quê:** hoje: *"Antes de qualquer proposta, nos envie o seu problema para
  analisarmos e realizarmos um diagnóstico inicial."* Sugestão de direção:
  *"Conte o que está incomodando na sua operação — a primeira conversa é sem
  compromisso."*
- **Por quê:** a frase atual é sintaticamente pesada ("para analisarmos e
  realizarmos") e usa "diagnóstico inicial", que colide com o diagnóstico pago
  (ver 2.1). A primeira frase do lead (a lista de serviços) está ótima e fica.

### 3.2 Título "Frentes de atuação" — **P3 · Esforço B**

- **O quê:** considerar algo mais orientado ao leitor, ex.: *"O que cuidamos na
  sua operação"*. Manter se o dono preferir o atual.
- **Por quê:** "frentes de atuação" é linguagem institucional de quem fala de
  si; o resto da página fala com o leitor ("sua operação", "você recebe").
  Inconsistência pequena de perspectiva.

### 3.3 Placeholder da mensagem do formulário — **P3 · Esforço B**

- **O quê:** trocar *"Descreva sua necessidade de infraestrutura"* por exemplos
  concretos: *"Ex.: Wi-Fi caindo, backup que nunca foi testado, mudança de
  escritório…"*.
- **Por quê:** exemplos destravam quem não sabe nomear o problema tecnicamente —
  exatamente o público-alvo declarado (decisor sem jargão).

### 3.4 Varredura de consistência do termo "diagnóstico" — **P1 · Esforço B**

- **O quê:** após decidir a nomenclatura (2.1), revisar todas as ocorrências:
  hero, CTAs, seção Como funciona, FAQ, mensagem pré-preenchida do WhatsApp
  (`js/main.js:643`) e JSON-LD.
- **Por quê:** a mensagem do WhatsApp diz "solicitar um diagnóstico de
  infraestrutura" — se o primeiro passo é conversa, ela deveria dizer isso
  ("Gostaria de uma conversa inicial sobre a infraestrutura da minha empresa").

---

## 4. Captação de clientes além do site

Priorizado por **retorno ÷ esforço** para uma consultoria local, nova, sem
carteira, atendendo à noite/fins de semana. Nada abaixo envolve spam ou tática
duvidosa.

| # | Canal / ação | Esforço | Retorno esperado | Prioridade |
|---|---|---|---|---|
| 4.1 | **Google Business Profile completo + primeiras avaliações reais** | B | Alto (busca local é o canal nº 1 de "TI empresa Brasília") | P1 |
| 4.2 | **Rede pessoal e indicação direta** | B | Alto e imediato | P1 |
| 4.3 | **Parcerias com quem já atende PMEs** | M | Alto, composto | P1 |
| 4.4 | **LinkedIn pessoal do dono (conteúdo)** | M (recorrente) | Médio→alto no tempo | P2 |
| 4.5 | **Páginas de conteúdo SEO local no site** | M | Médio (3–6 meses) | P2 |
| 4.6 | **Comunidade empresarial local (Sebrae/DF, eventos, coworkings)** | M | Médio | P3 |
| 4.7 | **WhatsApp Business configurado** | B | Baixo, mas gratuito | P2 |

- **4.1 Google:** o SEO técnico do repo já está pronto (JSON-LD, sitemap); o que
  move o ponteiro agora é a parte nas contas Google (perfil verificado, fotos
  reais, categoria correta, descrição) e — assim que houver o primeiro cliente —
  pedir avaliação real. Uma consultoria local com 3 avaliações genuínas vence
  concorrente sem nenhuma. *(Já em andamento segundo o docs/seo-google.md.)*
- **4.2 Indicação:** para os 3–5 primeiros clientes, o caminho realista não é o
  site — é mapear contatos (ex-colegas, fornecedores, amigos empresários) e
  fazer uma oferta de entrada clara (diagnóstico com escopo e preço fechados).
  O site vira a credencial que sustenta a indicação, papel que já cumpre bem.
- **4.3 Parcerias:** contadores e escritórios de contabilidade (atendem dezenas
  de PMEs e ouvem as dores primeiro), desenvolvedores/agências que fazem
  software mas não tocam infraestrutura, e provedores de internet locais.
  Modelo: indicação recíproca transparente. Uma parceria boa vale meses de
  anúncio.
- **4.4 LinkedIn:** 1–2 posts/semana documentando problemas reais e anônimos
  ("o que encontrei num rack esta semana", "por que backup sem teste de
  restauração não é backup" — este bordão já existe no site e é forte). Sem
  inventar cliente: falar do problema técnico, não de quem o tinha. O horário
  noturno de atendimento é compatível com produzir isso de dia.
- **4.5 SEO de conteúdo:** ver item 5.2 abaixo (viável no site estático).
- **4.7 WhatsApp Business:** perfil comercial com nome, logo, horário e
  descrição — profissionaliza o destino de todos os CTAs do site por ~1h de
  esforço.

---

## 5. Novas ideias de site e funcionalidades

Todas avaliadas contra a stack real: estático + Cloudflare Pages + Functions +
D1 + CSP estrita (sem script externo).

### 5.1 Checklist de autoavaliação de infraestrutura — **P2 · Esforço M · Viável ✅**

- **O quê:** página `/checklist` (ou seção): 8–12 perguntas sim/não ("Seu backup
  já foi testado com uma restauração real?", "Se a internet cair agora, existe
  um segundo link?"), pontuação calculada em JS puro, resultado em faixas
  honestas ("3 pontos de atenção") e CTA para a conversa inicial. Opcional:
  gravar o resultado agregado no D1 via `/event`.
- **Por quê:** é o lead magnet perfeito para este posicionamento — faz o
  visitante *sentir* o risco na própria operação sem prometer nada, gera
  conversa qualificada ("marquei 'não' em backup") e é 100% viável com JS puro
  dentro da CSP. Diferencial real frente a concorrentes locais. É a melhor
  ideia "nova" deste relatório na relação custo×impacto.

### 5.2 Páginas de conteúdo por dor (SEO local) — **P2 · Esforço M · Viável ✅**

- **O quê:** 2–4 páginas estáticas respondendo buscas reais: "Wi-Fi corporativo
  em Brasília", "backup para pequenas empresas", "internet caindo na empresa —
  link redundante". Estrutura: a dor, como diagnosticar, o que a Olivia Tech
  faz, CTA. HTML manual (o repo já tem o padrão da `privacidade.html`).
- **Por quê:** o mini-PRD já listava como próximo passo; é o único canal do
  site que cresce sozinho. Custo real é a escrita, não a técnica. Começar com
  1 página e medir no Search Console antes de escalar.

### 5.3 Página/bloco "O que você recebe no diagnóstico" — ver **2.2** (P1)

### 5.4 Blog técnico completo — **P3 · Esforço A · Viável com ressalva ⚠️**

- **O quê:** seção de artigos com listagem, feed etc.
- **Por quê adiar:** sem gerador estático, cada post é HTML manual (ok até ~5
  páginas; doloroso depois). Se 5.2 funcionar e houver apetite de escrita
  contínua, aí sim vale introduzir um build de markdown→HTML no `build.mjs`.
  Antes disso é infraestrutura sem conteúdo — exatamente o que o site prega
  contra.

### 5.5 Agendamento online (Calendly/Cal.com) — **P3 · Esforço B · Viável com ressalva ⚠️**

- **O quê:** se o dono quiser agenda self-service, usar **link externo** para a
  página do Cal.com (não embed).
- **Por quê:** o embed exige script de terceiros — quebraria a CSP estrita, que
  é um ativo do projeto. O link simples não custa nada de arquitetura. Só faz
  sentido se o volume de conversas justificar; com agenda noturna enxuta, o
  WhatsApp provavelmente basta por ora.

### 5.6 Prova social real (futuro, gatilhado) — **P2 quando existir · Esforço B**

- **O quê:** deixar planejado (não construído) o slot: 1–2 mini-casos reais
  ("empresa de N pessoas, problema X, resultado Y") + avaliações do Google.
  Gatilho: primeiro cliente entregue + autorização por escrito.
- **Por quê:** é a peça que mais falta na página, e a diretriz de não inventar
  está certíssima — mas ter o plano pronto evita esperar mais um ciclo de
  design quando o caso real existir.

### 5.7 `sameAs` no JSON-LD — **P3 · Esforço B · Viável ✅**

- **O quê:** quando os perfis existirem (LinkedIn, Instagram, Google Business),
  adicionar `sameAs` ao JSON-LD (pendência já anotada em docs/seo-google.md).

---

## 6. Novo Design System (Claude Design) — análise comparativa

Analisado via MCP o projeto **"Olivia Tech Design System"** (tokens, readme,
componentes e o UI kit da homepage). Resumo do que ele é: uma releitura da
Aurora Técnica **100% dark-mode e neon** — base roxo-quase-preto `#0A0710`,
ciano saturado `#00F0FF`, roxo vibrante `#7B2CBF`, display em **Space
Grotesk**, profundidade por *glow* em vez de sombra, aurora com `blur(120px)`
por seção. Componentes em React/JSX + tokens CSS.

### 6.1 Comparação token a token com a Aurora Técnica atual

| Dimensão | Site atual (`tokens.css`) | Novo DS | Compatibilidade |
|---|---|---|---|
| Fundo da página | Claro (branco/`#F6F3FA`), com hero e contato escuros (`#1E1230`) | Escuro total (`#0A0710`/`#130F1F`) | ⚠️ **É a divergência central** — muda a identidade da página |
| Ciano | `#4FD8E0` (e `#17696F` p/ texto em claro) | `#00F0FF` (neon) | Parcial: ótimo sobre escuro; como texto em fundo claro reprova em contraste |
| Roxo | `#1E1230`–`#6B3FA0` (marca sóbria) | `#7B2CBF`/`#9D4EDD` (vibrante, glow) | Parcial: funciona como acento nos trechos escuros |
| Display | Manrope 700–800, H1 82 px | Space Grotesk 700, H1 48 px | Trocável (fonte é personalidade); escala do DS é mais contida |
| Corpo | Inter (local) | Inter (**via Google Fonts CDN**) | ✅ mesma fonte; ❌ CDN viola a CSP — teria de ser self-host |
| Espaçamento | Escala 4px (4→160) | Grid 8px (8→128) | ✅ subconjunto compatível |
| Radii | 6/10/16/24/pill | 8–12/16/24/pill | ✅ praticamente iguais |
| Elevação | Sombras nos trechos claros + glow nos escuros | Só glow + borda branca translúcida | ✅ nos trechos escuros; ❌ não cobre os claros |
| Semânticas | Só `--color-danger` | success/warning/danger/info | ✅ adoção limpa |
| Motion | Reveal + stagger + lift, reduced-motion | Idêntico em espírito (fade/slide, stagger 100ms, lift −4px) | ✅ já equivalente |

### 6.2 Incompatibilidades duras (não adotar como está)

1. **StatsStrip com métricas "500+, 98%, 12+" e TestimonialsStrip com 4
   depoimentos de clientes** — violam a diretriz inviolável do projeto (nunca
   inventar números/depoimentos). São placeholders do DS; **ficam de fora** até
   haver dados reais. O componente pode ser guardado como *design pronto* para
   quando existirem.
2. **Fontes via Google Fonts CDN** (Space Grotesk, JetBrains Mono) — quebra a
   CSP estrita e a política de fontes locais. Se a tipografia for adotada, é
   por woff2 self-hosted (mesmo padrão do Manrope atual, ~30–70 KB).
3. **Componentes em React/JSX** — o site é HTML/CSS/JS puro; nada é
   aproveitável como código. O valor do DS aqui é **especificação visual**
   (tokens + screenshots dos cards), não implementação.
4. **Logo tipográfico do DS** — o DS não recebeu o logo real e inventou um
   wordmark; o site já tem a marca do arco duplo. Manter a atual.

### 6.3 O que pode ser inserido no site atual

**(a) Adoções seguras, baixo esforço — evolução da Aurora Técnica, sem trocar identidade**

| Item | Viabilidade | Impacto | Risco |
|---|---|---|---|
| Tokens semânticos success/warning/info (além do danger atual) | ✅ trivial | Baixo agora, útil p/ checklist (5.1) e estados de form | Nenhum |
| Anel de foco 2px ciano do DS como padrão global de `:focus-visible` | ✅ trivial | Resolve o item 1.1 com a linguagem do DS | Nenhum |
| Borda branca translúcida (8–14%) + glow no hover dos cards **das seções escuras** (hero, contato) | ✅ CSS puro | Médio — aproxima o "depth by light" do DS | Baixo |
| `#9D4EDD` (roxo claro) como acento intermediário em fundos escuros | ✅ | Baixo | Baixo |
| Regra editorial do DS: 1 trecho acentuado por headline, headlines em duas orações ("Um processo claro. Resultados concretos.") | ✅ copy | Médio | Nenhum |

**(b) Mudanças médias — decisão de gosto, reversíveis**

| Item | Viabilidade | Impacto | Risco |
|---|---|---|---|
| Space Grotesk self-hosted como display (no lugar do Manrope) | ✅ (woff2 local, subset latin) | Alto — muda a "voz tipográfica" para algo mais técnico/geométrico | Médio: re-testar quebras de linha do H1, LCP e preload |
| Ciano `#00F0FF` **apenas nas superfícies escuras** (botão primário do hero, pulses, glows), mantendo `#17696F` p/ links em claro | ✅ | Médio-alto — o neon é o traço mais reconhecível do DS | Médio: saturação pode "gritar"; validar contraste do texto sobre o botão (`#0A0710` sobre `#00F0FF` passa AA) |
| ProcessBand (faixa roxa com passos numerados + conector pontilhado) como redesenho do "Como funciona" | ✅ HTML/CSS | Médio | Médio: reescrever uma seção inteira |

**(c) Redesenho maior — só com decisão explícita**

| Item | Viabilidade | Impacto | Risco |
|---|---|---|---|
| **Dark-mode total** (`#0A0710` como base da página inteira, como no UI kit do DS) | ✅ tecnicamente (tokens semânticos já isolam as cores) | Alto — o site passa a ser "o DS" | **Alto**: todas as seções claras, as 9+ ilustrações SVG desenhadas para fundo claro, o contraste já auditado (A11y 100), a página de privacidade e o 404 precisariam ser refeitos/re-auditados |

### 6.4 Veredito: evolução ou troca de identidade?

O novo DS **não é um sistema paralelo — é a Aurora Técnica levada ao extremo
dark/neon**. A diferença de identidade real está em duas decisões:

1. **Página clara com momentos escuros (hoje) vs. página inteiramente escura
   (DS).** Isso é troca de identidade. O site atual usa o claro para
   legibilidade das seções de conteúdo (serviços, como funciona, FAQ) e o
   escuro para impacto (hero, contato) — um padrão que favorece leitura B2B.
   O DS aposta tudo no impacto.
2. **Manrope vs. Space Grotesk** — troca de voz tipográfica, menor, mas
   perceptível.

**Recomendação:** adotar já o bloco (a) — é ganho sem risco e aproxima o site
do DS. Tratar (b) como experimentos individuais (um por vez, medindo). **Não
iniciar (c) sem decisão explícita do dono**, porque o custo real não é o CSS —
é refazer ilustrações e re-auditar acessibilidade. Pergunta objetiva ao dono:
*"você quer que o site inteiro fique escuro como no Design System, ou que o
site atual absorva o acabamento do DS (neon, glow, foco, tipografia) mantendo
a alternância claro/escuro?"* — o relatório recomenda a segunda opção.

---

## Roteiro priorizado (maior retorno primeiro)

| # | Item | Eixo | Esforço | Impacto |
|---|---|---|---|---|
| 1 | Alinhar a mensagem do "diagnóstico": nomenclatura + microcopy "primeira conversa sem compromisso" nos CTAs + lead do hero + mensagem do WhatsApp (2.1, 3.1, 3.4) | Conversão/Copy | B | Alto |
| 2 | Google Business Profile completo + primeira avaliação real assim que houver cliente (4.1) | Captação | B | Alto |
| 3 | Bloco "O que você recebe no diagnóstico" — depende de o dono confirmar o entregável real (2.2) | Conversão | M | Alto |
| 4 | Foco de teclado visível nos CTAs e navegação (1.1) + copy do estado de sucesso do formulário (2.4) | UX/A11y | B | Médio |
| 5 | CTA persistente no mobile, medido via `/event` (1.4) | Conversão | M | Alto (hipótese mensurável) |
| 6 | FAQ de preço/prazo/porte — respostas a coletar com o dono (2.3) | Conversão | B | Médio-alto |
| 7 | Checklist de autoavaliação de infraestrutura (5.1) | Site novo | M | Alto (diferencial) |
| 8 | 1ª página de conteúdo SEO local + hero acima da dobra em laptops baixos (5.2, 1.2) | Captação/UX | M | Médio (composto no tempo) |

**Perguntas abertas para o dono** (necessárias antes de executar os itens que
dependem de dado real):

1. Qual é o formato real do entregável do diagnóstico (documento? prazo?
   reunião de apresentação?) — para o item 3.
2. Existe definição de preço (valor, faixa ou critério) e prazo do diagnóstico
   que possa ser publicada? — para o item 6.
3. Existem credenciais reais publicáveis (anos de experiência, formação,
   certificações)? — para uma futura nota "quem atende você" na seção Sobre.
4. Material do novo Design System (seção 6).
