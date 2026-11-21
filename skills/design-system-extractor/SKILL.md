---
name: design-system-extractor
description: >
  Zieht aus einer Referenzseite die tatsächlich verwendeten Gestaltungswerte — Farben,
  Schriften, Abstände, Radien, Schatten — und verdichtet sie zu einer DESIGN-SYSTEM.md
  mit semantischen Tokens, Layoutregeln, Komponenten-Anatomie und einem Abschnitt
  „Bewusst verboten". Gibt zusätzlich tokens.css und tailwind.config.js aus.
  Einzusetzen, wenn ein Projekt kein Designsystem hat, wenn eine bestehende Oberfläche
  dokumentiert werden soll oder wenn im Stil einer Referenz gebaut wird. Auslöser:
  „Designsystem erzeugen", „Tokens extrahieren", „im Stil von … bauen",
  „DESIGN-SYSTEM.md".
---

# Designsystem aus einer Seite ziehen

Ein Designsystem, das jemand aufschreibt, ist eine Absicht. Ein Designsystem,
das aus den tatsächlich gerenderten Werten entsteht, ist eine Beschreibung. Der
Unterschied fällt auf, sobald beide auseinanderlaufen — und das tun sie immer.

## Aufruf

```bash
node skills/design-system-extractor/ziehen.mjs https://beispiel.de / /unterseite
```

Ergebnis in `design-system-ausgabe/`:

```
raw-tokens.json        alles, was gemessen wurde, ungefiltert
DESIGN-SYSTEM.md       verdichtet und benannt
tokens.css             die Tokens als :root-Block
tailwind.config.js     dieselben Werte für Tailwind
```

**`raw-tokens.json` bleibt liegen.** Die Verdichtung wirft Dinge weg, und beim
zweiten Hinsehen ist manchmal genau das interessant, was weggeworfen wurde.

## Der Ablauf

**1. Messen.** Playwright öffnet die Seiten und liest die *computed styles*
jedes sichtbaren Elements — nicht das Stylesheet. Was im Stylesheet steht, ist
Absicht; was gerendert wird, ist Wirklichkeit. Kaskade, Spezifität und
Medienabfragen sind darin schon aufgelöst.

**2. Zählen.** Jeder Wert bekommt eine Häufigkeit. Eine Farbe, die zwölfmal
vorkommt, ist eine Entscheidung; eine, die einmal vorkommt, ist ein Ausrutscher.

**3. Rampen erkennen.** Farben werden nach Ton sortiert und zu Rampen
gruppiert. Aus achtzehn gemessenen Grautönen werden fünf benannte Stufen — der
Rest sind Zwischenwerte, die niemand vermisst.

**4. Benennen.** Aus Häufigkeit und Verwendungsort werden semantische Namen:
Der Ton, der auf `<body>` liegt, wird `canvas`. Der, der auf Karten liegt,
`surface`. Der häufigste Ton auf `<p>` wird `ink`.

**5. Prüfen.** Jede Text-auf-Hintergrund-Kombination wird nachgerechnet.
Verfehlt eine die Anforderung, steht sie mit Wert und Warnung in der Ausgabe —
so ist `--suite-muted` mit 4,43:1 dokumentiert und nicht stillschweigend
übernommen worden.

**6. Verdichten.** Abstände werden auf eine Skala gerundet, Radien auf
höchstens zwei Werte, Schatten auf eine Lichtquelle.

## Der Abschnitt „Bewusst verboten"

Der wichtigste Teil der Ausgabe, und der einzige, der nicht gemessen werden
kann.

Ein Designsystem, das nur sagt, was erlaubt ist, verhindert den Rückfall in
Voreinstellungen nicht. Wer nicht weiß, dass ein zweiter Akzent verboten ist,
fügt ihn hinzu, wenn er gerade praktisch erscheint. Der Abschnitt benennt
deshalb ausdrücklich:

* welche Farben es **nicht** gibt (kein zweiter Akzent, keine Signalfarben
  neben dem Akzent)
* welche Formen es **nicht** gibt (keine dritte Radiusstufe, keine Pillen)
* welche Effekte verboten sind (keine Verläufe als tragendes Element, keine
  Schatten aus zwei Richtungen)
* was nie eingebunden wird (keine Symbolschrift, kein CDN, keine
  Komponentenbibliothek von außen)

Vorbefüllt wird er aus dem, was **nicht** gemessen wurde: Kommt in der Referenz
kein Verlauf vor, steht „keine Verläufe" in der Liste. Danach gehört er von
Hand durchgesehen — er ist eine Entscheidung, keine Messung.

## Grenzen

* **Eine schlecht gestaltete Referenz ergibt ein schlecht gestaltetes System.**
  Der Extraktor beschreibt, er verbessert nicht. Was er misst, ist so gut wie
  die Vorlage.
* **Dynamische Zustände fehlen.** Hover, Fokus und gedrückte Zustände werden
  nicht gemessen; sie brauchen Interaktion. Sie gehören von Hand ergänzt.
* **Fremde Seiten sind fremdes Eigentum.** Werte zu messen, um zu verstehen,
  wie eine Seite aufgebaut ist, ist etwas anderes, als eine Gestaltung zu
  übernehmen. Für eine eigene Oberfläche im fremden Look ist das eine Frage,
  die vor dem Werkzeug kommt, nicht danach.

## Für die Suite

Hier ist die Reihenfolge umgekehrt: `DESIGN-SYSTEM.md` existiert bereits und
gilt, `homepage/resources/css/basis.css` ist die kanonische Quelle. Der
Extraktor dient dort zur **Gegenprobe** — was die Seite tatsächlich rendert
gegen das, was das Dokument behauptet.

Die Driftprüfung in `homepage/tests/Feature/SuiteTokensTest.php` macht das
fortlaufend und ohne Browser; der Extraktor ist die gründlichere Fassung für
den Einzelfall.

## Bezug

MAR-214 (diese Werkzeugebene), MAR-89 (das Designsystem selbst), MAR-253 (der
Befund, dass die Skills nirgends installiert waren).
