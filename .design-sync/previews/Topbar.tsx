import { Topbar } from '@suite/design-system';

export function MitNavigation() {
  return (
    <Topbar
      wordmark="Marco Schuchardt"
      links={[
        { label: 'Projekte', href: '#' },
        { label: 'Aktuell', href: '#' },
        { label: 'Kontakt', href: '#' },
      ]}
    />
  );
}

export function NurWortmarke() {
  return <Topbar wordmark="Marco Schuchardt" />;
}
