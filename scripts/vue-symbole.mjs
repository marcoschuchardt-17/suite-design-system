// Erzeugt die Vue-Komponente fuer die Inertia-Anwendungen aus derselben Quelle
// wie die React- und die Blade-Komponente (src/icons/pfade.ts).
//
// Dritte Ausgabe aus einer Zeichnung. Der Grund ist derselbe wie bei der
// zweiten: sonst laufen sie auseinander, und genau das soll MAR-89 abschaffen.
// Inertia-Anwendungen mit Vue konnten den Satz bisher nicht nutzen.
//
//   node scripts/vue-symbole.mjs ../<anwendung>

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const quelle = readFileSync(new URL('../src/icons/pfade.ts', import.meta.url), 'utf8');
const symbole = [...quelle.matchAll(/\{ name: '([^']+)', auch: \[([^\]]*)\],\s*\n?\s*d: '([^']+)' \}/g)]
  .map((m) => ({ name: m[1], auch: m[2].replace(/'/g, '').trim(), d: m[3] }));

if (!symbole.length) { console.error('✗ keine Symbole in src/icons/pfade.ts erkannt'); process.exit(1); }

const eintraege = symbole.map((s) =>
  `    // ${s.auch || s.name}\n    '${s.name}': '${s.d.replace(/'/g, "\\'")}',`
).join('\n');

const vue = `<script setup>
/**
 * Suite-Symbole (MAR-89). ERZEUGT von suite-design-system/scripts/vue-symbole.mjs
 * aus src/icons/pfade.ts — nicht von Hand bearbeiten. Aenderungen an den
 * Zeichnungen gehoeren in das Designsystem, dann neu erzeugen.
 *
 * 24er-Raster, 20er Nutzflaeche, 2px Kontur, currentColor. Das Symbol nimmt die
 * Textfarbe an und stimmt damit in hell wie dunkel ohne Zutun.
 *
 * Eingebettet statt nachgeladen: eine Symbolschrift oder ein CDN waere bei jedem
 * Seitenaufruf eine Verbindung zu einem Dritten.
 *
 * Verwendung:
 *     <Symbol name="kalender" />                 20, neben Fliesstext
 *     <Symbol name="papierkorb" :groesse="24" /> neben Ueberschriften
 *     <Symbol name="stift" :groesse="14" />      dichte Raster, text-xs
 *     <Symbol name="abmelden" titel="Abmelden" /> wenn es allein steht
 *
 * Drei Groessen, keine Zwischenwerte. 14 gilt fuer Tabellenzellen und
 * Listenzeilen, wo der Text selbst schon auf .75rem steht.
 *
 * 'titel' nur setzen, wenn kein Text danebensteht. Sonst liest ein Screenreader
 * alles doppelt vor.
 */
import { computed } from 'vue';

const props = defineProps({
  name: { type: String, required: true },
  groesse: { type: Number, default: 20 },
  titel: { type: String, default: null },
});

const PFADE = {
${eintraege}
};

// Ein unbekannter Name zeichnet nichts, statt ein falsches Symbol zu zeigen.
const pfad = computed(() => PFADE[props.name] ?? '');
</script>

<template>
  <svg
    v-if="pfad"
    class="suite-symbol"
    viewBox="0 0 24 24"
    :width="groesse"
    :height="groesse"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="titel ? 'img' : undefined"
    :aria-label="titel || undefined"
    :aria-hidden="titel ? undefined : 'true'"
    focusable="false"
    v-html="pfad"
  />
</template>
`;

const ziele = process.argv.slice(2);
if (!ziele.length) { console.error('✗ keine Zielprojekte angegeben'); process.exit(1); }

for (const ziel of ziele) {
  const wurzel = resolve(ziel);
  if (!existsSync(wurzel)) { console.error(`✗ nicht gefunden: ${wurzel}`); process.exit(1); }
  const dir = join(wurzel, 'resources', 'js', 'Components');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'Symbol.vue'), vue);
  console.log(`  ${symbole.length} Symbole → ${ziel}/resources/js/Components/Symbol.vue`);
}
