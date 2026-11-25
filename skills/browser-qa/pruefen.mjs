/*
 * Browser-QA — prueft eine laufende Oberflaeche in einem echten Browser.
 *
 *   node pruefen.mjs <adresse> [pfad ...]
 *   node pruefen.mjs http://127.0.0.1:8000 / /notizen /reisen
 *
 * Endet mit Fehlercode, sobald etwas gefunden wird.
 *
 * Gehoert zur Skill browser-qa (MAR-214). Die Pruefungen und ihre Begruendung
 * stehen in SKILL.md daneben.
 */
import { chromium } from 'playwright';

const [adresse, ...pfade] = process.argv.slice(2);

if (!adresse) {
  console.error('Aufruf: node pruefen.mjs <adresse> [pfad ...]');
  process.exit(2);
}

const SEITEN = pfade.length ? pfade : ['/'];
const BREITEN = [['Handy', 390], ['Tablet', 768], ['Schirm', 1440]];
const SCHEMATA = ['light', 'dark'];

/* Laeuft im Browser. Alles, was das DOM beantworten kann, wird in einem
   Durchgang beantwortet statt in zwanzig Einzelabfragen. */
const imBrowser = () => {
  const funde = [];
  const melde = (art, text) => funde.push({ art, text });

  /* Jede CSS-Farbe (rgb, oklch, oklab, lab, color-mix ...) als [r, g, b, a] mit a von 0 bis 1.
     Der Browser rechnet selbst um: Farbe auf eine leere Leinwand malen, Pixel lesen. Die drei Zahlen
     aus "oklch(0.70 0.04 256)" als RGB zu lesen, ergab vorher Kontraste um 2:1 statt 6:1. */
  const leinwand = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const farbe = (s) => {
    leinwand.clearRect(0, 0, 1, 1);
    leinwand.fillStyle = 'rgba(0, 0, 0, 0)';
    leinwand.fillStyle = s;
    leinwand.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = leinwand.getImageData(0, 0, 1, 1).data;
    return [r, g, b, a / 255];
  };

  /* Farbe mit Deckkraft a ueber einen deckenden Untergrund legen. */
  const ueber = ([r, g, b, a], unten) => [r, g, b].map((v, i) => v * a + unten[i] * (1 - a));

  const helligkeit = (c) => {
    const [r, g, b] = c.map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const kontrast = (a, b) => {
    const [hell, dunkel] = [helligkeit(a), helligkeit(b)].sort((x, y) => y - x);
    return (hell + 0.05) / (dunkel + 0.05);
  };

  /* Der sichtbare Hintergrund: alle Ebenen nach oben bis zur ersten deckenden sammeln und von unten
     verrechnen. Eine Ebene mit 5 % Deckkraft ist kein Hintergrund fuer sich - als deckend gelesen,
     ergab sie vorher Kontraste von 1:1. Ohne deckende Ebene liegt alles auf Weiss (Seitengrund). */
  const hintergrund = (el) => {
    const ebenen = [];
    for (let e = el; e; e = e.parentElement) {
      const c = farbe(getComputedStyle(e).backgroundColor);
      if (c[3] > 0) ebenen.push(c);
      if (c[3] >= 1) break;
    }
    return ebenen.reverse().reduce((unten, c) => ueber(c, unten), [255, 255, 255]);
  };

  // ---------------------------------------------------------------- Kontrast
  const gesehen = new Set();
  document.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6,a,span,dd,dt,td,th,label,button,figcaption,code,time').forEach((el) => {
    const eigenerText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!eigenerText) return;

    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;

    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none' || st.opacity === '0') return;

    const grund = hintergrund(el);
    const wert = kontrast(ueber(farbe(st.color), grund), grund);
    const px = parseFloat(st.fontSize);
    const gross = px >= 24 || (px >= 18.66 && parseInt(st.fontWeight, 10) >= 700);
    const soll = gross ? 3 : 4.5;
    if (wert >= soll) return;

    const schluessel = `${el.tagName}|${st.color}|${Math.round(px)}`;
    if (gesehen.has(schluessel)) return;
    gesehen.add(schluessel);

    melde('Kontrast', `${wert.toFixed(2)}:1 statt ${soll}:1 — ${el.tagName.toLowerCase()} „${el.textContent.trim().slice(0, 40)}"`);
  });

  // ------------------------------------------------------- Waagerechter Ueberlauf
  const de = document.documentElement;
  if (de.scrollWidth > de.clientWidth + 1) {
    const schuldige = [...document.querySelectorAll('*')]
      .filter((el) => el.getBoundingClientRect().right > de.clientWidth + 1)
      .slice(0, 3)
      .map((el) => el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''));
    melde('Ueberlauf', `${de.scrollWidth} > ${de.clientWidth} px — ${schuldige.join(', ')}`);
  }

  // ------------------------------------------------------------- Ueberschriften
  const h1 = document.querySelectorAll('h1').length;
  if (h1 !== 1) melde('Ueberschrift', `${h1} h1 auf der Seite`);

  [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .map((h) => +h.tagName[1])
    .reduce((vorher, jetzt) => {
      if (vorher && jetzt > vorher + 1) melde('Ueberschrift', `Sprung von h${vorher} auf h${jetzt}`);
      return jetzt;
    }, 0);

  // ------------------------------------------------------ Formulare und Verweise
  document.querySelectorAll('input, select, textarea').forEach((f) => {
    if (f.type === 'hidden' || f.type === 'submit' || f.type === 'button') return;
    const hatLabel =
      (f.id && document.querySelector(`label[for="${CSS.escape(f.id)}"]`)) ||
      f.closest('label') ||
      f.getAttribute('aria-label') ||
      f.getAttribute('aria-labelledby');
    if (!hatLabel) melde('Formular', `Feld ohne Label: ${f.name || f.type}`);
  });

  document.querySelectorAll('a').forEach((a) => {
    if (!a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('[aria-label], title'))
      melde('Verweis', `ohne erkennbaren Namen: ${a.getAttribute('href')}`);
    if (a.target === '_blank' && !(a.rel || '').includes('noopener'))
      melde('Verweis', `target="_blank" ohne rel="noopener": ${a.getAttribute('href')}`);
  });

  document.querySelectorAll('img:not([alt])').forEach((i) =>
    melde('Bild', `alt fehlt: ${i.getAttribute('src')}`));

  // ------------------------------------------------------------- Fokusrahmen
  /* outline:none ohne Ersatz nimmt der Tastaturbedienung die Sichtbarkeit.
     Geprueft wird an einem echten Fokus, nicht am Stylesheet — eine Regel
     kann ueberschrieben sein. */
  const fokussierbar = [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((el) => el.getBoundingClientRect().width > 0)
    .slice(0, 25);

  fokussierbar.forEach((el) => {
    el.focus();
    const st = getComputedStyle(el);
    const hatRahmen =
      (st.outlineStyle !== 'none' && parseFloat(st.outlineWidth) > 0) ||
      st.boxShadow !== 'none' ||
      st.borderColor !== getComputedStyle(el.parentElement || document.body).borderColor;
    if (!hatRahmen) melde('Fokus', `kein sichtbarer Rahmen: ${el.tagName.toLowerCase()} „${(el.textContent || '').trim().slice(0, 24)}"`);
  });
  document.activeElement?.blur();

  // ----------------------------------------------------- Haengende Skeletons
  /* Nur echte Platzhalter-Klassen. Tailwind-Klassen wie placeholder:text-zinc-400 oder
     placeholder-zinc-400 faerben den Platzhaltertext eines Feldes und sind kein Ladezustand. */
  const ladeklasse = (k) => /skeleton/i.test(k) || k === 'placeholder' || /^(is-|lade-)?placeholder(--|__|$)/.test(k);
  document.querySelectorAll('[class*="skeleton"], [class*="Skeleton"], [class*="placeholder"], [aria-busy="true"]').forEach((el) => {
    const echt = el.getAttribute('aria-busy') === 'true' || String(el.className).split(/\s+/).some(ladeklasse);
    if (echt && el.getBoundingClientRect().width > 0)
      melde('Skeleton', `Ladeplatzhalter steht noch: ${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`);
  });

  // ------------------------------------------------------------- Tippziele
  /* Ausgenommen ist, was "in einem Satz oder Textblock" steht (WCAG 2.5.8).
     Nicht ueber eine Tagliste geprueft — die ist immer zu kurz —, sondern
     ueber die Frage, ob neben dem Verweis noch Text steht. */
  const imSatz = (a) => {
    for (let e = a.parentElement; e && e !== document.body; e = e.parentElement) {
      if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim() && !a.contains(n))) return true;
      if (getComputedStyle(e).display !== 'inline') break;
    }
    return false;
  };

  document.querySelectorAll('a,button').forEach((a) => {
    if (imSatz(a)) return;
    const r = a.getBoundingClientRect();
    if (r.width && (r.width < 24 || r.height < 24))
      melde('Tippziel', `${Math.round(r.width)}x${Math.round(r.height)} px — „${(a.textContent || '').trim().slice(0, 24)}"`);
  });

  // ----------------------------------------------------------------- Aufbau
  if (!document.querySelector('main, [role="main"]')) melde('Aufbau', 'kein <main> und kein role="main"');
  if (!document.documentElement.lang) melde('Sprache', 'kein lang-Attribut');

  return funde;
};

const browser = await chromium.launch();
/* Angemeldet pruefen: QA_STATE zeigt auf einen Playwright-storageState (Cookies einer lokalen Testanmeldung). */
const zustand = process.env.QA_STATE || undefined;
let gesamt = 0;

for (const schema of SCHEMATA) {
  for (const [name, breite] of BREITEN) {
    const seite = await browser.newPage({ viewport: { width: breite, height: 900 }, colorScheme: schema, storageState: zustand });

    const konsole = [];
    const anfragen = [];
    const gemischt = [];

    seite.on('console', (m) => m.type() === 'error' && konsole.push(m.text()));
    seite.on('pageerror', (e) => konsole.push(String(e)));
    seite.on('response', (r) => r.status() >= 400 && anfragen.push(`${r.status()} ${r.url()}`));
    seite.on('requestfailed', (r) => {
      const grund = r.failure()?.errorText ?? '';
      /* Mixed Content gesondert: hinter einem Reverse Proxy die haeufigste
         Ursache dafuer, dass eine Seite lokal stimmt und deployt kaputt ist
         (MAR-189). */
      if (grund.includes('BLOCKED') || (seite.url().startsWith('https://') && r.url().startsWith('http://'))) gemischt.push(`${r.url()} — ${grund}`);
      else anfragen.push(`fehlgeschlagen ${r.url()} — ${grund}`);
    });

    for (const pfad of SEITEN) {
      konsole.length = 0;
      anfragen.length = 0;
      gemischt.length = 0;

      /* Eine Seite, die nicht laedt, ist ein Fund und kein Abbruch des ganzen Laufs. */
      let antwort = null;
      let funde;
      try {
        antwort = await seite.goto(adresse.replace(/\/$/, '') + pfad, { waitUntil: 'networkidle', timeout: 45000 });
        funde = await seite.evaluate(imBrowser);
      } catch (e) {
        funde = [{ art: 'Laden', text: String(e).split('\n')[0].slice(0, 120) }];
      }

      if (antwort && antwort.status() >= 400)
        funde.unshift({ art: 'Antwort', text: `HTTP ${antwort.status()}` });

      konsole.forEach((t) => funde.push({ art: 'Konsole', text: t.slice(0, 100) }));
      anfragen.forEach((t) => funde.push({ art: 'Anfrage', text: t.slice(0, 100) }));
      gemischt.forEach((t) => funde.push({ art: 'MixedContent', text: t.slice(0, 100) }));

      if (funde.length) {
        gesamt += funde.length;
        console.log(`\n${schema}/${name}(${breite}) ${pfad}`);
        funde.forEach((f) => console.log(`   [${f.art}] ${f.text}`));
      }
    }

    await seite.close();
  }
}

await browser.close();

const laeufe = SCHEMATA.length * BREITEN.length * SEITEN.length;

if (gesamt === 0) {
  console.log(`Browser-QA: ${laeufe} Durchgaenge, nichts gefunden.`);
  process.exit(0);
}

console.log(`\nBrowser-QA: ${gesamt} Fund(e) in ${laeufe} Durchgaengen.`);
process.exit(1);
