import { ProjectBlock, Status } from '@suite/design-system';

export function EinProjekt() {
  return (
    <ProjectBlock
      title="School Organizer"
      status={<Status state="live">Im Einsatz</Status>}
      stack="Laravel · Blade · Tailwind"
      entries={[
        { term: 'Problem', description: 'Berichtsheft, Stundenplan und Termine lagen in drei getrennten Systemen.' },
        { term: 'Lösung', description: 'Eine Anwendung, die alles zusammenführt — mit Export für die Berufsschule.' },
        { term: 'Stand', description: 'Seit Februar 2026 im täglichen Einsatz.' },
      ]}
    />
  );
}

export function ZweiUntereinander() {
  return (
    <div>
      <ProjectBlock
        title="Lernen-App"
        status={<Status state="building">In Arbeit</Status>}
        stack="Laravel · Alpine"
        entries={[{ term: 'Ziel', description: 'Karteikarten und Prüfungssimulation für die Abschlussprüfung.' }]}
      />
      <ProjectBlock
        title="Finanzkompass"
        status={<Status state="planned">Geplant</Status>}
        stack="Laravel · Livewire"
        entries={[{ term: 'Ziel', description: 'Konten, Budgets und Liquiditätsvorschau an einem Ort.' }]}
      />
    </div>
  );
}
