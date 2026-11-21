export interface SuiteApp {
  label: string;
  /** Fehlt die Adresse, erscheint der Dienst als „in Arbeit" statt als toter Link. */
  href?: string | null;
  current?: boolean;
}

export interface SuiteBarProps {
  apps: SuiteApp[];
  /** Verweis auf den angemeldeten Bereich, rechtsbündig. */
  privateArea?: { label: string; href: string; hint?: string };
  label?: string;
}

/**
 * Gemeinsame Leiste über allen Suite-Anwendungen. Verlinkt nur — kein
 * Datenabruf, keine gemeinsame Datenbank.
 *
 * Ein Dienst ohne Adresse wird ausgegraut und trägt den Zustand im Text
 * („in Arbeit"), nicht in der Deckkraft: Abdunkeln verfehlt den Kontrast und
 * ist für Screenreader unsichtbar.
 */
export function SuiteBar({ apps, privateArea, label = 'Meine Anwendungen' }: SuiteBarProps) {
  return (
    <nav className="suite-bar" aria-label={label}>
      <div className="suite-bar__inner">
        <span className="suite-bar__label">{label}</span>
        <ul className="suite-bar__list">
          {apps.map((a) => (
            <li key={a.label}>
              {a.href ? (
                <a href={a.href} aria-current={a.current ? 'page' : undefined}>{a.label}</a>
              ) : (
                <span className="suite-bar__soon">
                  {a.label}
                  <span className="suite-bar__tag">in Arbeit</span>
                </span>
              )}
            </li>
          ))}
        </ul>
        {privateArea ? (
          <a className="suite-bar__private" href={privateArea.href}>
            {privateArea.label}
            <span className="suite-bar__lock" aria-hidden="true">&bull;</span>
            <span className="suite-bar__hint">{privateArea.hint ?? 'Anmeldung'}</span>
          </a>
        ) : null}
      </div>
    </nav>
  );
}
