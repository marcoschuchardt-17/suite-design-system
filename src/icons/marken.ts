/**
 * Suite-Marken — die Zeichen der einzelnen Anwendungen (MAR-89).
 *
 * Dieselbe Geometrie wie der Symbolsatz: 24er-Raster, 20er Nutzflaeche, 2px
 * Kontur, currentColor. Damit gehoeren Marke und Symbole sichtbar zusammen,
 * statt nebeneinanderher zu laufen.
 *
 * Vorher liefen die Zeichen auseinander: 48x48 gefuellt im School Organizer,
 * 24x24 mit Kontur 1.8 im Finanzkompass, und die
 * Lernen-App trug einen festen Blauverlauf (#2b86c5 → #1c6ea4) samt einem als
 * <text> gesetzten Monogramm — eine fremde Farbe und eine Schrift, die sich
 * nicht vorhersagen laesst.
 *
 * Die Bildideen bleiben, nur die Ausfuehrung ist vereinheitlicht.
 */

export interface Marke {
  readonly name: string;
  /** Wofuer das Zeichen steht — gehoert in den zugaenglichen Namen. */
  readonly titel: string;
  readonly d: string;
}

export const MARKEN = [
  {
    // Der Schluessel bleibt 'school-organizer': er benennt die Zieldatei und
    // das Verzeichnis der Anwendung. Umbenannt wurde am 30.08.2026 (MAR-81)
    // nur der sichtbare Titel — er wird als aria-label ausgegeben und damit
    // vorgelesen.
    name: 'school-organizer',
    titel: 'Ausbildungsorganizer',
    // Aufgeschlagenes Buch aus zwei Winkeln, Punkt darueber. Bildidee aus dem
    // bisherigen 48er-Zeichen uebernommen; der Punkt ist das Merkmal, das die
    // Marke vom 'buch'-Symbol des Satzes unterscheidet.
    d: '<path d="M12 7 4 9.7V19l8-2.7z"/><path d="m12 7 8 2.7V19l-8-2.7z"/><circle cx="12" cy="3.4" r="1.4" fill="currentColor" stroke="none"/>',
  },
  {
    name: 'finanzkompass',
    titel: 'Finanzkompass',
    // Kompassnadel, laengs geteilt - so wie eine Nadel aussieht, deren eine
    // Haelfte nach Norden zeigt.
    //
    // Der erste Versuch setzte eine zweite, kleinere Nadel in die grosse. Die
    // beiden Formen bildeten zusammen einen Querbalken, und bei 16px las man
    // ein 'A' statt eines Kompasses. Eine durchgehende Mittellinie macht
    // dasselbe sichtbar, ohne eine zweite Kontur einzuziehen.
    //
    // Zweite Korrektur: die Nadel war 13 Rastereinheiten breit, die anderen
    // drei Marken 16 bis 17. Bei gleicher nomineller Groesse wirkte sie dadurch
    // kleiner - in einer Leiste nebeneinander faellt das auf. Jetzt fuellt sie
    // dieselbe Flaeche wie die uebrigen.
    d: '<path d="M12 3.2 4 20.5 12 17.2l8 3.3z"/><path d="M12 3.2v14"/>',
  },
  {
    name: 'lernen-app',
    titel: 'Lernen-App',
    // Karteikarten, gestapelt. Neu: das bisherige Zeichen war ein Kreis mit
    // Farbverlauf und einem <text>-Monogramm - eine fremde Farbe und eine
    // Schrift, die je nach System anders aussieht. Karteikarten sagen ausserdem,
    // was die App tut, und sind vom 'buch'-Symbol klar zu unterscheiden.
    d: '<path d="M8 7.5V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1.5"/><rect x="4" y="7.5" width="12.5" height="12.5" rx="2"/><path d="M7.5 12h5.5M7.5 15.5h3.5"/>',
  },
] as const satisfies readonly Marke[];

export type MarkenName = (typeof MARKEN)[number]['name'];
