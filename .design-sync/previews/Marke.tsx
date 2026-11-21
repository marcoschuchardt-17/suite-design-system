import { Marke, MARKEN, Topbar } from '@suite/design-system';
import type { MarkenName } from '@suite/design-system';

export function AlleVier() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.75rem' }}>
      {MARKEN.map((m) => (
        <span key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', color: 'var(--suite-accent)' }}>
          <Marke name={m.name as MarkenName} groesse={32} beschriftet={false} />
          <span style={{ color: 'var(--suite-ink)', fontWeight: 600, fontSize: '.95rem' }}>{m.titel}</span>
        </span>
      ))}
    </div>
  );
}

export function InDerKopfzeile() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', color: 'var(--suite-accent)' }}>
      <Marke name="school-organizer" groesse={24} beschriftet={false} />
      <span style={{ color: 'var(--suite-ink)', fontWeight: 800, letterSpacing: '-.02em' }}>School Organizer</span>
    </div>
  );
}

export function KleinsteGroessen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--suite-accent)' }}>
      {[16, 20, 24, 32, 48].map((g) => (
        <Marke key={g} name="finanzkompass" groesse={g} beschriftet={false} />
      ))}
    </div>
  );
}
