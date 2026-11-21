import { Button, Actions } from '@suite/design-system';

export function Primaer() {
  return <Actions><Button href="#">Projekte ansehen</Button></Actions>;
}

export function Sekundaer() {
  return <Actions><Button href="#" variant="secondary">Lebenslauf</Button></Actions>;
}

export function Nebeneinander() {
  return (
    <Actions>
      <Button href="#">Projekte ansehen</Button>
      <Button href="#" variant="secondary">Kontakt aufnehmen</Button>
    </Actions>
  );
}
