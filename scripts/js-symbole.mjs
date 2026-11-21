// Erzeugt die JS-Fassung der Suite-Symbole fuer Anwendungen, die Markup zur
// Laufzeit im Browser bauen (Lernrunde und Pruefungssimulation der Lernen-App).
//
// Dritte Ausgabe aus derselben Zeichnung: React (src/index.ts), Blade
// (blade-symbole.mjs) und jetzt JS. Ohne sie muessten die Pfade im JavaScript
// noch einmal stehen - genau die Verdopplung, die MAR-89 abschafft.
//
//   node scripts/js-symbole.mjs ../lernen-app
//
// Die Datei weist nur an globalThis zu und laesst sich damit sowohl per
// <script src> laden als auch in node importieren - wie buchung-eingabe.js.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const quelle = readFileSync(new URL('../src/icons/pfade.ts', import.meta.url), 'utf8');
const symbole = [...quelle.matchAll(/\{ name: '([^']+)', auch: \[([^\]]*)\],\s*\n?\s*d: '([^']+)' \}/g)]
  .map((m) => ({ name: m[1], d: m[3] }));

if (!symbole.length) {
  console.error('✗ keine Symbole in src/icons/pfade.ts erkannt');
  process.exit(1);
}

const eintraege = symbole.map((s) => `    '${s.name}': '${s.d.replace(/'/g, "\\'")}',`).join('\n');

const datei = `/**
 * Suite-Symbole fuer im Browser erzeugtes Markup (MAR-89).
 *
 * ERZEUGT von suite-design-system/scripts/js-symbole.mjs aus src/icons/pfade.ts -
 * nicht von Hand bearbeiten. Aenderungen an den Zeichnungen gehoeren in das
 * Designsystem, dann neu erzeugen.
 *
 * Fuer Blade gibt es die Komponente <x-symbol>; diese Fassung ist fuer app.js und
 * pruefung.js, die ihr Markup als Zeichenkette zusammensetzen.
 *
 * Verwendung:
 *     SuiteSymbole.svg('haken')
 *     SuiteSymbole.svg('blatt', 16, 'text-ampel-gruen')
 *
 * 'titel' nur setzen, wenn das Symbol allein steht - sonst liest ein
 * Screenreader alles doppelt vor.
 */
(function (global) {
  "use strict";

  var PFADE = {
${eintraege}
  };

  /**
   * @param {string} name    Symbolname aus dem Suite-Satz
   * @param {number} [groesse=20]
   * @param {string} [klasse='']  zusaetzliche CSS-Klassen
   * @param {string} [titel]      zugaenglicher Name, nur wenn das Symbol allein steht
   */
  function svg(name, groesse, klasse, titel) {
    var d = PFADE[name];
    if (!d) return '';

    var g = groesse || 20;
    var zugaenglich = titel
      ? 'role="img" aria-label="' + String(titel).replace(/"/g, '&quot;') + '"'
      : 'aria-hidden="true"';

    return '<svg class="suite-symbol ' + (klasse || '') + '" viewBox="0 0 24 24"' +
      ' width="' + g + '" height="' + g + '" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      zugaenglich + ' focusable="false">' + d + '</svg>';
  }

  global.SuiteSymbole = { svg: svg, namen: Object.keys(PFADE) };
})(typeof globalThis !== "undefined" ? globalThis : this);
`;

const ziele = process.argv.slice(2);
if (!ziele.length) {
  console.error('Aufruf: node scripts/js-symbole.mjs <pfad-zur-app> [...]');
  process.exit(1);
}

for (const ziel of ziele) {
  const wurzel = resolve(ziel);
  const ordner = join(wurzel, 'public', 'assets');

  if (!existsSync(ordner)) {
    console.error(`  ✗ ${ordner} gibt es nicht - uebersprungen`);
    continue;
  }

  const pfad = join(ordner, 'suite-symbole.js');
  writeFileSync(pfad, datei, 'utf8');
  console.log(`  ${symbole.length} Symbole → ${ziel}/public/assets/suite-symbole.js`);
}
