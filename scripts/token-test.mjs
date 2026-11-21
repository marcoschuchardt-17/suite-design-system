// Erzeugt je Anwendung einen Test, der ihren --suite-*-Block gegen den
// kanonischen Satz aus der Homepage prueft.
//
// Warum ein Test in der Anwendung und nicht nur das zentrale Skript: das
// zentrale Skript muss jemand aufrufen. Ein Test laeuft mit `composer test`
// mit - und faellt auf, bevor eine Abweichung deployt wird.
//
//   node scripts/token-test.mjs ../school-organizer ../lernen-app ../finanzkompass

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const WURZEL = resolve(new URL('../..', import.meta.url).pathname);
const HOMEPAGE = resolve(process.env.SUITE_HOMEPAGE ?? join(WURZEL, 'homepage'));
const basis = join(HOMEPAGE, 'resources/css/basis.css');
if (!existsSync(basis)) { console.error(`✗ kanonische Quelle fehlt: ${basis}`); process.exit(1); }

// radius (Vorlage), shadow und glow duerfen je Projekt abweichen. NICHT
// ignoriert: text-* und radius-flaeche/-bedienung (Skala, Oktober 2026) — sie
// stehen nur im ersten Block und werden darum als "hell" geprueft.
const IGNORIEREN = new Set(['shadow', 'radius', 'glow']);

function tokenLesen(css) {
  const hell = new Map(), dunkel = new Map();
  for (const m of css.matchAll(/--suite-([a-z-]+)\s*:\s*([^;]+);/g)) {
    const n = m[1], w = m[2].trim().replace(/\s+/g, ' ');
    if (IGNORIEREN.has(n)) continue;
    if (!hell.has(n)) hell.set(n, w); else if (!dunkel.has(n)) dunkel.set(n, w);
  }
  return { hell, dunkel };
}

const k = tokenLesen(readFileSync(basis, 'utf8'));
const phpMap = (m) => [...m].map(([n, w]) => `        '${n}' => '${w}',`).join('\n');

const test = `<?php

declare(strict_types=1);

namespace Tests\\Feature;

use Tests\\TestCase;

/**
 * Driftpruefung fuer die Suite-Design-Tokens (MAR-89).
 *
 * ERZEUGT von suite-design-system/scripts/token-test.mjs aus
 * homepage/resources/css/basis.css - nicht von Hand bearbeiten.
 *
 * Warum es diesen Test gibt: der Token-Block steht in jeder Anwendung noch
 * einmal. Genau so entstanden das gruene Finanzkompass und das violette
 * Lernen-App - eine Kopie aenderte sich, die anderen merkten es nicht. Dieser
 * Test faellt um, bevor das noch einmal passiert.
 *
 * Schlaegt er fehl, ist die Frage: hat sich das Designsystem geaendert (dann
 * gehoert der neue Wert in die Homepage und dieser Test wird neu erzeugt) oder
 * ist diese Anwendung abgedriftet (dann gehoert der kanonische Wert zurueck)?
 */
final class SuiteTokensTest extends TestCase
{
    /** Kanonisch, aus homepage/resources/css/basis.css. */
    private const HELL = [
${phpMap(k.hell)}
    ];

    private const DUNKEL = [
${phpMap(k.dunkel)}
    ];

    public function test_die_hellen_tokens_stimmen_mit_dem_designsystem_ueberein(): void
    {
        $this->assertTokens(self::HELL, 0);
    }

    public function test_die_dunklen_tokens_stimmen_mit_dem_designsystem_ueberein(): void
    {
        $this->assertTokens(self::DUNKEL, 1);
    }

    /**
     * @param  array<string, string>  $erwartet
     * @param  int  $vorkommen  0 = erstes Vorkommen (hell), 1 = zweites (dunkel)
     */
    private function assertTokens(array $erwartet, int $vorkommen): void
    {
        $ist = $this->tokenLesen();
        $abweichungen = [];

        foreach ($erwartet as $name => $soll) {
            $werte = $ist[$name] ?? [];
            $wert = $werte[$vorkommen] ?? null;

            if ($wert === null) {
                $abweichungen[] = "--suite-{$name}: fehlt, erwartet {$soll}";
            } elseif (strtolower($wert) !== strtolower($soll)) {
                $abweichungen[] = "--suite-{$name}: {$wert}, erwartet {$soll}";
            }
        }

        $this->assertSame([], $abweichungen, implode("\\n", array_merge(
            ['Die Design-Tokens weichen vom Suite-Designsystem ab:'],
            array_map(static fn (string $z): string => '  '.$z, $abweichungen),
            ['', 'Kanonisch ist homepage/resources/css/basis.css.'],
        )));
    }

    /** @return array<string, list<string>> */
    private function tokenLesen(): array
    {
        $pfad = resource_path('css/app.css');
        $this->assertFileExists($pfad, 'Das Stylesheet der Anwendung fehlt.');

        preg_match_all('/--suite-([a-z-]+)\\s*:\\s*([^;]+);/', (string) file_get_contents($pfad), $treffer, PREG_SET_ORDER);

        $tokens = [];
        foreach ($treffer as $t) {
            $tokens[$t[1]][] = trim((string) preg_replace('/\\s+/', ' ', $t[2]));
        }

        return $tokens;
    }
}
`;

const ziele = process.argv.slice(2);
if (!ziele.length) { console.error('✗ keine Zielprojekte angegeben'); process.exit(1); }
for (const z of ziele) {
  const w = resolve(z);
  if (!existsSync(w)) { console.error(`✗ nicht gefunden: ${w}`); process.exit(1); }
  const dir = join(w, 'tests', 'Feature');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'SuiteTokensTest.php'), test);
  console.log(`  ${k.hell.size} hell + ${k.dunkel.size} dunkel → ${z}/tests/Feature/SuiteTokensTest.php`);
}
