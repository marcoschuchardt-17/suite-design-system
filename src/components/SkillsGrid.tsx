export interface SkillsGridProps {
  groups: Array<{ title: string; items: string[] }>;
}

/** Kompetenzraster. Spalten fließen automatisch ab 220px Mindestbreite. */
export function SkillsGrid({ groups }: SkillsGridProps) {
  return (
    <div className="skills">
      {groups.map((g) => (
        <div key={g.title}>
          <h3>{g.title}</h3>
          <ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}
