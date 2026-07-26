# Presença no Google — SEO local e busca

Guia prático para a **Olivia Tech** ser encontrada em buscas locais (ex.: "consultoria
TI Brasília", "infraestrutura de rede Brasília") e para acompanhar o desempenho de busca.

O trabalho se divide em duas partes:

- **No repositório** — já feito e versionado (checklist abaixo). É o que o Google lê do site.
- **Nas suas contas Google** — só você pode fazer (login). Passo a passo exato mais abaixo.

> **Diretriz de conteúdo:** nada de dado inventado (endereço de rua, avaliações, números,
> parceiros). O perfil e o schema refletem só o que é real e confirmado.

---

## 1. O que já foi feito no repositório (checklist)

Tudo isto já está no site em produção e ajuda a indexação/SEO local:

- [x] **`<title>` e `meta description`** claros, com "Brasília" e "infraestrutura de TI".
- [x] **`canonical`** apontando para `https://oliviatech.com.br/` (evita conteúdo duplicado).
- [x] **`lang="pt-BR"`** no `<html>`.
- [x] **Open Graph + Twitter Card** completos, com `og:image` real (1200×630).
- [x] **JSON-LD `ProfessionalService`** — nome, descrição, `url`, `image`, e-mail, telefone,
      `areaServed` (Brasília + DF + Entorno), `address` (cidade/DF, **sem rua** — coerente com
      negócio de área de atendimento), horário (Seg–Sex a partir das 19h) e `knowsAbout`
      (as frentes de atuação). Tem `@id` estável (`#business`) para consolidar a entidade.
- [x] **JSON-LD `FAQPage`** — as 6 perguntas frequentes (elegível a rich result de FAQ).
- [x] **`robots.txt`** libera todo o site (`Allow: /`) e aponta o `sitemap.xml`.
- [x] **`sitemap.xml`** com a home e `lastmod` atualizado.
- [x] **Sem `noindex` acidental** — a home é indexável; só a `404.html` tem `noindex` (correto).
- [x] **`_headers` sem `X-Robots-Tag`** de bloqueio; a CSP não atrapalha a indexação.
- [x] **Responsivo e rápido** (fontes locais, CSS/JS minificado com cache) — sinais de UX que
      contam para o ranqueamento mobile.

**O que NÃO está no schema (de propósito, por falta de dado real):**

- `sameAs` (perfis sociais) — ainda não há Instagram/LinkedIn públicos. Adicionar quando existirem.
- Endereço de rua e `geo` (coordenadas) — negócio de área de atendimento, sem endereço público.
- `aggregateRating` / avaliações — só quando houver avaliações reais (não inventar).
- Horário fixo de fim de semana — é "sob consulta", então não se declara um horário fixo.

---

## 2. Google Search Console (medir o desempenho de busca)

O Search Console mostra por quais termos o site aparece, quantos cliques recebe e avisa de
problemas de indexação. **Recomendado fazer primeiro.**

### 2.1 Adicionar a propriedade (tipo Domínio)

1. Acesse **https://search.google.com/search-console** e faça login com sua conta Google.
2. Em **Adicionar propriedade**, escolha a coluna da **esquerda: "Domínio"** (não "Prefixo do URL").
3. Digite: `oliviatech.com.br` (sem `https://`, sem barra).
4. Clique **Continuar**. O Google vai mostrar um **registro TXT** para verificação via DNS —
   algo como:

   ```
   google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

   **Copie esse valor inteiro** (ele é único da sua conta — por isso não fica no repositório).

### 2.2 Verificar via DNS na Cloudflare

Como o DNS de `oliviatech.com.br` já está na Cloudflare, a verificação é por registro TXT:

1. Em outra aba, acesse **https://dash.cloudflare.com** → selecione o domínio **oliviatech.com.br**.
2. Menu lateral **DNS** → **Records** → botão **Add record**.
3. Preencha exatamente:
   - **Type:** `TXT`
   - **Name:** `@`  (representa o domínio raiz `oliviatech.com.br`)
   - **Content:** cole o valor copiado, **incluindo** `google-site-verification=...`
   - **TTL:** `Auto`
   - **Proxy status:** não se aplica a TXT (fica cinza/DNS only) — ok.
4. **Save**.
5. Volte à aba do Search Console e clique **Verificar**. A propagação costuma ser rápida (a
   Cloudflare é quase instantânea); se der "não verificado", espere alguns minutos e tente de novo.

> Deixe o registro TXT **permanente** — se removê-lo depois, o Google pode "desverificar" a propriedade.

### 2.3 Enviar o sitemap

1. No Search Console, com a propriedade verificada, abra **Sitemaps** (menu lateral).
2. Em "Adicionar um novo sitemap", digite: `sitemap.xml`
   (o campo já vem com `https://oliviatech.com.br/` na frente — o resultado deve ser
   `https://oliviatech.com.br/sitemap.xml`).
3. **Enviar**. Em alguns minutos/horas o status vira "Sucesso".

### 2.4 Depois (opcional, mesma tela)

- Use **Inspeção de URL** → cole `https://oliviatech.com.br/` → **Solicitar indexação** para
  acelerar a primeira visita do Google.
- Volte em ~1–2 semanas para ver, em **Desempenho**, por quais termos o site aparece.

---

## 3. Google Business Profile (aparecer no Maps e na busca local)

O perfil de empresa é o que faz a Olivia Tech aparecer no **mapa** e no bloco local quando alguém
busca "consultoria de TI em Brasília". Como **não há endereço público**, o perfil é do tipo
**negócio de área de atendimento** (o endereço fica oculto; aparece a região atendida).

### 3.1 Criar o perfil

1. Acesse **https://www.google.com/business** (ou **https://business.google.com**) e faça login.
2. **Adicionar empresa** → digite **Olivia Tech**. Se não aparecer na lista, escolha
   **"Adicionar sua empresa ao Google"**.
3. **Categoria da empresa** — comece com algo como **"Serviço de TI"** ou **"Consultor de TI"**.
   Você pode adicionar categorias secundárias depois (ex.: "Serviço de rede de computadores",
   "Serviço de segurança de computadores").
4. **"Você quer adicionar um local que os clientes possam visitar?"** → responda **Não**
   (é negócio de área de atendimento, sem loja/escritório para visita).
5. **Área de atendimento** → adicione **Brasília, DF** e as cidades do **entorno** que você
   atende (ex.: Águas Claras, Taguatinga, Guará, Gama, e cidades do entorno que fizerem sentido).
6. **Telefone e site:**
   - Telefone: `(61) 98139-9376`
   - Site: `https://oliviatech.com.br`
7. **Concluir** para chegar à etapa de verificação.

### 3.2 Verificação

O Google pede uma forma de provar que a empresa é sua. As opções aparecem conforme o caso —
normalmente **telefone/SMS**, **e-mail**, ou **vídeo** (gravação curta mostrando ferramentas,
equipamentos e a operação). Siga a opção oferecida; a verificação por vídeo é comum para
negócios de área de atendimento sem endereço.

> A verificação pode levar de alguns minutos a alguns dias, dependendo do método.

### 3.3 Preencher o perfil depois de verificado

- **Descrição:** algo fiel ao site, ex.: *"Consultoria de infraestrutura de TI em Brasília e
  entorno: redes, Wi-Fi corporativo, firewall, servidores, backup, VPN, links e failover.
  Atendimento consultivo, com diagnóstico claro antes de qualquer proposta."*
- **Horário de funcionamento:** Seg–Sex **das 19h às 23h59** (o mesmo do site). Para fim de
  semana, deixe **fechado** no horário regular e use **"horário especial"** ou a descrição para
  dizer *"fins de semana sob consulta/agendamento"* — não invente um horário fixo.
- **Serviços:** liste as 6 frentes (Redes e Wi-Fi corporativo, Firewall e segurança de rede,
  Servidores e armazenamento, Backup e continuidade, VPN/links/failover, Suporte e consultoria).
- **Fotos:** use imagens **reais** (equipamentos, atendimento). Evite as ilustrações vetoriais do
  site como se fossem foto de trabalho real — o Google e os clientes esperam foto autêntica.
- **Mensagens/E-mail:** o e-mail de contato é `contato@oliviatech.com.br`.

### 3.4 Fechando o ciclo com o schema

Quando o perfil estiver no ar, ele terá uma URL pública (Google Maps / perfil). Aí sim vale
adicionar essa URL (e Instagram/LinkedIn, se criar) no bloco `sameAs` do JSON-LD em `index.html`,
para o Google ligar o site à ficha do negócio. Peça para incluir quando tiver os links.

---

## 4. Resumo: o que depende de você

| Etapa | Onde | Ação |
|---|---|---|
| Verificar propriedade | Search Console + Cloudflare DNS | Criar propriedade "Domínio", colar o TXT no DNS, verificar |
| Enviar sitemap | Search Console | Adicionar `sitemap.xml` |
| Criar perfil local | Google Business Profile | Negócio de área de atendimento, categoria, região, telefone, site |
| Verificar o perfil | Google Business Profile | Telefone/e-mail/vídeo, conforme o Google pedir |
| Preencher o perfil | Google Business Profile | Descrição, horário (19h; fim de semana sob consulta), serviços, fotos reais |
| Voltar com os links | (me avisar) | Adiciono `sameAs` (perfil Google/Instagram/LinkedIn) no JSON-LD |

Depois de tudo no ar, o normal é o site começar a aparecer em buscas locais em **1–3 semanas**.
Acompanhe pelo **Search Console → Desempenho** e pelo **Business Profile → Insights**.
