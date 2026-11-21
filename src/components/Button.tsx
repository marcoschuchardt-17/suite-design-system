import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** `secondary` ist der ruhige Zweitrang: transparent mit Rahmen statt gefüllt. */
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

/**
 * Aktion des Designsystems. Genau ein Akzent — die Primärvariante trägt ihn,
 * die Sekundärvariante bleibt transparent. Radius .625rem, bewusst keine Pille.
 */
export function Button({ variant = 'primary', children, className, ...rest }: ButtonProps) {
  const cls = ['button', variant === 'secondary' ? 'secondary' : '', className].filter(Boolean).join(' ');
  // inline-flex statt inline-block: sonst sitzt ein <Symbol> im Button auf der
  // Grundlinie und der Text rutscht dagegen nach unten.
  return (
    <a className={cls} style={{ display: 'inline-flex', alignItems: 'center', gap: '.45rem' }} {...rest}>
      {children}
    </a>
  );
}
