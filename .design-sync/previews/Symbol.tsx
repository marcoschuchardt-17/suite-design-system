import { Symbol, SYMBOL_NAMEN, Button, Actions } from '@suite/design-system';
import type { SymbolName } from '@suite/design-system';

export function DerGanzeSatz() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.7rem 1.25rem' }}>
      {SYMBOL_NAMEN.map((n) => (
        <span key={n} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.88rem', color: 'var(--suite-muted-strong)' }}>
          <Symbol name={n as SymbolName} />
          {n}
        </span>
      ))}
    </div>
  );
}

export function NebenText() {
  return (
    <p style={{ display: 'flex', alignItems: 'center', gap: '.5rem', margin: 0, color: 'var(--suite-ink)' }}>
      <Symbol name="kalender" />
      Nächster Termin am 3. September
    </p>
  );
}

export function InSchaltflaechen() {
  return (
    <Actions>
      <Button href="#"><Symbol name="plus" /> Eintrag anlegen</Button>
      <Button href="#" variant="secondary"><Symbol name="herunterladen" /> Export</Button>
    </Actions>
  );
}

export function Groessen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--suite-accent)' }}>
      <Symbol name="uhr" groesse={16} />
      <Symbol name="uhr" groesse={20} />
      <Symbol name="uhr" groesse={24} />
      <Symbol name="uhr" groesse={32} />
    </div>
  );
}
