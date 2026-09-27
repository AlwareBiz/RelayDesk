import type { CSSProperties, FC, PropsWithChildren } from 'react';

// ********************************************************************************
// == Type ========================================================================
type Props = { id?: string; } & PropsWithChildren & Partial<CSSProperties>;

// == Component ===================================================================
export const Center: FC<Props> = ({ children, id = '', ...props }) =>
 <div id={id} style={{ alignItems: 'center', display: 'flex', gap: '1em', justifyContent: 'center', textAlign: 'center', ...props }}>
  {children}
 </div>;
