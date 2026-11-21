// Rendert alle Symbole als Kontaktbogen zum Ansehen. Zweimal je Symbol:
// gross auf dem Raster (Geometrie pruefen) und in Lesegroesse neben Text
// (das ist die Groesse, in der sie spaeter wirklich stehen).
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const quelle = readFileSync('src/icons/pfade.ts', 'utf8');
const symbole = [...quelle.matchAll(/\{ name: '([^']+)', auch: \[([^\]]*)\],\s*\n?\s*d: '([^']+)' \}/g)]
  .map((m) => ({ name: m[1], auch: m[2].replace(/'/g, ''), d: m[3] }));
if (!symbole.length) { console.error('keine Symbole erkannt'); process.exit(1); }

const svg = (d, groesse, strich) =>
  `<svg viewBox="0 0 24 24" width="${groesse}" height="${groesse}" fill="none" stroke="currentColor"
        stroke-width="${strich}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;padding:28px;background:#f4f7fb;color:#14213d;
       font:400 15px/1.5 -apple-system,system-ui,sans-serif}
  h1{font-size:18px;margin:0 0 20px}
  .raster{display:grid;grid-template-columns:repeat(8,1fr);gap:14px}
  .z{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px 8px;text-align:center}
  .gross{position:relative;display:inline-block;background-image:
      linear-gradient(#eef2ff 1px,transparent 1px),linear-gradient(90deg,#eef2ff 1px,transparent 1px);
      background-size:8px 8px;outline:1px solid #c7d2fe}
  .nutz{position:absolute;inset:8px;outline:1px dashed #a5b4fc;pointer-events:none}
  .n{font-size:11px;color:#475569;margin-top:8px;word-break:break-word}
  .lese{margin-top:24px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;
        display:grid;grid-template-columns:repeat(4,1fr);gap:10px 24px}
  .l{display:flex;align-items:center;gap:8px;font-size:15px}
  .l svg{flex:none;color:#4f46e5}
</style>
<h1>Suite-Symbole — ${symbole.length} Stueck · Raster 24, Nutzflaeche 20 (gestrichelt), Kontur 2</h1>
<div class="raster">
${symbole.map((s) => `<div class="z"><div class="gross" style="width:96px;height:96px">
  ${svg(s.d, 96, 2)}<div class="nutz"></div></div><div class="n">${s.name}</div></div>`).join('\n')}
</div>
<div class="lese">
${symbole.map((s) => `<div class="l">${svg(s.d, 20, 2)}<span>${s.name}</span></div>`).join('\n')}
</div>`;

writeFileSync('/tmp/symbol-bogen.html', html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
await p.goto('file:///tmp/symbol-bogen.html');
await p.screenshot({ path: process.argv[2] ?? 'symbol-bogen.png', fullPage: true });
await b.close();
console.log(`${symbole.length} Symbole gerendert`);
