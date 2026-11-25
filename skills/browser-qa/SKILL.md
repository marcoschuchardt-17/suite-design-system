---
name: browser-qa
description: >
  Prüft eine laufende Weboberfläche in einem echten Browser über drei Breakpoints
  (1440/768/390) in hell und dunkel. Meldet Konsolenfehler, 4xx/5xx-Anfragen,
  waagerechten Überlauf, Kontrastverstöße nach WCAG-Berechnung, Eingabefelder ohne
  Label, Sprünge in der Überschriftenstruktur, unterdrückte Fokusrahmen und
  hängengebliebene Skeletons. Einzusetzen, bevor etwas deployt wird, nach einem
  Redesign und wenn eine Seite „auf dem Handy komisch aussieht". Auslöser: „QA",
  „Browser prüfen", „responsive testen", „Kontrast prüfen", „vor dem Deploy".
---

# Browser-QA

Ein Designsystem, das nur als Dokument existiert, wird nicht eingehalten. Diese
Skill misst, statt anzunehmen — in einem echten Browser, mit echtem Layout.

## Aufruf

```bash
node skills/browser-qa/pruefen.mjs http://127.0.0.1:8000 / /notizen /reisen
```

Erstes Argument ist die Adresse, danach die Pfade. Ohne Pfade wird nur `/`
geprüft. Der Befehl endet mit Fehlercode, sobald etwas gefunden wird — damit
lässt er sich in einen Deploy-Schritt hängen.

Angemeldete Seiten: `QA_STATE` zeigt auf einen Playwright-`storageState` einer lokalen
Testanmeldung (z. B. nach einem Login-Skript mit `context.storageState({ path })`):

```bash
QA_STATE=state.json node skills/browser-qa/pruefen.mjs http://127.0.0.1:8000 / /einstellungen
```

Selbsttest nach jeder Änderung am Skript (Seite mit bekannten Kontrasten, siehe `selbsttest.html`):

```bash
node skills/browser-qa/selbsttest.mjs
```

Voraussetzung ist Playwright:

```bash
npm install playwright && npx playwright install chromium
```

## Was geprüft wird

| Prüfung | Warum |
|---|---|
| **Kontrast** | Nach WCAG 2.x gerechnet, nicht geschätzt. 4,5:1 für Fließtext, 3:1 ab 24 px oder ab 18,66 px fett. Rechnet gegen die tatsächlich sichtbare Hintergrundfarbe: Jedes Farbformat (auch `oklch()` aus Tailwind 4) rechnet der Browser selbst nach sRGB um, halb durchsichtige Ebenen werden über die darunterliegenden verrechnet. |
| **Waagerechter Überlauf** | Die Seite schiebt sich zur Seite. Klassiker bei 390 px: Tabellen, lange Adressen, feste Breiten in px. |
| **Konsolenfehler** | Ein `Uncaught TypeError` bedeutet, dass ein Teil der Seite nicht funktioniert — oft unsichtbar. |
| **4xx/5xx-Anfragen** | Fehlende Bilder, Schriften, Stylesheets. Ein 404 auf eine Schrift fällt optisch kaum auf und kostet trotzdem. |
| **Mixed Content** | Wird gesondert gemeldet. Hinter einem Reverse Proxy die häufigste Ursache dafür, dass eine Seite lokal stimmt und deployt kaputt ist — siehe unten. |
| **Eingabefelder ohne Label** | Ein Feld ohne `<label>`, `aria-label` oder `aria-labelledby` ist für Vorleseprogramme namenlos. |
| **Überschriftenstruktur** | Genau eine `h1`, keine übersprungenen Stufen. |
| **`outline: none`** | Ohne Ersatz durch `:focus-visible` verschwindet die Tastaturbedienung. |
| **Hängende Skeletons** | Ein Ladeplatzhalter, der nach dem Laden noch dasteht, heißt: Der Inhalt kam nie. |
| **Bilder ohne `alt`** | Vorleseprogramme lesen sonst den Dateinamen vor. |
| **Verweise ohne Namen** | Ein Verweis, der nur ein Symbol enthält, braucht `aria-label`. |
| **`target="_blank"` ohne `rel="noopener"`** | Das Ziel kann sonst auf das öffnende Fenster zugreifen. |
| **Tippziele unter 24 × 24** | WCAG 2.5.8. Verweise im Fließtext sind ausgenommen — die Prüfung fragt, ob neben dem Verweis noch Text steht, statt gegen eine Tagliste zu prüfen. |

Jede Prüfung läuft in **sechs Kombinationen**: 1440, 768 und 390 Pixel, jeweils
hell und dunkel.

## Mixed Content hinter dem Reverse Proxy

Eigener Abschnitt, weil es genau einmal passiert ist und dann schwer zu finden
war — MAR-189.

Hinter Traefik kommt die Anfrage intern per `http` an; dass der Besucher `https`
gesprochen hat, steht nur in den `X-Forwarded-*`-Kopfzeilen. Ohne
`trustProxies` baut Laravel daraus `http`-Adressen für Stylesheets und
Schriften, und der Browser blockiert sie als Mixed Content. Lokal ist davon
nichts zu sehen, weil dort ohnehin `http` läuft.

Erkennbar ist es an blockierten Anfragen in der Konsole und daran, dass die
Seite unformatiert erscheint. Diese Skill meldet solche Anfragen gesondert.

## Reihenfolge

`browser-qa` läuft **am Ende**, nicht zwischendurch. Kontraste und Überläufe
beurteilt man an einem fertigen Abschnitt; an einem halben Umbau meldet die
Prüfung Dinge, die ohnehin gleich wieder anders sind.

Bei einem Redesign nach `design-taste` heißt das: erst eine Sektion vollständig
umbauen, abnehmen lassen, dann messen.

## Was sie nicht leistet

* **Kein Urteil über Gestaltung.** Sie misst, ob etwas den Anforderungen
  genügt, nicht ob es gut aussieht. Dafür ist `design-taste` da.
* **Keine Prüfung ohne laufende Anwendung.** Sie braucht eine erreichbare
  Adresse, keinen Quelltext.
* **Kein Ersatz für Ansehen.** Sie findet, was messbar ist. Ob ein Bild an die
  falsche Stelle rutscht oder ein Text unglücklich umbricht, sieht nur ein
  Mensch.

## Bezug

MAR-214 (diese Werkzeugebene), MAR-189 (Mixed Content), MAR-253 (der Befund,
dass die Skills nirgends installiert waren). Eine an die Homepage angepasste
Fassung liegt dort als `tools/browser-qa.mjs` und läuft über `npm run qa`.
