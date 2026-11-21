# Schriftpaare

Rund vierzig Paare, jedes mit einer Bewertung der **Deutsch-Tauglichkeit**.

## Warum Deutsch eine eigene Spalte bekommt

Die meisten Empfehlungslisten sind an englischen Texten geprüft. Deutsch stellt
drei Anforderungen, die dort nie auffallen:

1. **Komposita werden lang.** „Ausbildungsnachweis", „Berichtsheftvorlage",
   „Reichweitenmessung". Eine Schrift mit weiten Buchstabenabständen erzwingt
   Umbrüche mitten im Wort, und der Umbruch zerlegt dann den Sinn. Enge
   Laufweite und ein gutes `hyphens: auto` helfen; eine breite Displayschrift
   im Fließtext hilft nicht.
2. **Umlaute brauchen Platz.** Ä, Ö, Ü tragen Punkte über der Versalhöhe. Bei
   `line-height: 1.2` stoßen sie an die Zeile darüber. Für deutschen Fließtext
   ist 1,5 bis 1,7 die Untergrenze, nicht der Komfortwert.
3. **Das ß muss existieren.** Und es muss zur Schrift passen, nicht wie ein
   nachträglich eingesetztes Beta aussehen. Ebenso das große ẞ, falls
   Versalsatz vorkommt.

## Bewertung

* **sehr gut** — enge Laufweite, ausreichende Höhe über der Versalhöhe,
  gezeichnetes ß, vollständige Umlaute in allen Schnitten
* **gut** — brauchbar, mit Einschränkung in einem der drei Punkte
* **mit Vorsicht** — nur für Überschriften, nicht für Fließtext
* **ungeeignet** — fehlendes oder schlechtes ß, Umlautkollisionen

Alle genannten Schriften sind frei lizenziert (SIL Open Font License oder
Apache 2.0) und **selbst auszuliefern**. Kein Google-CDN — LG München I,
20.01.2022, Az. 3 O 17493/20.

---

## Grotesk allein

Ein Schriftschnitt trägt eine ganze Oberfläche, wenn er genug Schnitte hat.
Für Anwendungen fast immer die richtige Wahl.

| Schrift | Deutsch | Anmerkung |
|---|---|---|
| **Figtree** | sehr gut | Die Suite-Schrift. Enge Laufweite, kräftiges ß, Umlaute sitzen sauber. 300–900. |
| **Inter** | sehr gut | Für Oberflächen gezeichnet, große x-Höhe. Etwas neutral — sie sieht nach „App" aus, was oft gewollt ist. |
| **Source Sans 3** | sehr gut | Ruhiger als Inter, gut für lange deutsche Texte. |
| **Public Sans** | sehr gut | Aus dem US-Behördenumfeld, entsprechend sachlich und sehr gut lesbar. |
| **Atkinson Hyperlegible** | sehr gut | Auf Unterscheidbarkeit gezeichnet (I, l, 1). Erste Wahl, wenn Barrierearmut Vorrang hat. |
| **IBM Plex Sans** | sehr gut | Technisch, mit Charakter. Trägt Komposita gut. |
| **Work Sans** | gut | Schön in Überschriften, im Fließtext etwas weit. |
| **Manrope** | gut | Modern, aber weite Laufweite — bei langen Komposita aufpassen. |
| **Outfit** | mit Vorsicht | Geometrisch und sehr weit. Überschriften ja, Fließtext nein. |
| **Space Grotesk** | mit Vorsicht | Eigenwillig, das ß fällt aus dem Bild. |
| **Poppins** | ungeeignet | Kreisrunde Formen, extrem weit. Deutsche Komposita brechen unschön. Das häufigste Kennzeichen generischer KI-Seiten. |

## Grotesk + Serife

Der Klassiker für Seiten mit viel Lesetext: Grotesk für die Oberfläche,
Serife für den Fließtext.

| Paar | Deutsch | Anmerkung |
|---|---|---|
| **Figtree + Source Serif 4** | sehr gut | Das Paar der Homepage. Grotesk für Überschriften und Bedienelemente, Serife für Lesetext. Beide tragen Deutsch mühelos. |
| **Inter + Lora** | sehr gut | Lora hat eine kräftige Serife und ein gutes ß. |
| **IBM Plex Sans + IBM Plex Serif** | sehr gut | Aus einer Hand gezeichnet, passt daher immer. |
| **Public Sans + Bitter** | gut | Bitter ist schwer; für kurze Lesestrecken. |
| **Source Sans 3 + Source Serif 4** | sehr gut | Dieselbe Familie, unaufgeregt. |
| **Work Sans + Crimson Pro** | gut | Crimson Pro ist zierlich, braucht mindestens 1,1 rem. |
| **Manrope + Fraunces** | mit Vorsicht | Fraunces ist eine Displayschrift; nur für Überschriften. |
| **Inter + Newsreader** | gut | Zeitungsanmutung, gut für Notizen und Aufsätze. |
| **Figtree + Literata** | sehr gut | Literata ist fürs Lesen am Schirm gezeichnet. |
| **Karla + Zilla Slab** | gut | Kräftiger Kontrast, technische Anmutung. |

## Serife allein

Für Seiten, die nach Text aussehen sollen — Aufsätze, Dokumentation, Notizen.

| Schrift | Deutsch | Anmerkung |
|---|---|---|
| **Source Serif 4** | sehr gut | Ruhig, breite Sprachabdeckung. |
| **Literata** | sehr gut | Fürs Lesen am Schirm entworfen. |
| **Lora** | sehr gut | Etwas mehr Charakter, bleibt gut lesbar. |
| **Newsreader** | gut | Kräftiger Duktus, gute Kursive. |
| **Crimson Pro** | gut | Zierlich; ab 1,1 rem aufwärts. |
| **EB Garamond** | mit Vorsicht | Sehr klassisch, kleine x-Höhe. Am Schirm anstrengend. |
| **Playfair Display** | ungeeignet | Displayschrift. Im Fließtext unlesbar, und das ß ist schwach. |

## Feste Laufweite

Für Code, Zahlenkolonnen und Tabellen.

| Schrift | Deutsch | Anmerkung |
|---|---|---|
| **JetBrains Mono** | sehr gut | Große x-Höhe, klare Unterscheidung von 0/O und 1/l/I. |
| **IBM Plex Mono** | sehr gut | Passt zu Plex Sans. |
| **Source Code Pro** | sehr gut | Unauffällig, sehr gut lesbar. |
| **Fira Code** | gut | Ligaturen sind Geschmackssache; in Tabellen abschalten. |
| **Space Mono** | mit Vorsicht | Eigenwillig, nur für kurze Stellen. |

## Kombinationen, die auffallen sollen

Nur für Seiten, die einmal angesehen werden — nicht für Anwendungen.

| Paar | Deutsch | Anmerkung |
|---|---|---|
| **Bricolage Grotesque + Inter** | gut | Bricolage nur groß; darunter wird sie unruhig. |
| **Instrument Serif + Inter** | mit Vorsicht | Sehr schmale Serife, Umlaute werden eng. |
| **Syne + Work Sans** | mit Vorsicht | Syne ist ausgeprägt; ß und Umlaute vorher ansehen. |
| **Unbounded + Public Sans** | mit Vorsicht | Sehr breit, Komposita brechen. |
| **DM Serif Display + DM Sans** | gut | Aus einer Familie, dadurch stimmig. |

## Zahlen richtig setzen

Unabhängig von der Schrift: In Tabellen, Preisen und Zeitangaben gehört
`font-variant-numeric: tabular-nums`. Ohne das springen die Spalten, weil die
Ziffern unterschiedlich breit sind. Auf der Homepage steht das an den
Datumsangaben der Notizen.

## Auslieferung

```css
@font-face {
  font-family: Figtree;
  font-weight: 400;
  font-display: swap;                    /* Text sofort sichtbar */
  src: url('/fonts/figtree-400.woff2') format('woff2');
}
```

Nur `woff2` — jeder Browser, der zählt, kann es. Nur die Schnitte laden, die
wirklich vorkommen; jeder Schnitt kostet eine Anfrage und rund 11 kB. Die
wichtigsten zwei über `<link rel="preload" as="font" crossorigin>` vorziehen.

Die Lizenztexte gehören neben die Dateien. Die SIL Open Font License verlangt
das ausdrücklich.
