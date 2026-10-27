// Genera los iconos de la app (negro obsidiana con monograma "D" metalizado).
// Uso: node scripts/crear-iconos.mjs  (solo hace falta si cambias el diseño del icono)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const fuente = readFileSync(join(raiz, 'node_modules/@fontsource/cinzel/files/cinzel-latin-600-normal.woff2')).toString('base64');

const html = (tam, margen) => `<!doctype html><html><head><style>
@font-face{font-family:C;src:url(data:font/woff2;base64,${fuente}) format('woff2');}
html,body{margin:0;width:${tam}px;height:${tam}px;background:#0d0e10;}
.c{position:absolute;inset:${margen}px;display:grid;place-items:center;border:${Math.round(tam * 0.012)}px solid #9ea3a9;
 background:radial-gradient(circle at 30% 25%,#1b1d21,#0d0e10 70%);}
.d{font:600 ${Math.round((tam - margen * 2) * 0.6)}px/1 C;padding-top:${Math.round(tam * 0.03)}px;
 background:linear-gradient(160deg,#e3e6ea 0%,#a9adb3 45%,#6f7379 100%);-webkit-background-clip:text;color:transparent;}
</style></head><body><div class="c"><span class="d">D</span></div></body></html>`;

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
for (const [nombre, tam, margen] of [
  ['icono-192.png', 192, 22],
  ['icono-512.png', 512, 58],
  ['icono-maskable-512.png', 512, 112],
  ['apple-touch-icon.png', 180, 22],
]) {
  await pagina.setViewportSize({ width: tam, height: tam });
  await pagina.setContent(html(tam, margen));
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.screenshot({ path: join(raiz, 'public/iconos', nombre) });
  console.log('✔', nombre);
}
await navegador.close();
