export type StatusState = 'live' | 'building' | 'planned';

export interface StatusProps {
  /** `live` gefüllt, `building` hohl mit kräftigem Rand, `planned` hohl und blass. */
  state?: StatusState;
  children: React.ReactNode;
}

/**
 * Zustandsanzeige mit Punkt. Der Zustand steckt im Text, nicht in der
 * Deckkraft — der Punkt ist die Verstärkung, nicht der einzige Träger.
 */
export function Status({ state = 'live', children }: StatusProps) {
  const cls = ['status', state === 'live' ? '' : state].filter(Boolean).join(' ');
  return (
    <span className={cls}>
      <span className="dot" aria-hidden="true" />
      {children}
    </span>
  );
}
