/**
 * Suite-Symbole — die Zeichnungen (MAR-89).
 *
 * Hausregeln, aus denen sich alles andere ergibt:
 *
 *   Raster        24 × 24
 *   Nutzflaeche   20 × 20, zentriert (x und y laufen von 2 bis 22)
 *   Kontur        2px, runde Enden und Ecken, keine Fuellung
 *   Radius        2 an Rechtecken — dieselbe weiche Kante wie --suite-radius
 *   Farbe         currentColor, nie ein fester Wert
 *
 * Die 20er-Nutzflaeche ist der Unterschied zu Lucide und Heroicons: die fuellen
 * das Feld bis an den Rand. Hier bleibt ringsum Luft, damit die Symbole neben
 * Figtree ruhig stehen und nicht gegen den Text draengen. Dieselbe Regel wie
 * beim Weissraum im uebrigen System, nur zwei Groessenordnungen kleiner.
 *
 * Jeder Eintrag ist reines Pfad-Markup ohne <svg>-Huelle. Die Huelle setzt die
 * Komponente, damit Groesse, Strichstaerke und Barrierefreiheit an genau einer
 * Stelle stehen.
 */

export interface Symbol {
  /** Deutscher Name — die Apps sind deutschsprachig, die Symbolnamen auch. */
  readonly name: string;
  /** Wonach jemand sucht, der den Namen nicht kennt. */
  readonly auch: readonly string[];
  readonly d: string;
}

export const SYMBOLE = [
  // ---- Aktionen ----
  { name: 'plus', auch: ['hinzufuegen', 'neu'],
    d: '<path d="M12 5v14M5 12h14"/>' },
  { name: 'minus', auch: ['entfernen'],
    d: '<path d="M5 12h14"/>' },
  { name: 'haken', auch: ['erledigt', 'bestaetigen', 'richtig'],
    d: '<path d="M4.5 12.5 9.5 17.5 19.5 7"/>' },
  { name: 'kreuz', auch: ['schliessen', 'abbrechen', 'falsch'],
    d: '<path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"/>' },
  // Drei Striche auf 7 / 12 / 17, also symmetrisch um die Mittelachse, und von
  // 4 bis 20 — dieselbe 20er Nutzflaeche wie der Rest. Der Abstand von 5
  // zwischen den Strichen ist bewusst groesser als bei Lucide: bei 2px Kontur
  // und 14px Groesse liefen engere Striche ineinander.
  //
  // Gehoert mit 'kreuz' zusammen: die beiden sind die zwei Zustaende desselben
  // Knopfes, und deshalb liegen ihre Enden auf denselben x-Werten.
  { name: 'menue', auch: ['navigation', 'hamburger'],
    d: '<path d="M4 7h16M4 12h16M4 17h16"/>' },
  { name: 'stift', auch: ['bearbeiten', 'aendern'],
    d: '<path d="M4 20v-3.5L15.5 5l3.5 3.5L7.5 20z"/><path d="M14 6.5 17.5 10"/>' },
  { name: 'papierkorb', auch: ['loeschen', 'entfernen'],
    d: '<path d="M4 6.5h16"/><path d="M9.5 6.5V4h5v2.5"/><path d="M6.5 6.5 7.5 20h9l1-13.5"/>' },
  { name: 'lupe', auch: ['suchen', 'finden'],
    d: '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5 20 20"/>' },
  { name: 'regler', auch: ['einstellungen', 'optionen'],
    d: '<path d="M4 8h16M4 16h16"/><circle cx="9" cy="8" r="2.5"/><circle cx="15" cy="16" r="2.5"/>' },
  { name: 'mischen', auch: ['zufall', 'gemischt', 'durchmischen'],
    d: '<path d="M4 7h3.5l9 10H20"/><path d="M16.5 13.5 20 17l-3.5 3.5"/><path d="M4 17h3.5l9-10H20"/><path d="M16.5 3.5 20 7l-3.5 3.5"/>' },
  { name: 'lautsprecher', auch: ['vorlesen', 'ton', 'audio'],
    d: '<path d="M4.5 9.5h3.5L12.5 6v12L8 14.5H4.5z"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5"/><path d="M18.5 7a7 7 0 0 1 0 10"/>' },

  // ---- Richtung ----
  { name: 'winkel-unten', auch: ['aufklappen', 'mehr'],
    d: '<path d="M6.5 9.5 12 15l5.5-5.5"/>' },
  { name: 'winkel-oben', auch: ['zuklappen', 'weniger'],
    d: '<path d="M6.5 14.5 12 9l5.5 5.5"/>' },
  { name: 'winkel-rechts', auch: ['weiter', 'naechster'],
    d: '<path d="M9.5 6.5 15 12l-5.5 5.5"/>' },
  { name: 'winkel-links', auch: ['zurueck', 'voriger'],
    d: '<path d="M14.5 6.5 9 12l5.5 5.5"/>' },
  { name: 'pfeil-rechts', auch: ['weiter', 'oeffnen'],
    d: '<path d="M4 12h15"/><path d="M13.5 6.5 19 12l-5.5 5.5"/>' },
  { name: 'pfeil-links', auch: ['zurueck'],
    d: '<path d="M20 12H5"/><path d="M10.5 6.5 5 12l5.5 5.5"/>' },
  { name: 'herunterladen', auch: ['export', 'sichern'],
    d: '<path d="M12 4v11"/><path d="M7.5 10.5 12 15l4.5-4.5"/><path d="M4 20h16"/>' },
  { name: 'hochladen', auch: ['import', 'einlesen'],
    d: '<path d="M12 20V9"/><path d="M7.5 13.5 12 9l4.5 4.5"/><path d="M4 4h16"/>' },

  // ---- Inhalte ----
  { name: 'blatt', auch: ['dokument', 'datei', 'bericht'],
    d: '<path d="M6 3.5h7.5L18 8v12.5H6z"/><path d="M13.5 3.5V8H18"/>' },
  { name: 'mappe', auch: ['ordner', 'sammlung'],
    d: '<path d="M3.5 19.5v-14a1 1 0 0 1 1-1h4.5l2 3h9a1 1 0 0 1 1 1v11z"/>' },
  { name: 'buch', auch: ['lernen', 'unterricht', 'wissen'],
    d: '<path d="M12 6.5C10.5 5 8.5 4.5 4 4.5v13c4.5 0 6.5.5 8 2 1.5-1.5 3.5-2 8-2v-13c-4.5 0-6.5.5-8 2z"/><path d="M12 6.5v12"/>' },
  { name: 'kalender', auch: ['termin', 'datum', 'stundenplan'],
    d: '<rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M3.5 10.5h17"/><path d="M8 3.5v4M16 3.5v4"/>' },
  { name: 'uhr', auch: ['zeit', 'dauer', 'frist'],
    d: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.5l3.5 2"/>' },
  { name: 'saeulen', auch: ['auswertung', 'statistik', 'finanzen'],
    d: '<path d="M3.5 20.5h17"/><path d="M7.5 20.5v-4.5M12 20.5v-9M16.5 20.5v-13.5"/>' },
  { name: 'liste', auch: ['aufzaehlung', 'eintraege', 'verwalten'],
    d: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><path d="M4.5 6.45v.1M4.5 11.95v.1M4.5 17.45v.1"/>' },
  { name: 'baustein', auch: ['konzept', 'teil', 'puzzle'],
    d: '<path d="M4 5.5h14v5a2 2 0 0 1 0 4v5H4v-5a2 2 0 0 1 0-4z"/>' },
  { name: 'pruefblatt', auch: ['klassenarbeit', 'pruefung', 'test'],
    d: '<path d="M6 3.5h7.5L18 8v12.5H6z"/><path d="M13.5 3.5V8H18"/><path d="M9 14l2 2 4-4"/>' },
  { name: 'ziel', auch: ['uebung', 'schwerpunkt', 'fokus'],
    d: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><path d="M12 11.95v.1"/>' },

  // ---- Zustand ----
  { name: 'warnung', auch: ['achtung', 'fehler'],
    d: '<path d="M12 4 21 20H3z"/><path d="M12 10v4"/><path d="M12 17.2v.1"/>' },
  { name: 'hinweis', auch: ['info', 'erklaerung'],
    d: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11.5V16"/><path d="M12 8.2v.1"/>' },
  { name: 'kasten', auch: ['offen', 'unerledigt', 'kaestchen'],
    d: '<rect x="4.5" y="4.5" width="15" height="15" rx="2"/>' },
  { name: 'schloss', auch: ['gesichert', 'anmeldung', 'privat'],
    d: '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>' },
  { name: 'auge', auch: ['anzeigen', 'sichtbar'],
    d: '<path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>' },
  { name: 'auge-zu', auch: ['verbergen', 'unsichtbar'],
    d: '<path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/><path d="M4.5 19.5 19.5 4.5"/>' },

  // ---- Umgebung ----
  { name: 'haus', auch: ['start', 'uebersicht'],
    d: '<path d="M3.5 10.8 12 4l8.5 6.8"/><path d="M5.8 10v10.5h12.4V10"/>' },
  { name: 'person', auch: ['profil', 'konto', 'nutzer'],
    d: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20.5a7 7 0 0 1 14 0"/>' },
  { name: 'abmelden', auch: ['ausloggen', 'verlassen'],
    d: '<path d="M14.5 4.5H5.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h9"/><path d="M11 12h9.5"/><path d="M17 8.5 20.5 12 17 15.5"/>' },
  { name: 'sonne', auch: ['hell', 'tagmodus'],
    d: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>' },
  { name: 'mond', auch: ['dunkel', 'nachtmodus'],
    d: '<path d="M20 14.2A8.6 8.6 0 0 1 9.8 4 8.6 8.6 0 1 0 20 14.2z"/>' },
] as const satisfies readonly Symbol[];

export type SymbolName = (typeof SYMBOLE)[number]['name'];
