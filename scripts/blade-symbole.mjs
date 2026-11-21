// Erzeugt die Blade-Komponente fuer die Laravel-Anwendungen aus derselben
// Quelle wie die React-Komponente (src/icons/pfade.ts).
//
// Zwei Ausgaben aus einer Zeichnung: sonst laufen sie auseinander, und genau
// das soll MAR-89 abschaffen.
//
//   node scripts/blade-symbole.mjs ../school-organizer ../lernen-app ../finanzkompass

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const quelle = readFileSync(new URL('../src/icons/pfade.ts', import.meta.url), 'utf8');
const symbole = [...quelle.matchAll(/\{ name: '([^']+)', auch: \[([^\]]*)\],\s*\n?\s*d: '([^']+)' \}/g)]
  .map((m) => ({ name: m[1], auch: m[2].replace(/'/g, '').trim(), d: m[3] }));

if (!symbole.length) { console.error('✗ keine Symbole in src/icons/pfade.ts erkannt'); process.exit(1); }

const faelle = symbole.map((s) =>
  `    @case('${s.name}')${s.auch ? ` {{-- ${s.auch} --}}` : ''}\n      ${s.d}\n      @break`
).join('\n');

const blade = `{{--
  Suite-Symbole (MAR-89). ERZEUGT von suite-design-system/scripts/blade-symbole.mjs
  aus src/icons/pfade.ts — nicht von Hand bearbeiten. Aenderungen an den
  Zeichnungen gehoeren in das Designsystem, dann neu erzeugen.

  24er-Raster, 20er Nutzflaeche, 2px Kontur, currentColor. Das Symbol nimmt die
  Textfarbe an und stimmt damit in hell wie dunkel ohne Zutun.

  Eingebettet statt nachgeladen: eine Symbolschrift oder ein CDN waere bei jedem
  Seitenaufruf eine Verbindung zu einem Dritten — genau das, was die
  Datenschutzerklaerung ausschliesst.

  Verwendung:
      <x-symbol name="kalender" />                    (20, neben Fliesstext)
      <x-symbol name="papierkorb" :groesse="24" />    (neben Ueberschriften)
      <x-symbol name="stift" :groesse="14" />         (dichte Raster, text-xs)
      <x-symbol name="abmelden" titel="Abmelden" />   (wenn es allein steht)

  Drei Groessen, keine Zwischenwerte. 14 gilt fuer Tabellenzellen, Stundenplan
  und Listenzeilen, wo der Text selbst schon auf .75rem steht — ein 20er
  Zeichen sprengt dort die Zeile.

  In den Beispielen oben stehen bewusst runde Klammern statt Blade-Kommentaren.
  Blade-Kommentare lassen sich nicht schachteln: das erste schliessende Zeichen
  beendet den ganzen Block, und alles danach landet sichtbar auf jeder Seite,
  die ein Symbol benutzt.

  'titel' nur setzen, wenn kein Text danebensteht. Sonst liest ein Screenreader
  alles doppelt vor.

  Im Beispiel oben steht bewusst eine runde Klammer statt eines Blade-Kommentars.
  Blade-Kommentare lassen sich nicht schachteln: das erste schliessende Zeichen
  beendet den ganzen Block, und alles danach landet sichtbar auf jeder Seite,
  die ein Symbol benutzt.
--}}
@props(['name', 'groesse' => 20, 'titel' => null])

<svg {{ $attributes->merge(['class' => 'suite-symbol']) }}
     viewBox="0 0 24 24" width="{{ $groesse }}" height="{{ $groesse }}"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     @if ($titel) role="img" aria-label="{{ $titel }}" @else aria-hidden="true" @endif
     focusable="false">
  @switch($name)
${faelle}
    @default
      {{-- Unbekannter Name: nichts zeichnen statt ein falsches Symbol zeigen. --}}
  @endswitch
</svg>
`;

const ziele = process.argv.slice(2);
if (!ziele.length) { console.error('✗ keine Zielprojekte angegeben'); process.exit(1); }

for (const ziel of ziele) {
  const wurzel = resolve(ziel);
  if (!existsSync(wurzel)) { console.error(`✗ nicht gefunden: ${wurzel}`); process.exit(1); }
  const dir = join(wurzel, 'resources', 'views', 'components');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'symbol.blade.php'), blade);
  console.log(`  ${symbole.length} Symbole → ${ziel}/resources/views/components/symbol.blade.php`);
}
