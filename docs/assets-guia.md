# Guia dos assets visuais

Todas as ilustrações do site são **SVG autorais**, servidos do próprio domínio.
Não há fotografia de banco de imagens, CDN nem vídeo — o que mantém a CSP
estrita do `_headers` intacta (`default-src 'self'`) e o peso total baixo:
os onze SVGs somam ~59 KB sem compressão (~14 KB servidos com Brotli).

## Onde cada arte é usada

| Arquivo | Seção | Proporção | Papel |
|---|---|---|---|
| `rack-servidores.svg` | Serviços · vitrine | 4:3 (crop 16:10) | Rack, patch panel e cabeamento |
| `wifi-corporativo.svg` | Serviços · vitrine | 4:3 (crop 16:10) | Planta com APs e cobertura |
| `firewall-perimetro.svg` | Serviços · vitrine | 4:3 (crop 16:10) | Filtragem de entrada e saída |
| `monitoramento.svg` | Serviços · vitrine | 4:3 (crop 16:10) | Painel de tráfego e status |
| `sala-tecnica.svg` | Sobre | 4:3 (crop 16:10) | Corredor de racks em perspectiva |
| `banda-operacao.svg` | Faixa "Operação" | 10:3 | Textura panorâmica de fundo |
| `etapa-diagnostico.svg` | Como funciona · passo 01 | 16:9 | Levantamento da rede |
| `etapa-plano.svg` | Como funciona · passo 02 | 16:9 | Plano e prioridades |
| `etapa-execucao.svg` | Como funciona · passo 03 | 16:9 | Execução e verificação |
| `suporte-bancada.svg` | Disponibilidade | 4:3 | Bancada técnica vista de cima |
| `cabeamento-patch.svg` | Contato | 16:9 | Patch panel como textura de fundo |

## Convenções seguidas pelas artes

- **Paleta fixa**, espelhando `css/tokens.css`: fundos `#0c0614`–`#2d1d45`,
  acento `#4FD8E0`, neutro claro `#F6F3FA`. Nenhuma cor fora desse conjunto.
- **Sem texto.** Nenhum `<text>` nas ilustrações: fontes não carregam em SVG
  usado via `<img>`, e legendas em imagem não são traduzíveis nem acessíveis.
  Toda palavra fica no HTML, na legenda ao lado da arte.
- **Animação interna em CSS**, dentro de `<style>` no próprio arquivo, sempre
  envolvida por `@media (prefers-reduced-motion: no-preference)`. Só
  `opacity`, `transform` e `stroke-dashoffset` — nada que force layout.
- **Sem script.** SVG carregado como `<img>` não executa JS, por definição.

## Ao editar ou acrescentar uma arte

1. Mantenha o `viewBox` e a proporção da tabela — o CSS recorta com
   `object-fit: cover`, e mudar a proporção desloca o enquadramento.
2. Deixe as bordas com folga: as molduras recortam ~8% no topo e na base.
3. Repita o bloco `@media (prefers-reduced-motion: no-preference)`.
4. No HTML, mantenha `width`, `height`, `loading="lazy"` e `decoding="async"`
   — os dois primeiros reservam o espaço e evitam deslocamento de layout.
5. `alt` descritivo quando a arte informa; `alt=""` quando ela é só textura
   (é o caso de `banda-operacao.svg` e das miniaturas de etapa, já descritas
   pelo texto do card ao lado).

## Vídeo de fundo do hero (opcional, desligado)

O hero funciona sem vídeo: a aurora animada, a varredura de luz e a malha de
rede em canvas já dão o movimento. A camada de vídeo existe pronta e só liga
quando você quiser.

**Para ativar**, coloque em `assets/video/` os três arquivos e acrescente o
atributo ao `.hero__bg` em `index.html`:

```html
<div class="hero__bg" aria-hidden="true" data-hero-video="assets/video/hero">
```

| Arquivo | Formato | Teto sugerido |
|---|---|---|
| `hero.webm` | VP9 ou AV1, sem áudio | 1,5 MB |
| `hero.mp4` | H.264 (compatibilidade), sem áudio | 2,5 MB |
| `hero-poster.jpg` | 1920×1080, o primeiro quadro | 180 KB |

Conteúdo recomendado: 8 a 12 segundos em loop, movimento lento e sem cortes
(uma panorâmica curta de corredor de rack, por exemplo). Corte com movimento
rápido chama atenção para o fundo e atrapalha a leitura do título.

O `js/main.js` cuida do resto e **não baixa nada** quando:

- a tela tem menos de 900px de largura (fica o fundo estático);
- o sistema pede `prefers-reduced-motion: reduce`;
- o navegador informa `saveData` ou conexão 2g/3g.

Além disso, o vídeo é mudo e `playsinline` (sem autoplay bloqueado nem áudio),
pausa quando o hero sai da viewport, e se os arquivos não existirem o elemento
é removido sozinho, sem deixar rastro na página.

Também acrescente `media-src 'self'` à CSP em `_headers` ao ativar — hoje o
vídeo herdaria `default-src`, o que já funciona, mas o explícito documenta a
intenção.

## Cache

`_headers` serve `/assets/img/*` com `max-age=86400` e
`stale-while-revalidate=604800`: como os nomes não têm hash, o cache curto
permite reeditar uma arte sem que o navegador segure a versão antiga por dias.
