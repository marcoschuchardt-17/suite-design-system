import { Button, Actions } from '@suite/design-system';

export function Aktionszeile() {
  return (
    <Actions>
      <Button href="#">Schreib mir</Button>
      <Button href="#" variant="secondary">GitHub</Button>
      <Button href="#" variant="secondary">Impressum</Button>
    </Actions>
  );
}
