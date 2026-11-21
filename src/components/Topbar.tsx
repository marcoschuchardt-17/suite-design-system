export interface TopbarProps {
  wordmark: string;
  wordmarkHref?: string;
  links?: Array<{ label: string; href: string }>;
}

/** Kopfzeile: Wortmarke links, Navigation rechts, umbricht auf schmal. */
export function Topbar({ wordmark, wordmarkHref = '/', links = [] }: TopbarProps) {
  return (
    <header className="topbar">
      <a className="wordmark" href={wordmarkHref}>{wordmark}</a>
      {links.length ? (
        <nav className="topnav">
          {links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>
      ) : null}
    </header>
  );
}
