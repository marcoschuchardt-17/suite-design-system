import { SYMBOLE } from '../icons/pfade';
import type { SymbolName } from '../icons/pfade';

const NACH_NAME = new Map(SYMBOLE.map((s) => [s.name, s.d]));

export interface SymbolProps {
  name: SymbolName;
  /**
   * Kantenlänge in px. 20 steht ruhig neben Fließtext, 24 neben Überschriften,
   * 14 in dichten Rastern — Tabellenzellen, Stundenplan, Listenzeilen, wo der
   * Text selbst schon auf .75rem steht. Drei Stufen, keine Zwischenwerte.
   */
  groesse?: number;
  /**
   * Nur setzen, wenn das Symbol allein steht. Fehlt daneben ein Text, braucht
   * es einen — sonst ist die Schaltfläche für Screenreader stumm. Steht ein
   * Text daneben, weglassen: sonst liest der Screenreader alles doppelt.
   */
  titel?: string;
}

/**
 * Symbol aus dem Suite-Satz (MAR-89).
 *
 * 24er-Raster, 20er Nutzfläche, 2px Kontur, `currentColor` — das Symbol nimmt
 * also die Textfarbe an und stimmt in hell wie dunkel ohne Zutun.
 *
 * Eingebettet statt nachgeladen: eine Symbolschrift oder ein CDN wäre bei
 * jedem Seitenaufruf eine Verbindung zu einem Dritten.
 */
export function Symbol({ name, groesse = 20, titel }: SymbolProps) {
  const d = NACH_NAME.get(name);
  if (!d) return null;
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
      role={titel ? 'img' : undefined}
      aria-label={titel}
      aria-hidden={titel ? undefined : true}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
}

/** Alle Namen des Satzes — für Übersichten und Auswahlfelder. */
export const SYMBOL_NAMEN = SYMBOLE.map((s) => s.name);
