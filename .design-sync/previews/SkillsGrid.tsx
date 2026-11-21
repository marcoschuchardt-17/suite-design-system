import { SkillsGrid } from '@suite/design-system';

export function Kompetenzen() {
  return (
    <SkillsGrid
      groups={[
        { title: 'Backend', items: ['PHP & Laravel', 'PostgreSQL', 'Queues & Jobs'] },
        { title: 'Frontend', items: ['Blade & Alpine', 'Tailwind', 'Barrierefreiheit'] },
        { title: 'Betrieb', items: ['Docker', 'Dokploy & Traefik', 'CI mit GitHub Actions'] },
      ]}
    />
  );
}
