# Erklärvideo

Macht aus einem Drehbuch einen fertigen Film: echte Bildschirmaufnahme der
Anwendung, zwei Stimmen im Gespräch darüber, Titeltafeln davor und dahinter.

**Anlass:** Marco wollte eine Erklärreihe zu seinen Projekten, im Stil der
Audio-Zusammenfassungen von Googles NotebookLM. Eine Suche auf GitHub nach
einem fertigen Skill dafür ergab nichts: In den bekannten Sammlungen
(`awesome-claude-skills`, `claude-skills-collection`) gibt es Skills zum
*Herunterladen* von Videos, zum Hochladen zu YouTube und TikTok, und einen
Eintrag `video-editing-helper`, der ausdrücklich als **„Community-needed"**
markiert ist — also gewünscht, aber nicht vorhanden.

Die Werkzeuge lagen dagegen längst auf dem Rechner: Playwright kann
aufnehmen, ffmpeg kann schneiden, macOS kann sprechen.

## Warum ein Gespräch und keine Erzählstimme

Eine Stimme, die fünf Minuten durchspricht, klingt nach Bedienungsanleitung.
Zwei, die sich gegenseitig fragen und antworten, tragen dieselbe Erklärung
deutlich weiter. Das ist der ganze Trick, den NotebookLM anwendet — und er
kostet hier nichts außer einer zweiten Stimme aus derselben Liste.

Zwischen den Wortbeiträgen liegen 0,35 Sekunden Pause. Ohne sie fallen sich
die Stimmen ins Wort, und es klingt wie eine einzige, die die Tonlage
wechselt.

## Nichts verlässt den Rechner

Kein Dienst, kein Konto, kein Hochladen — dieselbe Grenze wie überall in
dieser Suite. Der Preis dafür ist die Stimme: `say` klingt nach Vorlesen, nicht
nach Podcast.

**Wer das nicht will, spricht selbst.** Liegt neben dem Drehbuch ein Ordner
`stimme/` mit `01.m4a`, `02.m4a` und so weiter, nimmt der Bau diese Dateien
statt der erzeugten. Der Rest bleibt gleich.

## Aufruf

```bash
node bauen.mjs drehbuch.json [zielordner]
```

Braucht `ffmpeg`, `ffprobe`, `say` (macOS) und `playwright`.

## Drehbuch

```json
{
  "titel": "School Organizer",
  "untertitel": "Stundenplan, Noten und Berichtsheft an einem Ort",
  "datei": "school-organizer",
  "basis": "http://127.0.0.1:8000",
  "schema": "light",
  "stimmen": ["Sandy", "Reed"],
  "tempo": 180,

  "anmelden": {
    "pfad": "/login",
    "felder": { "input[type=email]": "beispiel@example.test", "input[type=password]": "…" },
    "knopf": "button[type=submit]"
  },

  "szenen": [
    {
      "pfad": "/dashboard",
      "schritte": [{ "scrollen": 400 }, { "zeigeAuf": ".stundenplan" }],
      "dialog": [
        { "s": 0, "text": "Das ist die Übersicht." },
        { "s": 1, "text": "Und was steht da als Erstes?" },
        { "s": 0, "text": "Was heute ansteht — Stunden, Termine, offene Aufgaben." }
      ]
    }
  ]
}
```

**Szenenfelder:** `pfad`, `dialog` (oder `text` für eine Stimme), `schritte`,
`schema`, `ohneAnmeldung`.

**Schritte:** `scrollen` (Pixel), `zeigeAuf` (Auswahlausdruck — der Zeiger
fährt hin), `klicke`.

Die Schritte werden gleichmäßig über die Sprechzeit verteilt. So kommt die
Bewegung dort an, wo der Text sie erwähnt.

## Die Länge macht der Ton, nicht die Schätzung

Erst wird gesprochen, dann gemessen, dann so lange aufgenommen. Eine geratene
Szenendauer führt sonst dazu, dass die Stimme ins Schwarze redet oder das Bild
stillsteht, während noch gesprochen wird.

## Zwei Fallen, in die dieser Bau schon getreten ist

**`drawtext` gibt es nicht überall.** Der ffmpeg aus Homebrew ist ohne
`libfreetype` gebaut — `ffmpeg -filters | grep drawtext` findet nichts, und
jede Titeltafel scheitert mit „No such filter". Die Tafeln entstehen deshalb
im Browser und werden als Bild eingebunden. Nebenwirkung: Schrift und Farben
kommen aus demselben Stylesheet wie die Seite daneben.

**Playwright schreibt das Video erst beim Schließen des Kontexts.** Wer die
Datei vorher sucht, findet nichts. Deshalb `kontext.close()` vor dem
Einsammeln, nicht danach.

## Was hier nicht hineingehört

**Keine echten Daten.** Die Anwendungen enthalten Noten, Unterrichtsinhalte
und Kontobewegungen. In einen Film gehören ausschließlich erfundene
Demo-Bestände — dieselbe Grenze wie bei den Bildschirmfotos der Portfolioseite
(MAR-34).

**Keine nachgestellten Oberflächen.** Aufgenommen wird die laufende Anwendung.
Ein gezeichnetes Dashboard wäre eine Behauptung, kein Beleg (MAR-192).
