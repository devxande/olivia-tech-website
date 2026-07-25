// Build de produção: combina e minifica CSS/JS a partir das fontes.
// Uso: npm run build  (gera css/app.min.css e js/main.min.js)
import { readFileSync, writeFileSync } from 'node:fs';
import { minify as cssMinify } from 'csso';
import { minify as jsMinify } from 'terser';

// CSS — tokens primeiro (define as variáveis), depois styles.
const css = readFileSync('css/tokens.css', 'utf8') + '\n' + readFileSync('css/styles.css', 'utf8');
writeFileSync('css/app.min.css', cssMinify(css).css);
console.log('css/app.min.css gerado');

// JS
const js = await jsMinify(readFileSync('js/main.js', 'utf8'), { compress: true, mangle: true });
writeFileSync('js/main.min.js', js.code);
console.log('js/main.min.js gerado');
