// Rendert die Marken zum Ansehen: gross auf dem Raster, in Kopfzeilengroesse
// und ganz klein - Marken muessen vor allem klein noch funktionieren.
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const q = readFileSync('src/icons/marken.ts', 'utf8');
const marken = [...q.matchAll(/name: '([^']+)',\s*\n\s*titel: '([^']+)',[\s\S]*?d: '([^']+)',/g)]
  .map((m) => ({ name: m[1], titel: m[2], d: m[3] }));
if (!marken.length) { console.error('keine Marken erkannt'); process.exit(1); }

const svg = (d, g) => `<svg viewBox="0 0 24 24" width="${g}" height="${g}" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

writeFileSync('/tmp/marken.html', `<!doctype html><meta charset="utf-8"><style>
 body{margin:0;padding:28px;background:#f4f7fb;color:#14213d;font:400 15px/1.5 system-ui,sans-serif}
 h1{font-size:18px;margin:0 0 20px}
 .r{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
 .z{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;text-align:center}
 .g{display:inline-block;position:relative;background-image:linear-gradient(#eef2ff 1px,transparent 1px),
    linear-gradient(90deg,#eef2ff 1px,transparent 1px);background-size:8px 8px;outline:1px solid #c7d2fe}
 .nutz{position:absolute;inset:10px;outline:1px dashed #a5b4fc}
 .n{font-size:12px;color:#475569;margin-top:10px}
 .klein{margin-top:22px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:18px 22px;
        display:flex;flex-direction:column;gap:14px}
 .zeile{display:flex;align-items:center;gap:14px;color:#4f46e5}
 .zeile b{color:#14213d;font-weight:600;font-size:15px;margin-left:6px}
 .dunkel{margin-top:16px;background:#0b1120;border-radius:12px;padding:18px 22px;display:flex;gap:26px;color:#818cf8}
</style>
<h1>Suite-Marken — ${marken.length} · Raster 24, Nutzflaeche 20 (gestrichelt), Kontur 2</h1>
<div class="r">${marken.map((m) => `<div class="z"><div class="g" style="width:120px;height:120px">
 ${svg(m.d, 120)}<div class="nutz"></div></div><div class="n">${m.name}</div></div>`).join('')}</div>
<div class="klein">${marken.map((m) => `<div class="zeile">${svg(m.d, 32)}${svg(m.d, 24)}${svg(m.d, 20)}${svg(m.d, 16)}<b>${m.titel}</b></div>`).join('')}</div>
<div class="dunkel">${marken.map((m) => svg(m.d, 28)).join('')}</div>`);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1100, height: 800 }, deviceScaleFactor: 2 });
await p.goto('file:///tmp/marken.html');
await p.screenshot({ path: process.argv[2] ?? 'marken.png', fullPage: true });
await b.close();
console.log(`${marken.length} Marken gerendert`);
