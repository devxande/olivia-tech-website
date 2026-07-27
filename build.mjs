// Build de produção: combina e minifica CSS/JS a partir das fontes e injeta
// um hash de versão nas referências do HTML (cache-busting).
// Uso: npm run build
//
// Por que hash na URL (e não Cache-Control): a zona Cloudflare sobrescreve o
// Cache-Control dos assets (Browser Cache TTL), então confiar no header não é
// confiável. Referenciar `app.min.css?v=<hash>` cria uma URL nova sempre que o
// conteúdo muda — o navegador busca a versão certa, independente do cache.
// O HTML não é cacheado longo (padrão do Pages revalida), então sempre entrega
// o `?v=` atual. Como o hash vem do conteúdo, o build é determinístico: mesmas
// fontes → mesmo hash → HTML idêntico (o Cloudflare regenera no deploy).
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { minify as cssMinify } from 'csso';
import { minify as jsMinify } from 'terser';

const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);

// CSS — tokens primeiro (define as variáveis), depois styles.
const css = cssMinify(
  readFileSync('css/tokens.css', 'utf8') + '\n' + readFileSync('css/styles.css', 'utf8')
).css;
writeFileSync('css/app.min.css', css);
const cssV = hash(css);
console.log('css/app.min.css gerado (v=' + cssV + ')');

// JS
const js = (await jsMinify(readFileSync('js/main.js', 'utf8'), { compress: true, mangle: true })).code;
writeFileSync('js/main.min.js', js);
const jsV = hash(js);
console.log('js/main.min.js gerado (v=' + jsV + ')');

// Injeta/atualiza o ?v=<hash> nas referências do HTML (idempotente).
for (const file of ['index.html', '404.html', 'privacidade.html']) {
  let html;
  try {
    html = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  const before = html;
  html = html
    .replace(/css\/app\.min\.css(\?v=[a-f0-9]+)?/g, 'css/app.min.css?v=' + cssV)
    .replace(/js\/main\.min\.js(\?v=[a-f0-9]+)?/g, 'js/main.min.js?v=' + jsV);
  if (html !== before) {
    writeFileSync(file, html);
    console.log(file + ' atualizado com ?v=');
  }
}
