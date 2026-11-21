import { SuiteBar } from '@suite/design-system';

export function VolleLeiste() {
  return (
    <SuiteBar
      apps={[
        { label: 'Start', href: '#' },
        { label: 'School Organizer', href: '#', current: true },
        { label: 'Lernen-App', href: '#' },
        { label: 'Finanzkompass', href: '#' },
      ]}
      privateArea={{ label: 'Ausbildungsbereich', href: '#' }}
    />
  );
}

export function MitNochNichtVerfuegbarem() {
  return (
    <SuiteBar
      apps={[
        { label: 'Start', href: '#', current: true },
        { label: 'School Organizer', href: '#' },
        { label: 'Lernen-App', href: null },
        { label: 'Finanzkompass', href: null },
      ]}
      privateArea={{ label: 'Ausbildungsbereich', href: '#' }}
    />
  );
}
