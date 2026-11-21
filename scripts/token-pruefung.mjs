// Driftpruefung fuer die --suite-*-Tokens (MAR-89).
//
// Der Token-Block steht in jeder Anwendung noch einmal. Heute stimmen alle
// ueberein - aber genau so entstanden das gruene Finanzkompass und das
// violette Lernen-App: eine Kopie aendert sich, die anderen merken es nicht.
//
// Kanonisch ist die Homepage. Diese Pruefung vergleicht jede Anwendung dagegen
// und nennt jede Abweichung mit Datei, Token und beiden Werten.
//
//   node scripts/token-pruefung.mjs                    # alle bekannten Apps
//   node scripts/token-pruefung.mjs ../school-organizer

import { readFileSync, existsSync } from 'node:fs';
import { basename, join, resolve, relative } from 'node:path';

const PAKET = resolve(new URL('..', import.meta.url).pathname);
const WURZEL = resolve(PAKET, '..');
const HOMEPAGE = resolve(process.env.SUITE_HOMEPAGE ?? join(WURZEL, 'homepage'));

/** Die Anwendungen und ihr Stylesheet, relativ zum Projektordner. */
const ANWENDUNGEN = [
  ['school-organizer', 'resources/css/app.css'],
  ['finanzkompass', 'resources/css/app.css'],
  ['lernen-app', 'resources/css/app.css'],
];

/**
 * Liest --suite-*-Zuweisungen. Die Anwendungen benennen ihre Dark-Bloecke
 * unterschiedlich (html.dark, .dark, [data-theme="dark"]), deshalb wird nicht
 * nach Selektor gesucht, sondern nach der Reihenfolge: das erste Vorkommen
 * eines Tokens ist der helle Wert, das zweite der dunkle.
 */
function tokenLesen(css) {
  const hell = new Map();
  const dunkel = new Map();
  for (const m of css.matchAll(/--suite-([a-z-]+)\s*:\s*([^;]+);/g)) {
    const name = m[1];
    const wert = m[2].trim().replace(/\s+/g, ' ');
    if (!hell.has(name)) hell.set(name, wert);
    else if (!dunkel.has(name)) dunkel.set(name, wert);
  }
  return { hell, dunkel };
}

/** Schatten und Radius der Vorlage duerfen je Projekt abweichen; die Skala (text-*, radius-flaeche/-bedienung) nicht. */
const IGNORIEREN = new Set(['shadow', 'radius', 'glow']);

function vergleichen(kanon, ist, modus, quelle) {
  const funde = [];
  for (const [name, sollWert] of kanon) {
    if (IGNORIEREN.has(name)) continue;
    const istWert = ist.get(name);
    if (istWert === undefined) {
      funde.push({ modus, name, soll: sollWert, ist: null, quelle });
    } else if (istWert.toLowerCase() !== sollWert.toLowerCase()) {
      funde.push({ modus, name, soll: sollWert, ist: istWert, quelle });
    }
  }
  return funde;
}

const basis = join(HOMEPAGE, 'resources/css/basis.css');
if (!existsSync(basis)) {
  console.error(`✗ Kanonische Quelle nicht gefunden: ${basis}`);
  console.error('  SUITE_HOMEPAGE=/pfad/zu/homepage node scripts/token-pruefung.mjs');
  process.exit(2);
}
const kanon = tokenLesen(readFileSync(basis, 'utf8'));
console.log(`Kanonisch: ${relative(WURZEL, basis)} — ${kanon.hell.size} Tokens hell, ${kanon.dunkel.size} dunkel\n`);

const ziele = process.argv.slice(2).length
  ? process.argv.slice(2).map((z) => [resolve(z), 'resources/css/app.css'])
  : ANWENDUNGEN.map(([n, f]) => [join(WURZEL, n), f]);

let abweichungen = 0;
let geprueft = 0;

for (const [wurzel, datei] of ziele) {
  const pfad = join(wurzel, datei);
  const rel = relative(WURZEL, wurzel);
  const name = !rel || rel.startsWith('..') ? basename(wurzel) : rel;
  if (!existsSync(pfad)) { console.log(`  ?  ${name.padEnd(20)} kein ${datei} — uebersprungen`); continue; }
  geprueft++;

  const ist = tokenLesen(readFileSync(pfad, 'utf8'));
  const funde = [
    ...vergleichen(kanon.hell, ist.hell, 'hell', `${name}/${datei}`),
    ...vergleichen(kanon.dunkel, ist.dunkel, 'dunkel', `${name}/${datei}`),
  ];

  if (!funde.length) {
    console.log(`  ✓  ${name.padEnd(20)} stimmt mit dem kanonischen Satz ueberein`);
    continue;
  }
  abweichungen += funde.length;
  console.log(`  ✗  ${name.padEnd(20)} ${funde.length} Abweichung(en) in ${datei}`);
  for (const f of funde) {
    const ist = f.ist === null ? '(fehlt)' : f.ist;
    console.log(`       --suite-${f.name} (${f.modus}): ${ist}  →  erwartet ${f.soll}`);
  }
}

console.log();
if (abweichungen) {
  console.log(`✗ ${abweichungen} Abweichung(en) in ${geprueft} Anwendung(en).`);
  console.log('  Der Token-Block gehoert Zeichen fuer Zeichen wie in der Homepage in jede Anwendung.');
  process.exit(1);
}
console.log(`✓ ${geprueft} Anwendung(en) stimmen mit dem kanonischen Satz ueberein.`);
