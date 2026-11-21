import { Status } from '@suite/design-system';

export function Live() { return <Status state="live">Im Einsatz</Status>; }
export function InArbeit() { return <Status state="building">In Arbeit</Status>; }
export function Geplant() { return <Status state="planned">Geplant</Status>; }

export function AlleDrei() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
      <Status state="live">Im Einsatz</Status>
      <Status state="building">In Arbeit</Status>
      <Status state="planned">Geplant</Status>
    </div>
  );
}
