/*
 * Zieht die tatsaechlich gerenderten Gestaltungswerte einer Seite.
 *
 *   node ziehen.mjs <adresse> [pfad ...]
 *
 * Ergebnis in design-system-ausgabe/: raw-tokens.json, DESIGN-SYSTEM.md,
 * tokens.css, tailwind.config.js.
 *
 * Gelesen werden computed styles, nicht Stylesheets: Was im Stylesheet steht,
 * ist Absicht; was gerendert wird, ist Wirklichkeit. Kaskade, Spezifitaet und
 * Medienabfragen sind darin bereits aufgeloest.
 *
 * Gehoert zur Skill design-system-extractor (MAR-214).
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [adresse, ...pfade] = process.argv.slice(2);

if (!adresse) {
  console.error('Aufruf: node ziehen.mjs <adresse> [pfad ...]');
  process.exit(2);
}

const SEITEN = pfade.length ? pfade : ['/'];
const AUSGABE = resolve('design-system-ausgabe');

// ---------------------------------------------------------------- im Browser

const messen = () => {
  const zaehle = (karte, wert, wo) => {
    if (!wert) return;
    const e = karte[wert] ?? (karte[wert] = { anzahl: 0, orte: [] });
    e.anzahl++;
    if (e.orte.length < 6 && !e.orte.includes(wo)) e.orte.push(wo);
  };

  const farben = {};
  const hintergruende = {};
  const schriften = {};
  const groessen = {};
  const gewichte = {};
  const zeilenhoehen = {};
  const radien = {};
  const schatten = {};
  const abstaende = {};

  const sichtbar = (el) => {
    const r = el.getBoundingClientRect();
    const st = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none';
  };

  document.querySelectorAll('body *').forEach((el) => {
    if (!sichtbar(el)) return;

    const st = getComputedStyle(el);
    const wo = el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '');

    // Textfarbe nur zaehlen, wo wirklich Text steht — sonst erbt jedes <div>
    // eine Farbe, die es gar nicht zeigt.
    if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
      zaehle(farben, st.color, wo);
      zaehle(schriften, st.fontFamily, wo);
      zaehle(groessen, st.fontSize, wo);
      zaehle(gewichte, st.fontWeight, wo);
      zaehle(zeilenhoehen, st.lineHeight, wo);
    }

    if (st.backgroundColor && !st.backgroundColor.startsWith('rgba(0, 0, 0, 0)'))
      zaehle(hintergruende, st.backgroundColor, wo);

    if (st.borderRadius && st.borderRadius !== '0px') zaehle(radien, st.borderRadius, wo);
    if (st.boxShadow && st.boxShadow !== 'none') zaehle(schatten, st.boxShadow, wo);

    ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'].forEach((k) => {
      const v = st[k];
      if (v && v !== '0px') zaehle(abstaende, v, wo);
    });
  });

  return {
    farben, hintergruende, schriften, groessen, gewichte,
    zeilenhoehen, radien, schatten, abstaende,
    seitenhintergrund: getComputedStyle(document.body).backgroundColor,
    grundschrift: getComputedStyle(document.body).fontFamily,
  };
};

// ------------------------------------------------------------- Auswertung

const zuHex = (rgb) => {
  const [r, g, b] = (rgb.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  if ([r, g, b].some((v) => v === undefined)) return null;
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
};

const helligkeit = (hex) => {
  const h = hex.replace('#', '');
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const kontrast = (a, b) => {
  const [x, y] = [helligkeit(a), helligkeit(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/* Nach Haeufigkeit sortiert. Ein Wert, der zwoelfmal vorkommt, ist eine
   Entscheidung; einer, der einmal vorkommt, ist ein Ausrutscher. */
const haeufigste = (karte, n) =>
  Object.entries(karte)
    .sort((a, b) => b[1].anzahl - a[1].anzahl)
    .slice(0, n)
    .map(([wert, e]) => ({ wert, ...e }));

const zusammenfuehren = (ziel, quelle) => {
  for (const [gruppe, karte] of Object.entries(quelle)) {
    if (typeof karte !== 'object' || karte === null) continue;
    ziel[gruppe] ??= {};
    for (const [wert, e] of Object.entries(karte)) {
      const z = ziel[gruppe][wert] ?? (ziel[gruppe][wert] = { anzahl: 0, orte: [] });
      z.anzahl += e.anzahl;
      e.orte.forEach((o) => z.orte.length < 6 && !z.orte.includes(o) && z.orte.push(o));
    }
  }
};

// ------------------------------------------------------------------ Ablauf

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const roh = {};
let seitenhintergrund = '';
let grundschrift = '';

for (const pfad of SEITEN) {
  await seite.goto(adresse.replace(/\/$/, '') + pfad, { waitUntil: 'networkidle' });
  await seite.evaluate(() => document.fonts.ready);
  const teil = await seite.evaluate(messen);
  seitenhintergrund ||= teil.seitenhintergrund;
  grundschrift ||= teil.grundschrift;
  zusammenfuehren(roh, teil);
  console.log(`  gemessen: ${pfad}`);
}

await browser.close();

mkdirSync(AUSGABE, { recursive: true });
writeFileSync(`${AUSGABE}/raw-tokens.json`, JSON.stringify(roh, null, 2));

/* ---- Benennen.
 *
 * Die erste Fassung nahm schlicht die haeufigsten Werte der Reihe nach. Das
 * Ergebnis war unbrauchbar: Die haeufigste Nicht-canvas-Flaeche ist die
 * Knopffarbe, nicht die Kartenflaeche, und "bunt" als max minus min ueber 40
 * haelt ein dunkles Navy (#14213d, Abstand 41) fuer den Akzent.
 *
 * Jetzt wird nach Rolle gefragt statt nach Rang:
 *
 *   ink            der dunkelste haeufige Textton — Haupttext
 *   muted-strong   der naechste, der heller ist als ink
 *   accent         der gesaettigtste Ton ueberhaupt, aus Text UND Flaechen
 *   surface        die haeufigste helle Flaeche, die nicht der Akzent ist
 */
const saettigung = (hex) => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return 0;
  return l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
};

const canvas = zuHex(seitenhintergrund) ?? '#ffffff';
const flaechen = haeufigste(roh.hintergruende ?? {}, 10).map((e) => zuHex(e.wert)).filter(Boolean);
const texte = haeufigste(roh.farben ?? {}, 10).map((e) => zuHex(e.wert)).filter(Boolean);

// Haupttext: der dunkelste der haeufigen Texttoene.
const ink = [...texte].sort((a, b) => helligkeit(a) - helligkeit(b))[0] ?? '#000000';

// Sekundaertext: der haeufigste, der heller ist als ink, aber noch lesbar.
const mutedStrong = texte.find((f) => f !== ink && helligkeit(f) > helligkeit(ink)) ?? ink;

/* Akzent: der gesaettigtste Ton, egal ob er als Text oder als Flaeche
   vorkommt. Ein Akzent liegt oft nur auf einem Knopf und taucht in der
   Textliste gar nicht auf. Unter 0,25 Saettigung gilt ein Ton als neutral —
   dann hat die Seite schlicht keinen Akzent, und das ist auch eine Aussage. */
const kandidaten = [...new Set([...texte, ...flaechen])].filter((f) => f !== canvas);
const accent = kandidaten.sort((a, b) => saettigung(b) - saettigung(a))[0];
const hatAkzent = accent && saettigung(accent) >= 0.25;

/* Flaeche: die haeufigste helle Flaeche, die weder canvas noch der Akzent
   ist. "Hell" heisst hier: naeher an canvas als an ink. */
const surface = flaechen.find((f) =>
  f !== canvas
  && f !== accent
  && Math.abs(helligkeit(f) - helligkeit(canvas)) < Math.abs(helligkeit(f) - helligkeit(ink)),
) ?? canvas;

const tokens = {
  canvas,
  surface,
  ink,
  'muted-strong': mutedStrong,
  ...(hatAkzent ? { accent } : {}),
};

if (!hatAkzent) {
  console.log('  Hinweis: kein gesaettigter Akzent gefunden — die Seite arbeitet neutral.');
}

// ---- Pruefen
const pruefungen = Object.entries(tokens)
  .filter(([name]) => name !== 'canvas' && name !== 'surface')
  .map(([name, farbe]) => ({
    name,
    farbe,
    aufCanvas: kontrast(farbe, tokens.canvas),
    aufSurface: kontrast(farbe, tokens.surface),
  }));

const zeile = (p) =>
  `| \`${p.name}\` | \`${p.farbe}\` | ${p.aufCanvas.toFixed(2)}:1 ${p.aufCanvas >= 4.5 ? '✅' : '❌'} `
  + `| ${p.aufSurface.toFixed(2)}:1 ${p.aufSurface >= 4.5 ? '✅' : '❌'} |`;

const liste = (karte, n) => haeufigste(karte ?? {}, n)
  .map((e) => `| \`${e.wert}\` | ${e.anzahl}× | ${e.orte.slice(0, 3).join(', ')} |`).join('\n');

const md = `# DESIGN-SYSTEM.md

Erzeugt von \`design-system-extractor\` aus ${SEITEN.map((p) => '`' + p + '`').join(', ')}
auf ${adresse}.

**Gemessen, nicht abgeschrieben.** Gelesen wurden computed styles: Kaskade,
Spezifität und Medienabfragen sind darin bereits aufgelöst.

## 1. Farb-Tokens

| Token | Wert |
|---|---|
${Object.entries(tokens).map(([k, v]) => `| \`--${k}\` | \`${v}\` |`).join('\n')}

### Kontrast

| Token | Farbe | auf canvas | auf surface |
|---|---|---|---|
${pruefungen.map(zeile).join('\n')}

${pruefungen.some((p) => p.aufCanvas < 4.5)
    ? '> **Achtung:** Mindestens ein Token verfehlt auf `canvas` die Anforderung\n> von 4,5:1 für Fließtext. Entweder er trägt nur dekorative Rollen — dann\n> gehört das hier vermerkt — oder er muss dunkler werden.\n'
    : '> Alle geprüften Kombinationen erfüllen 4,5:1.\n'}

## 2. Typografie

| Schrift | Vorkommen | Wo |
|---|---|---|
${liste(roh.schriften, 4)}

Grundschrift: \`${grundschrift}\`

### Größen

| Größe | Vorkommen | Wo |
|---|---|---|
${liste(roh.groessen, 8)}

### Gewichte

| Gewicht | Vorkommen | Wo |
|---|---|---|
${liste(roh.gewichte, 5)}

## 3. Raum und Form

### Abstände

| Wert | Vorkommen | Wo |
|---|---|---|
${liste(roh.abstaende, 10)}

### Radien

| Wert | Vorkommen | Wo |
|---|---|---|
${liste(roh.radien, 5)}

### Schatten

| Wert | Vorkommen | Wo |
|---|---|---|
${liste(roh.schatten, 4)}

## 4. Bewusst verboten

**Dieser Abschnitt ist der wichtigste — und der einzige, der nicht gemessen
werden kann.** Vorbefüllt aus dem, was in der Referenz *nicht* vorkam. Vor der
Übernahme durchsehen: Er ist eine Entscheidung, keine Messung.

* **Kein zweiter Akzent.** Genau ein bunter Ton, Zustände über eine dunklere
  Stufe desselben Tons.
* **Keine dritte Radiusstufe.** ${haeufigste(roh.radien ?? {}, 3).length > 2 ? 'Gemessen wurden mehr als zwei — hier gehört aufgeräumt.' : 'Gemessen wurden höchstens zwei.'}
* **Keine Schatten aus zwei Richtungen.** Eine Lichtquelle, von oben.
* **Keine Verläufe als tragendes Element.**
* **Keine Symbolschrift und kein CDN.** Jede fremde Adresse ist bei jedem
  Seitenaufruf eine Verbindung zu einem Dritten.
* **Keine erfundenen Bildschirmfotos.**

## 5. Was hier fehlt

* **Zustände** — Hover, Fokus, gedrückt. Sie brauchen Interaktion und wurden
  nicht gemessen. Von Hand ergänzen.
* **Dunkelmodus**, sofern die Referenz einen hat: ein zweiter Durchgang mit
  \`colorScheme: 'dark'\`.
* **Komponenten-Anatomie** — welche Teile eine Karte hat, in welcher
  Reihenfolge. Das sieht nur ein Mensch.
`;

writeFileSync(`${AUSGABE}/DESIGN-SYSTEM.md`, md);

writeFileSync(
  `${AUSGABE}/tokens.css`,
  `/* Erzeugt von design-system-extractor. */\n:root {\n`
  + Object.entries(tokens).map(([k, v]) => `  --${k}: ${v};`).join('\n')
  + `\n}\n`,
);

writeFileSync(
  `${AUSGABE}/tailwind.config.js`,
  `/* Erzeugt von design-system-extractor. */\nexport default {\n  theme: {\n    extend: {\n      colors: {\n`
  + Object.entries(tokens).map(([k, v]) => `        '${k}': '${v}',`).join('\n')
  + `\n      },\n    },\n  },\n};\n`,
);

console.log(`\nGeschrieben nach ${AUSGABE}/`);
console.log('  raw-tokens.json  DESIGN-SYSTEM.md  tokens.css  tailwind.config.js');
console.log('\nDer Abschnitt „Bewusst verboten" gehoert von Hand durchgesehen.');
