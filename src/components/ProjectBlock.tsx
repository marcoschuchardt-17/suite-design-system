import type { ReactNode } from 'react';

export interface ProjectBlockProps {
  title: string;
  /** Erscheint in der linken Spalte unter dem Titel. */
  status?: ReactNode;
  /** Technikstichworte, bewusst klein und sekundär. */
  stack?: string;
  /** Paare aus Frage und Antwort — Problem, Lösung, Stand. */
  entries: Array<{ term: string; description: ReactNode }>;
}

/**
 * Ein Projekt, gestapelt statt als Feature-Kachel: zweispaltig auf breiten
 * Viewports, einspaltig ab 700px. Beschreibungen laufen in der Lese-Schrift.
 */
export function ProjectBlock({ title, status, stack, entries }: ProjectBlockProps) {
  return (
    <article className="project">
      <div className="aside">
        <h3>{title}</h3>
        {status}
        {stack ? <p className="stack">{stack}</p> : null}
      </div>
      <dl>
        {entries.map((e) => (
          <div key={e.term}>
            <dt>{e.term}</dt>
            <dd>{e.description}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
