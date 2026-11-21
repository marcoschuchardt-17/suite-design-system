# Design-Skills

Die vier Werkzeuge aus MAR-214, die das Designsystem beim Bauen **durchsetzen**
statt es nur zu beschreiben.

## Warum sie hier liegen

MAR-89 legt fest, *was* das Designsystem ist. Es fehlte die Ebene, die es beim
Bauen tatsächlich anwendet — sonst existiert es als Dokument und nicht im Code.
Genau das war die Ursache bei MAR-192: eine Landingpage, die wie eine
generische SaaS-Mustervorlage wirkte, obwohl ein Designsystem vorhanden war.

MAR-253 hielt am 25.08.2026 fest, dass die vier Skills nirgends auf dem Rechner
sind. Am 28.08.2026 waren sie es immer noch nicht — und eine Suche auf GitHub
ergab: Sie existierten überhaupt nie als Dateien. In MAR-214 stehen sie
ausführlich beschrieben, gebaut wurden sie nie.

Diese Verzeichnisse schließen das. **Im Repository und nicht nur unter
`~/.claude/skills/`,** damit sie einen Rechnerwechsel überleben — genau das
Problem, das MAR-253 beschreibt.

## Die vier

| Skill | Wofür | Läuft |
|---|---|---|
| **`design-taste`** | Diagnose gegen zwölf Symptome generischen KI-Designs, fünf harte Regeln, abschnittsweiser Redesign-Ablauf | als Anleitung |
| **`ui-design-intelligence`** | Palette, Schriftpaar, Stil und Skalen für **neue** Projekte ableiten — mit Deutsch-Tauglichkeit der Schriften | als Anleitung |
| **`browser-qa`** | Messen im echten Browser über 1440/768/390, hell und dunkel | `pruefen.mjs` |
| **`design-system-extractor`** | `DESIGN-SYSTEM.md`, `tokens.css` und `tailwind.config.js` aus einer laufenden Seite ziehen | `ziehen.mjs` |

Die Reihenfolge im Einsatz: **extractor** (falls kein System da ist) →
**intelligence** (falls Entscheidungen fehlen) → bauen → **taste** (Diagnose
und Redesign) → **browser-qa** (messen, am Ende).

## Einrichten

```bash
sh skills/einrichten.sh
```

Legt Verknüpfungen in `~/.claude/skills/` an. Kopiert nicht — so wirkt jede
Änderung im Repository sofort, und es gibt keine zweite Fassung, die
auseinanderläuft.

Für die beiden Skripte:

```bash
npm install playwright && npx playwright install chromium
```

## Geprüft

Beide Skripte laufen gegen die Homepage:

```bash
node skills/browser-qa/pruefen.mjs http://127.0.0.1:8000 / /notizen /reisen
node skills/design-system-extractor/ziehen.mjs http://127.0.0.1:8000 / /notizen
```

Der Extraktor gewinnt aus der gerenderten Seite vier von fünf Tokens exakt so
zurück, wie sie in `basis.css` stehen — `canvas`, `ink`, `muted-strong` und
`accent`. Bei `surface` misst er `#f8fafc` statt `#ffffff`, und das ist richtig:
Auf den geprüften Seiten kommt reines Weiß nicht vor.

Die Prüfungen von `browser-qa` sind gegengeprobt. Unterdrückte Fokusrahmen
ergeben 36 Funde in 6 Durchgängen, eine zu schwache Textfarbe 6 — ohne
Eingriff bleibt es still.

## Was sie nicht sind

Keine Kopien der Skills aus dem Instagram-Reel von Mete Aktürk, das MAR-214
ausgelöst hat. Die Originale (`Skill UI`, `Impeccable`, `UI UX Pro Max`,
`Playwright CLI`) sind englischsprachig und allgemein gehalten. Diese hier sind
deutsch, kennen `--suite-*`, Blade, Dokploy hinter Traefik und die
DSGVO-Grenzen der Suite — und sie verweisen auf die Ticketnummern, unter denen
die Entscheidungen dokumentiert sind.

## Bezug

MAR-214 (Beschreibung, aus der sie gebaut sind), MAR-89 (das Designsystem),
MAR-253 (der Befund), MAR-192 (der Anlass), MAR-189 (Mixed Content hinter dem
Reverse Proxy).
