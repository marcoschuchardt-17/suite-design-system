/*
 * Selbsttest fuer pruefen.mjs: laeuft gegen selbsttest.html mit bekannten Kontrasten.
 *
 *   node selbsttest.mjs
 *
 * Erwartet je Durchgang genau drei Kontrastfunde (B 4,48, C etwa 2,5, F 3,95) und einen Skeleton,
 * sonst nichts: kein Fund fuer oklch auf dunkel, fuer den Hauch-Hintergrund, fuer placeholder-Klassen
 * oder fuer role="main".
 */
import { execFileSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const hier = dirname(fileURLToPath(import.meta.url));
let ausgabe;
try {
  ausgabe = execFileSync('node', [`${hier}/pruefen.mjs`, `file://${hier}`, '/selbsttest.html'], { encoding: 'utf8' });
} catch (e) {
  ausgabe = e.stdout; // pruefen.mjs endet bei Funden mit Fehlercode 1 - das ist hier gewollt
}

const bloecke = ausgabe.split(/\n(?=(?:light|dark)\/)/).filter((b) => /^(light|dark)\//.test(b));
const fehler = [];
if (bloecke.length !== 6) fehler.push(`6 Durchgaenge erwartet, ${bloecke.length} gefunden`);

for (const b of bloecke) {
  const kopf = b.split('\n')[0];
  const funde = b.split('\n').slice(1).filter((z) => z.trim().startsWith('['));
  const werte = funde.filter((z) => z.includes('[Kontrast]')).map((z) => Number(z.match(/\] ([\d.]+):1/)[1])).sort((x, y) => x - y);
  const soll = [[2.4, 2.6], [3.9, 4.0], [4.45, 4.5]];
  if (werte.length !== 3 || werte.some((w, i) => w < soll[i][0] || w > soll[i][1])) fehler.push(`${kopf}: Kontraste ${werte.join(', ')} statt etwa 2,5 / 3,95 / 4,48`);
  if (funde.filter((z) => z.includes('[Skeleton]')).length !== 1) fehler.push(`${kopf}: genau ein Skeleton erwartet`);
  const rest = funde.filter((z) => !z.includes('[Kontrast]') && !z.includes('[Skeleton]'));
  if (rest.length) fehler.push(`${kopf}: unerwartet ${rest.map((z) => z.trim()).join(' | ')}`);
}

if (fehler.length) {
  console.error('Selbsttest FEHLGESCHLAGEN:\n  ' + fehler.join('\n  '));
  process.exit(1);
}
console.log(`Selbsttest bestanden: ${bloecke.length} Durchgaenge, je 3 Kontrastfunde und 1 Skeleton wie erwartet.`);
