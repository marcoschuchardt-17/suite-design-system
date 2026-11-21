import type { ReactNode } from 'react';

export interface CurrentListProps {
  /** `when` ist die linke, tabellarisch gesetzte Zeitspalte. */
  items: Array<{ when: string; what: ReactNode }>;
}

/**
 * Verlaufsliste mit Zeitspalte. Zahlen laufen tabellarisch, damit die Spalte
 * ruhig steht. Ab 560px fällt die Zeit über den Text.
 */
export function CurrentList({ items }: CurrentListProps) {
  return (
    <ul className="current">
      {items.map((i, n) => (
        <li key={n}>
          <span className="when">{i.when}</span>
          <span>{i.what}</span>
        </li>
      ))}
    </ul>
  );
}
