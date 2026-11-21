/**
 * Anwendungszeichen der Suite (August 2026).
 *
 * Der gefuellte Punkt auf 12 / 3,8 mit r 2,4 ist das gemeinsame Element mit
 * der Dachmarke; die Grundlinie bleibt allein der Dachmarke vorbehalten.
 *
 * Seit August 2026 fuenf: Photos (Immich) und Documents (Paperless) sind
 * dazugekommen. Sie sind die ersten
 * Fremdanwendungen im Satz. Paperless kann sein Logo austauschen
 * (PAPERLESS_APP_LOGO), Immich nicht — die Zeichnungen gehoeren trotzdem beide
 * hierher, weil die Suite sie zeigt (Leiste, Uebersichten).
 *
 * Nicht zu verwechseln mit MARKEN aus ./marken: das sind die aelteren Zeichen.
 * Alle Pfade hier sind neu gezeichnet; uebernommen sind die Motive, nicht die
 * Pfade.
 *
 * Geometrie wie der Symbolsatz: 24er-Raster, Motivfeld y 7,2–20 (ohne Punkt
 * 4–20), 2px Kontur, runde Enden, currentColor.
 */
export type AppZeichenName =
  | 'ausbildungsorganizer'
  | 'finanzkompass'
  | 'lernen-app'
  | 'immich'
  | 'paperless';

export interface AppZeichenEintrag {
  name: AppZeichenName;
  titel: string;
  /** SVG-Innenmarkup des Motivs, ohne den Punkt. */
  d: string;
  /** Traegt dieses Zeichen den gemeinsamen Punkt? */
  punktStandard: boolean;
}

/** Der gemeinsame Punkt, als Markup zum Anhaengen. */
export const APP_PUNKT =
  '<circle cx="12" cy="3.8" r="2.4" fill="currentColor" stroke="none"/>';

export const APP_ZEICHEN: AppZeichenEintrag[] = [
  {
    name: 'ausbildungsorganizer',
    titel: 'Ausbildungsorganizer',
    // Stundenplan-Raster: Kalenderblatt mit Kopfzeile und drei Spalten.
    d: '<rect x="4.2" y="8.4" width="15.6" height="11.2" rx="2"/><path d="M4.2 12.4h15.6"/><path d="M9.4 12.4v7.2M14.6 12.4v7.2"/>',
    punktStandard: true,
  },
  {
    name: 'finanzkompass',
    titel: 'Finanzkompass',
    // Kompass im Gehaeuse; Nadel als Raute, 3,68 Einheiten breit — schmaler
    // wuerde die 2px-Kontur ihre eigene Innenflaeche ueberdecken.
    d: '<circle cx="12" cy="14" r="5.8"/><path d="M15.4 10.4 13.5 15 9 17 10.9 12.4z"/>',
    punktStandard: true,
  },
  {
    name: 'lernen-app',
    titel: 'Lernen-App',
    // Zielscheibe; der innere Kreis hat den Radius des Punkts darueber.
    d: '<circle cx="12" cy="14" r="5.8"/><circle cx="12" cy="14" r="2.4"/>',
    punktStandard: true,
  },
  {
    name: 'immich',
    titel: 'Photos',
    // Bildrahmen mit Bergkante. Der Punkt darueber liest sich als Sonne ueber
    // der Landschaft — das gemeinsame Element traegt hier zusaetzlich Bedeutung,
    // ohne dafuer verbogen zu werden.
    //
    // Gewaehlt war urspruenglich das gestapelte Motiv: zwei versetzte Rahmen,
    // der vordere mit Horizont. Es haelt auf diesem Raster nicht. Bei 2px
    // Kontur bleiben zwischen zwei Rahmen hoechstens 0,8 Einheiten Luft; sie
    // laufen bei 40px ineinander, und der hintere Rahmen liest sich zusammen
    // mit dem Punkt als Schulter und Kopf. Bei 16px war es ein Fleck.
    //
    // Ein Rahmen sagt dasselbe und haelt von 16 bis 40px.
    d: '<rect x="4" y="9.4" width="16" height="10.4" rx="2.2"/><path d="M6.4 17.6 10 13.4l2.8 3.2 2-2.2 2.4 3.2"/>',
    punktStandard: true,
  },
  {
    name: 'paperless',
    titel: 'Documents',
    // Ablagekasten: was hereinkommt, liegt darin, bis es abgelegt ist. Das ist
    // genau, was Paperless tut.
    //
    // Als einziges Trapez unterscheidbar von den uebrigen vier — die Reihe
    // hat sonst zwei Kreise und zwei liegende Rechtecke, ein drittes Rechteck
    // waere in der Leiste bei 16px nicht mehr auseinanderzuhalten.
    //
    // Verworfen: Blatt mit Eselsohr. Die Ecke braucht zwei Rundungen und zwei
    // Textstriche, damit sie als Blatt lesbar ist; bei 16px lief das zu.
    d: '<path d="M6.2 8.6h11.6l2.2 4.8v4.2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4.2z"/><path d="M4 13.4h4l1 2h6l1-2h4"/>',
    punktStandard: true,
  },
];

const NACH_NAME = new Map(APP_ZEICHEN.map((z) => [z.name, z]));

export const APP_ZEICHEN_NAMEN = APP_ZEICHEN.map((z) => z.name);

/** Vollstaendiges SVG-Innenmarkup eines Zeichens, Punkt nach Regel. */
export function appZeichenMarkup(name: AppZeichenName, punkt?: boolean): string {
  const z = NACH_NAME.get(name);
  if (!z) return '';
  return (punkt ?? z.punktStandard) ? z.d + APP_PUNKT : z.d;
}
