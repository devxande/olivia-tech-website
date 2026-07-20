# Mini PRD — Home Page Olivia Tech

> Especificação funcional enxuta da versão atual aprovada da home page.
> Serve como referência oficial para futuras alterações, documentação e handoff técnico.

- **Produto:** Site institucional Olivia Tech (home page)
- **Direção visual:** 1a — Aurora Técnica
- **Status:** Primeira versão implementada, em revisão
- **Última atualização:** 19/07/2026

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
4. **Suporte contínuo** — acompanhamento após a implementação, não apenas na entrega.

## 5. Estrutura da página

Ordem das seções, de cima para baixo:

1. **Navbar** (fixa no topo)
2. **Hero** — apresentação e chamada principal
3. **Serviços** — grade de 6 cards
4. **Sobre** — texto institucional + princípios de trabalho
5. **Disponibilidade** — horários de atendimento
6. **Contato** — dados de contato + formulário
7. **Rodapé** — logo, contato e direitos autorais

## 6. Conteúdo esperado por seção

| Seção | Conteúdo |
|---|---|
| **Navbar** | Logo Olivia Tech, links (Serviços, Sobre, Contato) e botão "Solicitar diagnóstico". |
| **Hero** | Selo "Consultoria de Infraestrutura de TI · Brasília", título de posicionamento, parágrafo de apoio, botões "Solicitar diagnóstico" e "Falar no WhatsApp", e dois selos de disponibilidade. |
| **Serviços** | Título de seção + 6 cards: Redes e Wi-Fi corporativo, Firewall e segurança de rede, Servidores e armazenamento, Backup e continuidade, VPN/links/failover, Suporte e consultoria especializada. Cada card tem ícone, título e descrição curta. |
| **Sobre** | Texto institucional sobre a atuação da Olivia Tech + os 4 princípios numerados (01 a 04). |
| **Disponibilidade** | Explicação do modelo de atendimento consultivo + dois cards: "Seg–Sex: Após às 19h" e "Fins de semana: Sob consulta". |
| **Contato** | Título, texto de apoio, canais de contato (e-mail, WhatsApp, horário) e formulário (Nome, Empresa, E-mail, Telefone/WhatsApp, Mensagem). |
| **Rodapé** | Logo, tagline, bloco de contato e aviso de direitos autorais com ano automático. |

## 7. CTAs principais

- **Solicitar diagnóstico** — botão principal (navbar e hero). Rola suavemente até a seção de contato.
- **Falar no WhatsApp** — abre `https://wa.me/5561981399376` em nova aba. Presente no hero e na seção de contato.
- **Enviar solicitação** — botão de submissão do formulário de contato.
- **E-mail** — `contato@oliviatech.com.br` (a confirmar) como canal alternativo.

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
- **RF04** — Formulário de contato exibe estado de sucesso ("Solicitação recebida") ao ser enviado, sem envio real de dados.
- **RF05** — Layout responsivo, com ajustes para telas até 900px e até 560px.
- **RF06** — Ano do rodapé atualizado automaticamente.
- **RF07** — Ícones renderizados via biblioteca Lucide; fontes Manrope e Inter via Google Fonts.

## 11. Pendências técnicas atuais

- **Formulário sem backend** — hoje apenas simula o envio no navegador; falta definir destino (e-mail, serviço de formulário, etc.).
- **Dependências externas via CDN** — ícones (Lucide) e fontes (Google Fonts) exigem internet; avaliar embutir para uso offline.
- **E-mail de contato** — `contato@oliviatech.com.br` precisa ser confirmado como endereço real.
- **Mensagem do WhatsApp** — links ainda não possuem texto pré-preenchido (opcional).

## 12. Critérios de aprovação da primeira versão

- [ ] Todas as seções renderizam corretamente em desktop e mobile.
- [ ] Conteúdo e copy revisados e aprovados, sem informações inventadas.
- [ ] CTAs funcionam (rolagem até contato e abertura do WhatsApp correto).
- [ ] Formulário exibe corretamente o estado de sucesso.
- [ ] Identidade visual fiel à direção Aurora Técnica.
- [ ] E-mail de contato confirmado.

## 13. Estrutura de arquivos implementada

```
E:\Olivia Tech\
├── index.html                       # Estrutura e conteúdo da home page
├── css\
│   ├── tokens.css                   # Tokens de design (cores, tipografia, espaçamento, efeitos)
│   └── styles.css                   # Estilos de componentes, layout e responsividade
├── js\
│   └── main.js                      # Rolagem até contato e estado de sucesso do formulário
└── docs\
    └── mini-prd-home-olivia-tech.md # Este documento
```

Dependências externas: **Lucide** (ícones, via CDN) e **Google Fonts** (Manrope e Inter).

## 14. Próximos passos recomendados

1. Revisar e aprovar o conteúdo e a copy desta versão.
2. Confirmar o e-mail de contato oficial.
3. Definir o destino do formulário e integrar um backend real (e-mail ou serviço de formulário).
4. (Opcional) Adicionar mensagem pré-preenchida nos links de WhatsApp.
5. (Opcional) Embutir ícones e fontes para funcionamento offline.
6. (Opcional) Adicionar analytics para medir conversões.
7. Publicar a versão aprovada em ambiente de produção.
