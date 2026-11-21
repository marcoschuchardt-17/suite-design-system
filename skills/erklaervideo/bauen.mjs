/*
 * Baut aus einem Drehbuch einen Erklaerfilm.
 *
 *   node bauen.mjs <drehbuch.json> [zielordner]
 *
 * Was hier passiert, in dieser Reihenfolge:
 *
 *   1. Playwright faehrt die Anwendung im Browser ab und nimmt jede Szene auf.
 *   2. `say` spricht den Text je Szene ein (macOS, deutsche Stimmen).
 *   3. ffmpeg legt Bild und Ton uebereinander, haengt Titeltafeln davor und
 *      setzt alles zu einem Film zusammen.
 *
 * Alles laeuft auf diesem Rechner. Kein Dienst, kein Konto, kein Hochladen —
 * dieselbe Grenze wie ueberall in dieser Suite. Der Preis dafuer ist die
 * Stimme: `say` klingt nach Vorlesen, nicht nach Podcast. Wer das nicht will,
 * spricht die Texte selbst ein und legt die Dateien unter `stimme/` ab; der
 * Bau nimmt sie dann statt der erzeugten.
 *
 * Die Laenge einer Szene richtet sich nach dem Ton, nicht nach einer geratenen
 * Zahl: Erst wird gesprochen, dann so lange aufgenommen, wie das Sprechen
 * dauert. Sonst redet die Stimme ins Schwarze oder das Bild steht still.
 */
import { chromium } from 'playwright';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, mkdir, rm, readdir, rename, access } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';

const lauf = promisify(execFile);

const [drehbuchPfad, zielArg] = process.argv.slice(2);

if (!drehbuchPfad) {
  console.error('Aufruf: node bauen.mjs <drehbuch.json> [zielordner]');
  process.exit(2);
}

const drehbuch = JSON.parse(await readFile(drehbuchPfad, 'utf8'));
const ziel = resolve(zielArg || join(dirname(drehbuchPfad), 'fertig'));
const arbeit = join(ziel, '.arbeit');

await rm(arbeit, { recursive: true, force: true });
await mkdir(arbeit, { recursive: true });

const BREITE = drehbuch.breite ?? 1280;
const HOEHE = drehbuch.hoehe ?? 720;

/* Zwei Stimmen im Wechsel, wenn das Drehbuch es so vorsieht. Ein Wechsel
   traegt ueber eine lange Erklaerung besser als eine einzelne Stimme — das
   ist der einzige Grund dafuer, nicht der Effekt. */
const STIMMEN = drehbuch.stimmen ?? ['Sandy', 'Reed'];

/** Sekunden, die eine Tondatei laeuft. */
async function dauer(datei) {
  const { stdout } = await lauf('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', datei,
  ]);
  return parseFloat(stdout.trim());
}

/** Spricht einen einzelnen Wortbeitrag ein. */
async function beitragSprechen(text, kennung, stimme) {
  const roh = join(arbeit, `roh-${kennung}.aiff`);
  const fertig = join(arbeit, `teil-${kennung}.m4a`);

  await lauf('say', ['-v', stimme, '-r', String(drehbuch.tempo ?? 180), '-o', roh, text]);
  await lauf('ffmpeg', ['-y', '-i', roh, '-ac', '2', '-ar', '44100', '-c:a', 'aac', '-b:a', '128k', fertig]);

  return fertig;
}

/**
 * Der Ton einer Szene — als Gespraech zwischen zwei Stimmen.
 *
 * Warum ein Gespraech und keine Erzaehlstimme: Eine Stimme, die fuenf Minuten
 * durchspricht, klingt nach Bedienungsanleitung. Zwei, die sich gegenseitig
 * fragen und antworten, tragen dieselbe Erklaerung deutlich weiter — das ist
 * der ganze Trick, den Googles NotebookLM anwendet.
 *
 * Zwischen den Wortbeitraegen liegt eine kurze Pause. Ohne sie fallen sich die
 * Stimmen ins Wort und es klingt wie eine einzige, die die Tonlage wechselt.
 *
 * Eine eigene Aufnahme unter `stimme/<nummer>.m4a` hat immer Vorrang. Wer die
 * Texte selbst einspricht, bekommt sie unveraendert benutzt.
 */
async function szenenTon(szene, nummer) {
  const eigen = join(dirname(drehbuchPfad), 'stimme', `${nummer}.m4a`);

  try {
    await access(eigen);
    const kopie = join(arbeit, `ton-${nummer}.m4a`);
    await lauf('ffmpeg', ['-y', '-i', eigen, '-c', 'copy', kopie]);
    console.log('   Ton: eigene Aufnahme');
    return kopie;
  } catch { /* keine eigene Aufnahme */ }

  const beitraege = szene.dialog ?? [{ s: 0, text: szene.text }];
  const fertig = join(arbeit, `ton-${nummer}.m4a`);

  const stille = join(arbeit, 'stille.m4a');
  await lauf('ffmpeg', ['-y', '-f', 'lavfi', '-i',
    'anullsrc=channel_layout=stereo:sample_rate=44100:d=0.35', '-c:a', 'aac', '-b:a', '128k', stille]);

  const teile = [];

  for (const [i, b] of beitraege.entries()) {
    const stimme = STIMMEN[(b.s ?? 0) % STIMMEN.length];
    teile.push(await beitragSprechen(b.text, `${nummer}-${i}`, stimme));
    if (i < beitraege.length - 1) teile.push(stille);
  }

  const liste = join(arbeit, `ton-${nummer}.txt`);
  await lauf('bash', ['-c',
    `printf '%s\\n' ${teile.map((x) => `"file '${x}'"`).join(' ')} > "${liste}"`]);
  await lauf('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', liste, '-c', 'copy', fertig]);

  const wer = beitraege.map((b) => STIMMEN[(b.s ?? 0) % STIMMEN.length]).join(' / ');
  console.log(`   Ton: ${beitraege.length} Wortbeitraege (${wer})`);

  return fertig;
}

/** Nimmt eine Szene im Browser auf, so lange wie der Ton dauert. */
async function aufnehmen(szene, nummer, sekunden, browser) {
  const ordner = join(arbeit, `bild-${nummer}`);
  await mkdir(ordner, { recursive: true });

  const kontext = await browser.newContext({
    viewport: { width: BREITE, height: HOEHE },
    recordVideo: { dir: ordner, size: { width: BREITE, height: HOEHE } },
    colorScheme: szene.schema ?? drehbuch.schema ?? 'light',
    reducedMotion: 'no-preference',
  });

  const seite = await kontext.newPage();

  if (drehbuch.anmelden && !szene.ohneAnmeldung) {
    await seite.goto(drehbuch.basis + drehbuch.anmelden.pfad, { waitUntil: 'networkidle' });
    for (const [wahl, wert] of Object.entries(drehbuch.anmelden.felder)) {
      await seite.fill(wahl, wert);
    }
    await Promise.all([
      seite.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {}),
      seite.click(drehbuch.anmelden.knopf),
    ]);
  }

  await seite.goto(drehbuch.basis + szene.pfad, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(600);

  const start = Date.now();

  /* Die Handlungen des Drehbuchs, gleichmaessig ueber die Sprechzeit verteilt.
     So kommt die Bewegung dort an, wo der Text sie erwaehnt. */
  const schritte = szene.schritte ?? [];
  const abstand = (sekunden * 1000) / (schritte.length + 1);

  for (const schritt of schritte) {
    await seite.waitForTimeout(Math.max(abstand - 250, 200));

    if (schritt.scrollen) {
      await seite.evaluate((y) => window.scrollBy({ top: y, behavior: 'smooth' }), schritt.scrollen);
    }
    if (schritt.zeigeAuf) {
      const el = seite.locator(schritt.zeigeAuf).first();
      await el.scrollIntoViewIfNeeded().catch(() => {});
      const kasten = await el.boundingBox().catch(() => null);
      if (kasten) await seite.mouse.move(kasten.x + kasten.width / 2, kasten.y + kasten.height / 2, { steps: 24 });
    }
    if (schritt.klicke) {
      await seite.locator(schritt.klicke).first().click().catch(() => {});
      await seite.waitForLoadState('networkidle').catch(() => {});
    }
  }

  // Bis zum Ende des Tons weiterlaufen lassen, damit nichts abgeschnitten wird.
  const rest = sekunden * 1000 - (Date.now() - start);
  if (rest > 0) await seite.waitForTimeout(rest);

  await kontext.close();   // schreibt die Videodatei erst hier

  const dateien = await readdir(ordner);
  const webm = dateien.find((d) => d.endsWith('.webm'));
  if (!webm) throw new Error(`Keine Aufnahme fuer Szene ${nummer}`);

  const pfad = join(arbeit, `bild-${nummer}.webm`);
  await rename(join(ordner, webm), pfad);
  return pfad;
}

/** Eine Titeltafel als kurzer Clip.
 *
 * Gesetzt wird sie im Browser, nicht in ffmpeg. Zwei Gruende: Dieser
 * ffmpeg-Bau hat den Schriftfilter `drawtext` gar nicht (`ffmpeg -filters`
 * findet ihn nicht), und selbst mit ihm saehe eine Tafel anders aus als die
 * Seite daneben. So kommen Schrift, Farben und Abstaende aus demselben
 * Stylesheet wie alles andere.
 */
async function tafel(text, unterzeile, nummer, browser, sekunden = 2.4) {
  const bild = join(arbeit, `tafel-${nummer}.png`);
  const datei = join(arbeit, `tafel-${nummer}.mp4`);

  const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE } });

  await seite.setContent(`<!doctype html><meta charset="utf-8">
    <style>
      html,body { margin:0; height:100%; }
      body {
        display:grid; place-content:center; text-align:center; gap:1.1rem;
        background:#0B1120; color:#fff;
        font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif;
      }
      h1 { margin:0; font-size:3.4rem; font-weight:800; letter-spacing:-.03em; }
      p  { margin:0; font-size:1.35rem; font-weight:500; color:#818CF8; }
    </style>
    <h1>${text.replace(/</g, '&lt;')}</h1>
    <p>${(unterzeile || '').replace(/</g, '&lt;')}</p>`);

  await seite.waitForTimeout(250);
  await seite.screenshot({ path: bild });
  await seite.close();

  await lauf('ffmpeg', [
    '-y',
    '-loop', '1', '-t', String(sekunden), '-i', bild,
    '-f', 'lavfi', '-i', `anullsrc=channel_layout=stereo:sample_rate=44100:d=${sekunden}`,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    '-c:a', 'aac', '-shortest', datei,
  ]);

  return datei;
}

/* ------------------------------------------------------------------ Bau */

console.log(`\n${drehbuch.titel}\n`);

const browser = await chromium.launch();
const teile = [];

teile.push(await tafel(drehbuch.titel, drehbuch.untertitel ?? '', 'start', browser));

for (const [i, szene] of drehbuch.szenen.entries()) {
  const nummer = String(i + 1).padStart(2, '0');

  console.log(`Szene ${nummer}: ${szene.pfad}`);

  const ton = await szenenTon(szene, nummer);
  const sekunden = await dauer(ton) + 0.7;   // ein Atemzug am Ende
  console.log(`   Laenge ${sekunden.toFixed(1)}s`);

  const bild = await aufnehmen(szene, nummer, sekunden, browser);

  const zusammen = join(arbeit, `szene-${nummer}.mp4`);
  await lauf('ffmpeg', [
    '-y', '-i', bild, '-i', ton,
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    '-c:a', 'aac', '-b:a', '128k',
    '-vf', `scale=${BREITE}:${HOEHE}:force_original_aspect_ratio=decrease,pad=${BREITE}:${HOEHE}:(ow-iw)/2:(oh-ih)/2:0x0B1120`,
    '-shortest', zusammen,
  ]);

  teile.push(zusammen);
}

teile.push(await tafel(drehbuch.abspann ?? 'marcoschuchardt.de', drehbuch.abspannZeile ?? '', 'ende', browser));

const liste = join(arbeit, 'teile.txt');
await lauf('bash', ['-c', `printf '%s\\n' ${teile.map((t) => `"file '${t}'"`).join(' ')} > "${liste}"`]);

const fertig = join(ziel, `${drehbuch.datei ?? 'film'}.mp4`);
await lauf('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', liste, '-c', 'copy', fertig]);

await browser.close();

const gesamt = await dauer(fertig);
console.log(`\nFertig: ${fertig}`);
console.log(`Laenge: ${Math.floor(gesamt / 60)}:${String(Math.round(gesamt % 60)).padStart(2, '0')} Minuten\n`);
