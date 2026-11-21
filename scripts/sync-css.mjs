// Holt Stylesheets und Schriften aus dem Homepage-Repo, der Referenzimplementierung
// des Suite-Designsystems (MAR-89).
//
// Warum das ein Skript ist und keine einmalige Kopie: eine Kopie veraltet still.
// Aendert sich die Homepage, baut Claude Design sonst weiter in einer Farbwelt,
// die es nicht mehr gibt - genau die Doppelung, die MAR-89 abschaffen soll.
//
// Quelle ueberschreibbar: SUITE_HOMEPAGE=/pfad/zu/homepage npm run build

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const PAKET = resolve(HIER, '..');
const HOMEPAGE = resolve(process.env.SUITE_HOMEPAGE ?? join(PAKET, '..', 'homepage'));

function abbruch(text) {
  console.error(`\n✗ sync-css: ${text}\n`);
  console.error(`  Erwartet wurde das Homepage-Repo unter:\n    ${HOMEPAGE}`);
  console.error(`  Liegt es woanders: SUITE_HOMEPAGE=/pfad/zu/homepage npm run build\n`);
  process.exit(1);
}

if (!existsSync(HOMEPAGE)) abbruch('Homepage-Repo nicht gefunden.');

// [Ziel in src/styles, Quelle relativ zur Homepage]
const STYLESHEETS = [
  ['tokens.css', 'resources/css/basis.css'],
  ['components.css', 'resources/css/startseite.css'],
  ['suite-nav.css', 'partials/suite-nav.css'],
];

const zielDir = join(PAKET, 'src', 'styles');
mkdirSync(zielDir, { recursive: true });

for (const [ziel, quelle] of STYLESHEETS) {
  const pfad = join(HOMEPAGE, quelle);
  if (!existsSync(pfad)) abbruch(`Stylesheet fehlt: ${quelle}`);

  let css = readFileSync(pfad, 'utf8');

  // Die Homepage laedt Schriften absolut ab Domainwurzel. Im Paket liegen sie
  // zwei Ebenen ueber src/styles/.
  css = css.replaceAll('url("/fonts/', 'url("../../fonts/');

  // Die Tokens kommen als eigene Datei, nicht ueber den @import der Seite -
  // sonst stuende basis.css doppelt im Bundle.
  css = css.split('\n').filter((z) => !z.trimStart().startsWith('@import')).join('\n');

  writeFileSync(join(zielDir, ziel), `/* Erzeugt von scripts/sync-css.mjs aus homepage/${quelle}.\n   Nicht von Hand bearbeiten - Aenderungen gehoeren in die Homepage. */\n${css}`);
  console.log(`  ${ziel.padEnd(16)} ← homepage/${quelle}`);
}

// Schriften mitnehmen, damit das Bundle sie als Data-URI einbetten kann.
const fontQuelle = join(HOMEPAGE, 'public', 'fonts');
if (!existsSync(fontQuelle)) abbruch('Schriftverzeichnis fehlt: public/fonts');
const fontZiel = join(PAKET, 'fonts');
mkdirSync(fontZiel, { recursive: true });
let n = 0;
for (const datei of readdirSync(fontQuelle)) {
  if (/\.(woff2?|txt)$/.test(datei)) {
    cpSync(join(fontQuelle, datei), join(fontZiel, datei));
    n++;
  }
}
console.log(`  fonts/           ← homepage/public/fonts (${n} Dateien)`);
