import { CurrentList } from '@suite/design-system';

export function Verlauf() {
  return (
    <CurrentList
      items={[
        { when: 'Aug 2026', what: 'Suite-Designsystem über alle Projekte vereinheitlicht' },
        { when: 'Juli 2026', what: 'Finanzkompass auf Dokploy deployt' },
        { when: 'Mai 2026', what: 'Lernen-App um den Prüfungsmodus erweitert' },
        { when: 'Feb 2026', what: 'School Organizer im täglichen Einsatz' },
      ]}
    />
  );
}
