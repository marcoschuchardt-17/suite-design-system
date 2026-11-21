import type { ReactNode } from 'react';

export interface NoteProps {
  children: ReactNode;
}

/**
 * Hinweisbox für Einschränkungen und Zwischenstände. Gestrichelter Rahmen —
 * sichtbar vorläufig, ohne eine Signalfarbe zu verbrauchen.
 */
export function Note({ children }: NoteProps) {
  return <div className="note">{children}</div>;
}
