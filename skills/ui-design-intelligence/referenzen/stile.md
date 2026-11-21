# Neun Gestaltungsstile

Jeder Stil mit dem, was er kostet. Der Preis steht in Stil-Listen selten dabei
und entscheidet trotzdem, ob ein Stil zur Anwendung passt.

**Die kurze Antwort vorweg:** Für Anwendungen, die Menschen täglich benutzen,
ist Nummer 1 fast immer richtig. Die übrigen acht sind für Seiten, die man
einmal ansieht.

---

## 1. Ruhige Sachlichkeit

Neutrale Rampe, ein Akzent, großzügiger Weißraum, keine Verzierung. Hierarchie
entsteht durch Größe und Abstand.

**Wofür:** Anwendungen mit täglicher Benutzung. Formulare, Listen, Übersichten.
Der Suite-Stil.

**Preis:** Sie fällt nicht auf. Wer Aufmerksamkeit will, bekommt sie hier
nicht — sie ist auf Dauer gebaut, nicht auf den ersten Blick.

**Fallstrick:** Ohne sorgfältige Abstände wird daraus schnell „unfertig". Der
Weißraum trägt die ganze Gestaltung, also muss er stimmen.

---

## 2. Redaktioneller Stil

Serife im Fließtext, klare Spaltenbreite, große Überschriften, sparsame Farbe.
Anmutung einer gut gesetzten Zeitschrift.

**Wofür:** Notizen, Aufsätze, Dokumentation, Portfolioseiten.

**Preis:** Bedienelemente sind schwer unterzubringen. Ein Formular in einem
redaktionellen Layout sieht immer nach Fremdkörper aus.

**Fallstrick:** Zeilenlänge. Über 65 Zeichen kippt der Vorteil der Serife ins
Gegenteil.

---

## 3. Technische Anmutung

Feste Laufweite für Zahlen und Kennungen, enge Raster, sichtbare Linien,
gedämpfte Farben. Anmutung eines Werkzeugs.

**Wofür:** Entwicklerwerkzeuge, Überwachung, alles mit vielen Zahlen.

**Preis:** Wirkt auf Menschen ohne technischen Hintergrund abweisend.

**Fallstrick:** Feste Laufweite im Fließtext. Sie gehört an Zahlen und Code,
nicht an Sätze.

---

## 4. Weiche Flächen

Große Radien, sanfte Schatten, helle Pastelltöne, viel Luft.

**Wofür:** Anwendungen für den privaten Alltag — Haushalt, Gesundheit, Lernen.

**Preis:** Bei viel Inhalt auf einmal wird es unübersichtlich, weil weiche
Kanten schlechter trennen als Linien.

**Fallstrick:** Pastell und Kontrast vertragen sich schlecht. Jede Textfarbe
nachrechnen, sonst landet man bei 3,2:1 und merkt es nicht.

---

## 5. Hoher Kontrast

Schwarz auf Weiß, kräftige Linien, wenige große Flächen, ein greller Akzent.

**Wofür:** Portfolios, Ankündigungen, alles, was auffallen soll.

**Preis:** Anstrengend über längere Zeit. Für ein Formular, das jemand jeden
Montag ausfüllt, die falsche Wahl.

**Fallstrick:** Reines Schwarz auf reinem Weiß flimmert. `#14213d` auf
`#f4f7fb` liest sich ruhiger und erreicht immer noch 14,9:1.

---

## 6. Glasflächen

Halbdurchsichtige Flächen mit `backdrop-filter`, farbiger Hintergrund
darunter.

**Wofür:** Einstiegsseiten, Übergänge, Bildschirmschoner-Ästhetik.

**Preis:** Hoch. `backdrop-filter` kostet Rechenleistung und ruckelt auf
schwachen Geräten. Und der Text steht auf einem Hintergrund, den man nicht
kennt — Kontrast lässt sich nicht garantieren.

**Fallstrick:** Genau dieser Kontrast. Wer Glasflächen will, braucht darunter
eine gedeckte Fläche, sonst ist die Barrierefreiheit nicht haltbar.

---

## 7. Neumorphismus

Flächen, die aus dem Hintergrund herausgedrückt wirken, mit zwei Schatten in
entgegengesetzten Richtungen.

**Wofür:** Ehrlich: für Studien.

**Preis:** Sehr hoch. Der Effekt lebt von minimalen Kontrasten — genau dem, was
Barrierefreiheit verbietet. Knöpfe sind nicht als Knöpfe erkennbar.

**Fallstrick:** Er verletzt die Ein-Lichtquellen-Regel bauartbedingt. Für
Anwendungen nicht verwendbar.

---

## 8. Brutalismus

Systemschriften, sichtbare Raster, harte Kanten, kein Schatten, ungebrochene
Farben.

**Wofür:** Seiten, die Haltung zeigen wollen. Blogs, Manifeste.

**Preis:** Wird als „kaputt" gelesen, wenn der Rahmen es nicht klarmacht. In
einer Anwendung, die Vertrauen braucht — Geld, Gesundheit, Ausbildung —
schadet er.

**Fallstrick:** Ohne handwerkliche Sorgfalt sieht Brutalismus nicht mutig aus,
sondern unfertig. Er ist schwerer als er aussieht.

---

## 9. Aurora und Verläufe

Weiche Farbverläufe im Hintergrund, oft mehrfarbig, als tragendes Element.

**Wofür:** Einstiegsbereiche, einzelne Flächen.

**Preis:** Der häufigste Stil generischer KI-Seiten. Symptom 2 in
`design-taste`. Er trägt die Seite, weil sonst nichts sie trägt.

**Fallstrick:** Text auf einem Verlauf hat je nach Stelle einen anderen
Kontrast. Wenn überhaupt, dann sehr gedämpft und nie unter Fließtext — die
Homepage macht das mit `--suite-glow`, einem kaum sichtbaren Schimmer.

---

## Auswahl in drei Fragen

1. **Wie oft sieht jemand diese Seite?** Täglich → 1, 3 oder 4. Einmal → alles
   andere möglich.
2. **Wie viel steht gleichzeitig auf dem Schirm?** Viel → 1 oder 3. Wenig → 2,
   4 oder 5.
3. **Muss die Seite Vertrauen tragen?** Ja → 1, 2 oder 3. Geld, Gesundheit und
   Ausbildung vertragen keine Experimente.

Bei Uneinigkeit gewinnt Nummer 1. Eine ruhige Oberfläche hat noch nie jemanden
gestört; eine auffällige schon.
