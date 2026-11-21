# Suite-Designsystem — „Focus Flow × Nordic Clarity"

Gemeinsames System für Marco Schuchardts Anwendungen (School Organizer,
Lernen-App, Finanzkompass, Portfolio). Alle Komponenten liegen auf
`window.SuiteDS`.

## Aufbau

Kein Provider, kein Wrapper nötig. Die Komponenten sind reine Auszeichnung und
holen sich alles aus CSS-Variablen. **Voraussetzung ist einzig `styles.css`** —
ohne sie fehlen Tokens *und* Schriften, und alles rendert unformatiert.

Dark Mode ist eingebaut und läuft dreifach: `prefers-color-scheme` folgt dem
System, `:root[data-theme="dark"]` erzwingt Dunkel, `:root[data-theme="light"]`
erzwingt Hell. Für einen Umschalter genügt `data-theme` am `<html>`.

## Styling-Idiom: CSS-Variablen, keine Utility-Klassen

Dieses System kennt **kein Tailwind**. Für eigenes Layout werden die Tokens
direkt in CSS benutzt — nie ein Hexwert, nie eine erfundene Klasse.

| Rolle | Token |
|---|---|
| Seitenhintergrund | `--suite-canvas` |
| Karten, Dialoge | `--suite-surface` |
| Leisten, Hinweisflächen | `--suite-surface-muted` |
| Linien, Rahmen | `--suite-border` |
| Haupttext, Überschriften | `--suite-ink` |
| **Fließtext, Sekundärtext** | `--suite-muted-strong` |
| nur dekorativ | `--suite-muted` |
| der eine Akzent | `--suite-accent` |
| Hover, gedrückt | `--suite-accent-strong` |
| Akzentflächen | `--suite-accent-soft` |
| Radius der Vorlage | `--suite-radius` (1rem, nur Vorlage — für eigene Flächen nicht mehr nehmen) |
| Radius Flächen (Karten, Bilder) | `--suite-radius-flaeche` (1,375rem) |
| Radius Knöpfe, Felder | `--suite-radius-bedienung` (.625rem) |
| Schatten | `--suite-shadow` |
| Schriften | `--font-ui` (Figtree), `--font-read` (Source Serif 4) |
| Innenabstand | `--space-inner` (1.75rem) |
| Sektionsabstand | `--space-section` |

## Schriftskala und Radien (Oktober 2026)

Sieben Schriftstufen, zwei Radien, dazu rund (`9999px`) für Punkte und Abzeichen.
**Andere Größen gibt es nicht.** Eine Zwischengröße sieht man nicht, aber man sieht,
dass nichts zusammenpasst.

| Token | Wert | Rolle |
|---|---|---|
| `--suite-text-xs` | .8125rem (13 px) | Datum, Kleingedrucktes |
| `--suite-text-sm` | .9375rem (15 px) | Navigation, Beschriftung |
| `--suite-text-base` | 1.0625rem (17 px) | Fließtext |
| `--suite-text-lg` | clamp(1.125rem, 1.6vw, 1.3125rem) | Einleitung, Kartentitel |
| `--suite-text-xl` | clamp(1.375rem, 2.2vw, 1.75rem) | Karten- und Seitenkopf |
| `--suite-text-section` | clamp(2.25rem, 5.2vw, 3.75rem) | h2 der Abschnitte |
| `--suite-text-display` | clamp(2.75rem, 6.5vw, 4.5rem) | h1 |

Die Werte stehen in `homepage/resources/css/basis.css` und in `TokenSatz::SKALA`
(Designzentrale), jede Anwendung trägt sie als Rückfall in ihrer `app.css`. Der
erzeugte `SuiteTokensTest` hält das fest (`scripts/token-test.mjs`, keine Änderung
nötig: die Tokens stehen nur im hellen Block und werden dort geprüft).

**`--suite-muted` niemals für Fließtext.** Es erreicht auf `--suite-canvas` nur
4,43:1 und verfehlt WCAG AA. Dafür ist `--suite-muted-strong` da (7,05:1).

## Symbole

Eigener Satz, 40 Stück, über `<Symbol name="…" />` — in Laravel als
`<x-symbol name="…" />`, in Vue als `<Symbol name="…" />`. Alle drei entstehen
aus derselben Zeichnung in `src/icons/pfade.ts`; von Hand geändert wird keine
davon. **Keine fremden Icon-Sets
dazuholen** — kein Heroicons, kein Lucide, keine Symbolschrift, kein CDN.
Fehlt ein Symbol, ist das eine Lücke im Satz und keine Einladung zum Mischen.

Namen sind deutsch: `plus` `minus` `haken` `kreuz` `stift` `papierkorb` `lupe`
`regler` `mischen` `lautsprecher` · `winkel-oben` `winkel-unten` `winkel-links`
`winkel-rechts` `pfeil-links` `pfeil-rechts` `herunterladen` `hochladen` ·
`blatt` `mappe` `buch` `kalender` `uhr` `saeulen` `liste` `baustein`
`pruefblatt` `ziel` · `kasten` `warnung` `hinweis` `schloss` `auge` `auge-zu` ·
`haus` `person` `abmelden` `sonne` `mond` `menue`

`groesse` ist 20 als Standard (ruhig neben Fließtext), 24 neben Überschriften
und **14 in dichten Rastern** — Tabellenzellen, Stundenplan, Listenzeilen, also
überall dort, wo der Text selbst schon auf `.75rem` steht. Ein 20er Zeichen
neben `text-xs` sprengt die Zeile; das ist der einzige Grund für diese Stufe.
Keine weiteren Zwischenwerte: drei Größen sind eine Skala, fünf sind Zufall.

Die Symbole laufen auf `currentColor` und stimmen dadurch in hell wie dunkel
ohne Zutun.

`titel` **nur** setzen, wenn das Symbol allein steht — dann ist es der
zugängliche Name. Steht Text daneben, weglassen: sonst liest ein Screenreader
alles doppelt.

```jsx
<Button href="/neu"><Symbol name="plus" /> Eintrag anlegen</Button>
<p><Symbol name="kalender" /> Nächster Termin am 3. September</p>
<button aria-label={undefined}><Symbol name="kreuz" titel="Schließen" /></button>
```

## Die Regeln

1. **Genau ein Akzent.** Keine zweite Signalfarbe, keine fremden Markenfarben.
   Ausnahme sind Farben mit fachlicher *Bedeutung* — Einnahmen vs. Ausgaben,
   Ampelzustände. Die sind Information, nicht Gestaltung.
2. **Eine Lichtquelle.** Erhabene Flächen nutzen `--suite-shadow`, nie einen
   eigenen `box-shadow`.
3. **Zustand steckt im Text, nicht in `opacity`.** „in Arbeit" schreiben statt
   abdunkeln — Abdunkeln verfehlt den Kontrast und ist für Screenreader
   unsichtbar.
4. **`rem` statt `px`**, damit die Schriftgröße des Nutzers gilt.
5. **Weißraum:** Abstand zwischen Sektionen ≈ 3 × Innenabstand. Zeilenlänge
   höchstens 65ch. Das ist die wirksamste Regel gegen „wirkt generisch".
6. **Übergänge 160ms `ease`.**

## Bewusst verboten

Die generische SaaS-Vorlage: Hero links / Dashboard-Mockup rechts, 3er-Feature-
Grid mit durchnummerierten Kacheln, vollständig runde Pill-Buttons (hier
`.625rem`), erfundene Screenshots, Fortschrittsbalken die eine Genauigkeit
vortäuschen. Inhalte werden **gestapelt** dargestellt — Problem, Lösung, Stand
als Fließtext, siehe `ProjectBlock`.

## Beispiel

```jsx
<section style={{ padding: 'var(--space-section) 0' }}>
  <Eyebrow>Projekte</Eyebrow>
  <h2 style={{ color: 'var(--suite-ink)', letterSpacing: '-.025em' }}>
    Woran ich arbeite
  </h2>
  <p style={{ color: 'var(--suite-muted-strong)', maxWidth: '65ch' }}>
    Kurzer, ruhiger Einleitungssatz.
  </p>

  <ProjectBlock
    title="School Organizer"
    status={<Status state="live">Im Einsatz</Status>}
    stack="Laravel · Blade · Tailwind"
    entries={[{ term: 'Problem', description: 'Drei getrennte Systeme.' }]}
  />

  <Actions>
    <Button href="/projekte">Alle Projekte</Button>
    <Button href="/kontakt" variant="secondary">Kontakt</Button>
  </Actions>
</section>
```

## Wo die Wahrheit steht

`styles.css` und die davon eingebundenen Dateien sind die echten Stylesheets der
Homepage, nicht eine Zusammenfassung. Vor eigenem Styling dort nachsehen. Pro
Komponente steht die API in `<Name>.d.ts` und die Verwendung in
`<Name>.prompt.md`.
