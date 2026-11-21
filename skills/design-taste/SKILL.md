---
name: design-taste
description: >
  Diagnose und Redesign von Oberflächen, die nach generischem KI-Design aussehen.
  Einzusetzen, wenn eine Seite „irgendwie nach Mustervorlage" wirkt, bevor eine neue
  Oberfläche gebaut wird, oder wenn ein Entwurf abgenommen werden soll. Prüft gegen
  zwölf benannte Symptome und fünf harte Regeln; führt ein Redesign abschnittsweise
  statt in einem Rutsch. Für die Suite-Projekte (Laravel, Blade, Tailwind) und die
  Homepage. Auslöser sind auch: „wirkt generisch", „sieht nach ChatGPT-Seite aus",
  „Redesign", „Design abnehmen", „warum sieht das billig aus".
---

# Design-Geschmack

Claude Code programmiert stark und fällt beim Front-End auf Voreinstellungen
zurück. Das Ergebnis ist nicht falsch — es ist austauschbar. Diese Skill macht
den Unterschied benennbar, damit er behebbar wird.

**Anlass:** MAR-192. Die Finanzkompass-Landingpage wirkte wie eine generische
SaaS-Mustervorlage, obwohl ein Designsystem vorhanden war. Ein Designsystem als
Dokument reicht nicht; es braucht eine Ebene, die es beim Bauen durchsetzt.

## Zuerst: die Quelle der Wahrheit lesen

Bevor irgendetwas beurteilt wird, `DESIGN-SYSTEM.md` aus dem School Organizer
lesen. Dort stehen Tokens, Typografie, Abstände und der Abschnitt „Bewusst
verboten". **Diese Skill erfindet keine Gestaltung — sie setzt die vorhandene
durch.**

Gibt es kein `DESIGN-SYSTEM.md`, ist `design-system-extractor` der erste
Schritt, nicht diese Skill.

## Die zwölf Symptome

Durchgehen, jedes mit ja oder nein beantworten. Fünf oder mehr Treffer heißen:
Es ist nicht Geschmackssache, es ist generisch.

| # | Symptom | Woran man es erkennt |
|---|---|---|
| 1 | **Mehr als ein Akzent** | Zwei bunte Knopffarben, ein dritter Ton für Hinweise. Eine Seite hat genau einen Akzent. |
| 2 | **Farbverlauf als Hauptgestaltung** | Lila-nach-Blau im Kopfbereich. Der Verlauf trägt die Seite, weil sonst nichts sie trägt. |
| 3 | **Drei Kacheln nebeneinander** | Immer drei, immer gleich hoch, oft mit Zahl oder Symbol oben. Warum drei? Weil das Raster drei war. |
| 4 | **Symbol ohne Aufgabe** | Ein Wolken-, Raketen- oder Zahnradsymbol über jeder Überschrift. Deckt man es zu, fehlt nichts. |
| 5 | **Ein Stil für mehrere Rollen** | Eyebrow, Tabellenkopf und Kartenüberschrift tragen dieselbe versale Sperrung. Dann trägt sie keine Bedeutung mehr. |
| 6 | **Gleichmäßiger Weißraum** | Zwischen Absatz und Absatz derselbe Abstand wie zwischen Abschnitt und Abschnitt. Es gibt keine Gliederung, nur Fluss. |
| 7 | **Schatten aus mehreren Richtungen** | Karten werfen nach unten, Knöpfe nach oben. Eine Seite hat eine Lichtquelle. |
| 8 | **Vollbreiter Fließtext** | Zeilen über 75 Zeichen. Das Auge findet den Zeilenanfang nicht wieder. |
| 9 | **Erfundene Bildschirmfotos** | Ein gezeichnetes Dashboard, das es nicht gibt. Ausdrücklich verboten, siehe MAR-192. |
| 10 | **Superlative statt Aussagen** | „Nahtlos", „mühelos", „leistungsstark". Wörter, die jede Seite über jedes Produkt sagen könnte. |
| 11 | **Abgerundete Pillen überall** | `border-radius: 9999px` an Knöpfen, Marken, Hinweisen. Eine Form für alles ist keine Form. |
| 12 | **Alles gleich laut** | Jede Überschrift fett, jede Fläche mit Rahmen und Schatten. Wenn alles betont ist, ist nichts betont. |

## Die fünf harten Regeln

Nicht verhandelbar, weil jede von ihnen eine Ursache hat und nicht bloß eine
Vorliebe ist.

1. **Genau ein Akzent.** `--suite-accent`, sonst keiner. Zustände (Hover,
   gedrückt) über `--suite-accent-strong`, Flächen über `--suite-accent-soft`.
   Ein zweiter bunter Ton nimmt dem ersten die Bedeutung.

2. **Hierarchie über Größe und Gewicht, nicht über Farbe.** Wer Wichtigkeit
   mit Farbe markiert, verliert sie bei Farbenblindheit und im Ausdruck. Größe
   und Gewicht überleben beides.

3. **Weißraum im Verhältnis 2 bis 3.** Der Abstand zwischen Abschnitten ist
   zwei- bis dreimal so groß wie der zwischen Absätzen. In der Suite:
   `--space-section` gegen `--space-inner`. Ist das Verhältnis kleiner als 2,
   sieht die Seite gedrängt aus; ist es größer als 4, zerfällt sie.

4. **Zeilenlänge höchstens 65 Zeichen.** `max-width: 65ch` am Fließtext. Bei
   einer zweispaltigen Anordnung gilt das je Spalte.

5. **Eine Lichtquelle.** Alle Schatten kommen von oben. In der Suite steht das
   fertig in `--suite-shadow` — eigene `box-shadow`-Werte sind ein Rückfall.

## Der Redesign-Ablauf

**Nicht alles auf einmal.** Wer eine ganze Seite umbaut, legt fünfzehn
Entscheidungen gleichzeitig vor; abgenommen wird dann nichts oder alles, und
beim Zurückrudern geht auch das Gute verloren.

1. **Diagnose schreiben.** Die zwölf Symptome durchgehen, Treffer benennen, je
   mit der Stelle im Code. Keine Änderung.
2. **Eine Sektion auswählen.** Die, die am meisten trägt — meist der Einstieg.
3. **Diese eine Sektion vollständig umbauen.** Vollständig heißt: Struktur,
   Typografie, Abstände, Farben, Zustände. Kein halber Umbau.
4. **Vorlegen und abnehmen lassen.** Mit Bildschirmfoto in hell und dunkel.
5. **Erst danach der Rest**, Sektion für Sektion, nach demselben Muster.
6. **`browser-qa` am Ende**, nicht zwischendurch. Kontraste und Überläufe
   beurteilt man am fertigen Abschnitt.

## Was diese Skill nicht tut

* **Keine neuen Farben, Schriften oder Abstände erfinden.** Dafür ist
  `ui-design-intelligence` da, und auch die nur für neue Projekte. Innerhalb
  der Suite gilt `DESIGN-SYSTEM.md`.
* **Keine Bibliothek dazuholen.** Kein Tailwind-Plugin, keine Komponenten von
  außen, kein Symbolsatz von einem CDN. Ein CDN ist bei jedem Seitenaufruf eine
  Verbindung zu einem Dritten — in der Suite eine Datenschutzfrage, nicht bloß
  eine Geschmacksfrage.
* **Keine erfundenen Oberflächen.** Weder als Bildschirmfoto noch als
  gezeichnetes Beispiel. MAR-192.

## Bezug

MAR-214 (diese Werkzeugebene), MAR-89 (das Designsystem selbst), MAR-192 (der
Anlass), MAR-253 (warum sie im Repository liegt und nicht bloß beschrieben ist).
