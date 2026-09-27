import { useState, type MouseEvent } from 'react';

// ********************************************************************************
// == Type ========================================================================
export type MenuDisclosure = ReturnType<typeof useMenuDisclosure>;

// == Hook ========================================================================
export const useMenuDisclosure = () => {
 // -- State ---------------------------------------------------------------------
 const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

 // -- Handler -------------------------------------------------------------------
 const handleCloseMenu = () => {
  setMenuAnchor(null);
 };

 const handleOpenMenu = (anchor: HTMLElement | MouseEvent<HTMLElement>) => {
  setMenuAnchor(anchor instanceof HTMLElement ? anchor : anchor.currentTarget);
 };

 return { handleCloseMenu, handleOpenMenu, isMenuOpen: Boolean(menuAnchor), menuAnchor };
};
