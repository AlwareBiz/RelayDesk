import type { CSSProperties, FC, PropsWithChildren } from 'react';

// ********************************************************************************
// == Type ========================================================================
type Props = { id?: string; } & PropsWithChildren & Partial<CSSProperties>;

// == Component ===================================================================
export const Flex: FC<Props> = ({ children, id = '', ...props }) =>
 <div id={id} style={{ display: 'flex', gap: '1em', ...props }}>
  {children}
 </div>;
