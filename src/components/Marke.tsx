import { MARKEN } from '../icons/marken';
import type { MarkenName } from '../icons/marken';

const NACH_NAME = new Map(MARKEN.map((m) => [m.name, m]));

export interface MarkeProps {
  name: MarkenName;
  /** Kantenlänge in px. 24 in Kopfzeilen, 36–48 auf Anmeldeseiten. */
  groesse?: number;
  /**
   * Steht die Marke allein, ist der Anwendungsname ihr zugänglicher Name.
   * Steht der Name daneben, `false` setzen — sonst liest ein Screenreader
   * alles doppelt.
   */
  beschriftet?: boolean;
}

/**
 * Zeichen einer Suite-Anwendung (MAR-89).
 *
 * Dieselbe Geometrie wie der Symbolsatz — 24er-Raster, 20er Nutzfläche, 2px
 * Kontur, `currentColor`. Marke und Symbole gehören dadurch sichtbar zusammen.
 */
export function Marke({ name, groesse = 24, beschriftet = true }: MarkeProps) {
  const m = NACH_NAME.get(name);
  if (!m) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={groesse}
      height={groesse}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={beschriftet ? 'img' : undefined}
      aria-label={beschriftet ? m.titel : undefined}
      aria-hidden={beschriftet ? undefined : true}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: m.d }}
    />
  );
}

export const MARKEN_NAMEN = MARKEN.map((m) => m.name);
