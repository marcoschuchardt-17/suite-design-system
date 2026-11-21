// Schreibt die Marken in die Anwendungen. Aus derselben Zeichnung wie die
// React-Komponente (src/icons/marken.ts).
//
// Zwei Ausgabearten, weil die Einbindung sich unterscheidet:
//
//   Blade-Komponente  currentColor - die Marke nimmt die Textfarbe an. Fuer
//                     alles, was inline im Markup steht.
//   Eigenstaendige    Feste Farbe noetig: als Favicon oder in einem <img> kann
//   .svg-Datei        ein SVG keine Farbe vom umgebenden Text erben.
//
//   node scripts/marken-ausliefern.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const WURZEL = resolve(new URL('../..', import.meta.url).pathname);
const quelle = readFileSync(new URL('../src/icons/marken.ts', import.meta.url), 'utf8');

const marken = [...quelle.matchAll(/name: '([^']+)',\s*\n\s*titel: '([^']+)',[\s\S]*?d: '([^']+)',/g)]
  .map((m) => ({ name: m[1], titel: m[2], d: m[3] }));
if (!marken.length) { console.error('✗ keine Marken erkannt'); process.exit(1); }

/** Akzent hell/dunkel aus dem kanonischen Token-Satz. */
const AKZENT = { hell: '#4f46e5', dunkel: '#818cf8' };

const blade = (m) => `{{--
  Zeichen der ${m.titel} (MAR-89). ERZEUGT von
  suite-design-system/scripts/marken-ausliefern.mjs aus src/icons/marken.ts —
  nicht von Hand bearbeiten.

  Dieselbe Geometrie wie der Symbolsatz: 24er-Raster, 20er Nutzflaeche, 2px
  Kontur, currentColor. Marke und Symbole gehoeren dadurch sichtbar zusammen.

  Die Marke ist eine KONTUR-Zeichnung. Am Aufruf darf deshalb kein
  fill-current stehen — das wuerde die Formen vollflaechig fuellen. Die Farbe
  kommt ueber text-* wie bei jedem anderen Text.
--}}
@props(['titel' => '${m.titel}', 'beschriftet' => true])

{{-- 'beschriftet' statt :titel="null": Blade ersetzt ein uebergebenes null
     durch den Standardwert aus @props, ein false dagegen nicht. Steht der
     Anwendungsname daneben, :beschriftet="false" setzen - sonst liest ein
     Screenreader alles doppelt. --}}

<svg {{ $attributes->merge(['class' => 'suite-marke']) }}
     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round"
     @if ($beschriftet && $titel) role="img" aria-label="{{ $titel }}" @else aria-hidden="true" @endif
     focusable="false">
  ${m.d}
</svg>
`;

const datei = (m) => `<!--
  Zeichen der ${m.titel} (MAR-89). ERZEUGT von
  suite-design-system/scripts/marken-ausliefern.mjs — nicht von Hand bearbeiten.

  Feste Farbe statt currentColor: diese Datei laeuft als Favicon und in einem
  <img>. Beide koennen keine Farbe vom umgebenden Text erben. Der Wert ist der
  Suite-Akzent, kein Fremdton — die Medienabfrage haelt ihn auch im dunklen
  Modus lesbar.
-->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="${m.titel}">
  <style>
    .marke { fill: none; stroke: ${AKZENT.hell}; stroke-width: 2;
             stroke-linecap: round; stroke-linejoin: round; }
    @media (prefers-color-scheme: dark) { .marke { stroke: ${AKZENT.dunkel}; } }
  </style>
  <g class="marke">${m.d.replace(/ fill="currentColor" stroke="none"/g, ` fill="${AKZENT.hell}" stroke="none"`)}</g>
</svg>
`;

/** [Marke, Projektordner, Zieldatei, Art] */
const ZIELE = [
  ['school-organizer', 'school-organizer', 'resources/views/components/application-logo.blade.php', 'blade'],
  ['finanzkompass', 'finanzkompass', 'resources/views/components/app-logo-icon.blade.php', 'blade'],
  ['lernen-app', 'lernen-app', 'resources/views/components/app-logo-icon.blade.php', 'blade'],
  ['lernen-app', 'lernen-app', 'public/assets/logo.svg', 'datei'],
];

for (const [markenName, projekt, ziel, art] of ZIELE) {
  const m = marken.find((x) => x.name === markenName);
  if (!m) { console.error(`✗ Marke fehlt: ${markenName}`); process.exit(1); }
  const wurzel = join(WURZEL, projekt);
  if (!existsSync(wurzel)) { console.error(`✗ Projekt fehlt: ${wurzel}`); process.exit(1); }
  const pfad = join(wurzel, ziel);
  mkdirSync(join(pfad, '..'), { recursive: true });
  writeFileSync(pfad, art === 'blade' ? blade(m) : datei(m));
  console.log(`  ${m.titel.padEnd(18)} → ${projekt}/${ziel}`);
}

console.log('\n  Hinweis: an den Aufrufstellen darf kein fill-current mehr stehen.');
