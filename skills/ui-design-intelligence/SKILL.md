---
name: ui-design-intelligence
description: >
  Leitet für ein NEUES Projekt Farbpalette, Schriftpaar, Gestaltungsstil und Skalen
  aus Domäne, Stimmung und gewünschter Dichte ab. Einzusetzen, wenn eine Oberfläche
  ohne bestehendes Designsystem entsteht oder wenn eine Farbwelt und ein Schriftpaar
  begründet gewählt werden sollen. Enthält neun ausgearbeitete Stile und rund vierzig
  Schriftpaare, jedes mit Bewertung der Deutsch-Tauglichkeit (lange Komposita, Umlaute,
  ß) und dem Hinweis auf lokale Auslieferung statt Google-CDN. Auslöser: „welche
  Farben", „welche Schrift", „Design für ein neues Projekt", „Font-Pairing", „Palette".
---

# Design-Entscheidungen ableiten

Farbe und Schrift sind für ein neues Projekt keine Geschmacksfrage, sondern eine
Ableitung aus drei Angaben: **Domäne**, **Stimmung**, **Dichte**. Diese Skill
macht die Ableitung nachvollziehbar, damit sie begründbar ist und nicht bei der
nächsten Laune wieder kippt.

## Erst prüfen: braucht es das überhaupt?

**Für alle Suite-Projekte lautet die Antwort nein.** School Organizer,
Lernen-App, Finanzkompass und Homepage haben ein Designsystem — `--suite-*`,
Figtree, ein Akzent. Wer dort eine neue Palette ableitet, driftet, und genau so
entstanden das grüne Finanzkompass und die violette Lernen-App.

Diese Skill ist für **neue Projekte außerhalb der Suite** oder für den Fall,
dass ein Projekt bewusst eine eigene Akzentfarbe bekommen soll — MAR-89 lässt
projektspezifische Akzente ausdrücklich zu, aber nur den Akzent, nicht die
ganze Welt.

## Die drei Eingaben

**Domäne.** Wofür ist die Anwendung? Verwaltung, Lernen, Geld, Gesundheit,
Freizeit. Sie bestimmt, wie viel Ernst die Farbwelt tragen muss.

**Stimmung.** Ruhig, wach, warm, sachlich, verspielt. Sie bestimmt Sättigung
und Kontrastumfang.

**Dichte.** Wie viel steht gleichzeitig auf dem Schirm? Ein Formular mit
vierzig Feldern verträgt andere Abstände als eine Portfolioseite mit sechs
Absätzen. Sie bestimmt die Abstands- und Schriftskala.

Fehlt eine der drei, wird sie erfragt und nicht geraten.

## Palette ableiten

Nicht mit einer Farbe anfangen, sondern mit der **Rampe**. Eine Rampe (etwa
Slate, Zinc, Stone) liefert Hintergrund, Fläche, Rahmen, Text und Sekundärtext
in abgestimmten Schritten. Erst danach kommt der Akzent dazu.

```
canvas          hellster Ton der Rampe, leicht gefärbt
surface         reines Weiß (hell) bzw. eine Stufe über canvas (dunkel)
surface-muted   eine Stufe unter surface
border          Stufe 200 der Rampe
ink             Stufe 900, für Haupttext
muted-strong    Stufe 600, für Sekundärtext — Kontrast prüfen!
accent          der eine Akzent
accent-strong   eine Stufe dunkler, für Zustände
accent-soft     die hellste Stufe des Akzents, für Flächen
```

**Jede Kombination nachrechnen, nicht schätzen.** Fließtext braucht 4,5:1,
große Schrift 3:1. Die Falle ist immer dieselbe: Stufe 500 einer Rampe sieht
auf Weiß gut aus und verfehlt die Anforderung knapp. In der Suite ist genau das
`--suite-muted` mit 4,43:1 — deshalb trägt dort `--suite-muted-strong` den Text.

Der Akzent gehört **nicht** in die Mitte der Rampe, sondern deutlich daneben:
Er soll auffallen, ohne zu schreien. Ein gesättigtes Indigo, Blau oder Grün auf
einer neutralen Rampe trägt weiter als eine bunte Rampe mit buntem Akzent.

## Schrift wählen

Details in `referenzen/schriftpaare.md`. Die drei Fragen davor:

1. **Braucht es überhaupt zwei Schriften?** Eine gute Grotesk mit echten
   Schnitten trägt eine ganze Oberfläche. Zwei Schriften sind eine Entscheidung
   für einen Kontrast, nicht für Abwechslung.
2. **Trägt sie Deutsch?** Das ist keine Kleinigkeit. Deutsche Komposita werden
   lang („Ausbildungsnachweis", „Berichtsheftvorlage"), und eine Schrift mit
   weiten Buchstabenabständen bricht dann an Stellen um, die den Sinn zerlegen.
   Umlaute brauchen Platz über der Versalhöhe; ein zu enger Zeilenabstand lässt
   Ä und Ü an die Zeile darüber stoßen. Und das ß muss es überhaupt geben —
   manche Displayschriften haben keins.
3. **Wird sie selbst ausgeliefert?** In der Suite ja, ohne Ausnahme. Google
   Fonts dynamisch einzubinden überträgt die IP jedes Besuchers an Google; das
   LG München I hat das am 20.01.2022 (Az. 3 O 17493/20) als
   DSGVO-Verstoß gewertet. Die Dateien gehören nach `public/fonts/`, die
   Lizenztexte daneben.

## Stil wählen

Neun ausgearbeitete Stile in `referenzen/stile.md`, jeweils mit dem, was sie
kosten — denn jeder Stil hat einen Preis, und der steht selten dabei.

Kurzfassung: **Für Anwendungen, die Menschen täglich benutzen, ist ruhige
Sachlichkeit fast immer richtig.** Glasflächen, Neumorphismus und Brutalismus
sind Stile für Seiten, die man einmal ansieht — nicht für ein Formular, das
jemand jeden Montag ausfüllt.

## Skalen

**Schrift**, Verhältnis 1,2 bei hoher Dichte, 1,25 bei niedriger:

```
0,82 · 0,92 · 1,00 · 1,15 · 1,4 · 1,8 · 2,4 rem
```

**Abstand**, verdoppelnd statt linear:

```
0,25 · 0,5 · 0,75 · 1 · 1,5 · 2 · 3 · 4,5 · 7 rem
```

Zwischen Abschnitten das Zwei- bis Dreifache des Abstands innerhalb eines
Abschnitts — dieselbe Regel wie in `design-taste`, und der häufigste Fehler
überhaupt.

**Radius**: höchstens zwei Werte, einer für Flächen, einer für Knöpfe. Drei
Radien sehen aus wie drei Entscheidungen.

## Ergebnis

Am Ende steht kein Bild, sondern eine Datei: `DESIGN-SYSTEM.md` mit Tokens,
Skalen, Schriftentscheidung samt Begründung und einem Abschnitt „Bewusst
verboten". Erst damit kann `design-taste` prüfen und `browser-qa` messen.

## Bezug

MAR-214, MAR-89. Für bestehende Suite-Projekte gilt `DESIGN-SYSTEM.md` im
School Organizer, nicht diese Skill.
