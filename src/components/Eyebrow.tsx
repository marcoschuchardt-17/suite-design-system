import type { ReactNode } from 'react';

export interface EyebrowProps {
  children: ReactNode;
}

/**
 * Kleine Überzeile über einer Überschrift. Versalien, weite Laufweite,
 * Sekundärfarbe — ordnet ein, ohne der Überschrift Aufmerksamkeit zu nehmen.
 */
export function Eyebrow({ children }: EyebrowProps) {
  return <p className="eyebrow">{children}</p>;
}
