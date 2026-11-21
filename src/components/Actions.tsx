import type { ReactNode } from 'react';

export interface ActionsProps {
  children: ReactNode;
}

/** Zeile aus Buttons. Umbricht auf schmalen Viewports statt zu überlaufen. */
export function Actions({ children }: ActionsProps) {
  return <div className="actions">{children}</div>;
}
