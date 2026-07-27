# Auditoria de performance (Lighthouse)

Registro das re-auditorias do site com Lighthouse (emulação **mobile**, todas as
categorias). Serve de baseline para saber o que é ganho real vs. ruído de medição.

## Como rodar

Contra **produção** (reflete o build real, o `_headers` e o beacon injetado pelo
Pages — é o número que vale):

```bash
export CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
npx --yes lighthouse "https://oliviatech.com.br" \
  --preset=perf --form-factor=mobile --screenEmulation.mobile \
  --chrome-flags="--headless=new --no-sandbox" \
  --output=html --output-path=./lh-home.html
```

Para validar mudanças **antes** do deploy, servir a pasta por HTTP local (o
`file://` é um snapshot estático e não executa CSS/JS como o navegador real) e
apontar o Lighthouse para `http://localhost:8777`. O beacon do Web Analytics e o
script de ofuscação de e-mail **não** aparecem no local — eles são injetados pelo
Cloudflare em produção. Rodar local serve para conferir o próprio HTML/CSS/JS.

## Re-auditoria — 2026-07-26

Motivo: confirmar que as notas seguem verdes depois de entrarem no site (a) o
beacon do **Cloudflare Web Analytics**, (b) o **rastreio de cliques nos CTAs**
(`functions/event.js` + `sendEvent` em `js/main.js`) e (c) a nova página
`/privacidade.html`.

### Antes (produção, com o beacon e o rastreio já no ar)

| Página        | Perf | A11y | Best-Pr. | SEO | LCP   | CLS   | TBT    |
|---------------|:----:|:----:|:--------:|:---:|-------|-------|--------|
| Home          |  95  | 100  |   100    | 100 | 2.4 s | 0     | 100 ms |
| Privacidade   |  94  |  96  |   100    | 100 | 2.5 s | 0     | 10 ms  |

Baseline anterior da home: Perf 96 / A11y 100 / BP 100 / SEO 100.

### Diagnóstico

- **Beacon e rastreio não regrediram nada de relevante.** O `beacon.min.js`
  carrega fora do caminho crítico (não é render-blocking) e o RUM só dispara
  depois do load. Somando tudo, **Script Evaluation = 85 ms** (beacon 43 ms,
  `main.min.js` 19 ms) e **TBT = 100 ms**. A queda de Perf 96→95 na home é ruído
  de medição (1 ponto), não efeito do beacon.
- **`Minimize main-thread work` (11,7 s) é artefato do ambiente.** Sob a CPU
  emulada 4× do Lighthouse mobile, esse tempo é quase todo Rendering + Style &
  Layout + "Other"; a parte de script é ~90 ms. Não é JS do site — não há o que
  "corrigir" aqui.
- **Dois problemas reais, ambos na `/privacidade`:**
  1. **A11y 96** — contraste insuficiente nos links da seção legal. Eles usavam
     `--color-accent-strong` (`#2FA9B2`), que sobre branco dá só **2,82:1**
     (AA exige ≥ 4,5:1 para texto normal).
  2. **`main.min.js` render-blocking (~1,08 s)** — o `<script>` sem `defer`
     bloqueava a renderização.
- **Oportunidade só de produção, fora do repo:** o Cloudflare injeta
  `cdn-cgi/scripts/.../email-decode.min.js` (~1 s render-blocking) por causa da
  **Ofuscação de E-mail** (Scrape Shield). É configuração de conta, não do
  código — ver "Recomendação" abaixo.
- **Render-blocking restante = só o `app.min.css`** (~10 KB). É normal para uma
  folha de estilo; eliminar exigiria inline de CSS crítico (mudança de escopo com
  risco de divergência) para ganho pequeno. Deixado como está — o CSS é minúsculo
  e cacheado `immutable`.

### Correções aplicadas (repo)

1. **Contraste dos links legais** — novo token `--cyan-700: #17696F` e semântico
   `--color-link-on-light`, aplicado em `.legal a`. Sobre branco dá **6,39:1**
   (passa AA com folga). Escopo restrito à página legal; nenhuma outra cor mudou.
2. **`defer` no `main.min.js`** em `index.html` e `privacidade.html`. Todo o
   código já roda em `DOMContentLoaded`, então é 100% seguro — deixa de ser
   render-blocking. Rastreio de CTAs, formulário e ano do rodapé conferidos no
   navegador após a mudança.

### Depois (local via HTTP, pós-correção)

| Página        | Perf | A11y | Best-Pr. | SEO | JS render-blocking? |
|---------------|:----:|:----:|:--------:|:---:|:-------------------:|
| Home          |  94  | 100  |   100    | 100 | não (só o CSS)      |
| Privacidade   |  96  | 100  |   100    | 100 | não (só o CSS)      |

- **A11y da `/privacidade`: 96 → 100** (contraste corrigido, `color-contrast`
  passou).
- **`main.min.js` deixou de ser render-blocking** nas duas páginas.
- Perf segue no meio dos 90 (oscila com a rede/CPU emulada); local não tem o
  beacon nem o `email-decode`, então o número não é comparável 1:1 com produção.
  O ganho do `defer` aparecerá em produção no próximo deploy.

### Recomendação (ação do dono, fora do código)

Para remover o `email-decode.min.js` (~1 s render-blocking em produção), avaliar
desligar **Scrape Shield → Email Address Obfuscation** no painel Cloudflare do
domínio. Trade-off: perde-se a ofuscação anti-spam dos e-mails em texto puro.
Não foi mexido — é configuração de conta e envolve decisão do dono.
