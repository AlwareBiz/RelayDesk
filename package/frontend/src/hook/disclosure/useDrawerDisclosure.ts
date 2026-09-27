import { useState } from 'react';

// ********************************************************************************
// == Type ========================================================================
export type DrawerDisclosure = ReturnType<typeof useDrawerDisclosure>;

// == Hook ========================================================================
export const useDrawerDisclosure = () => {
 // -- State ---------------------------------------------------------------------
 const [isDrawerOpen, setIsDrawerOpen] = useState(false);

 // -- Handler -------------------------------------------------------------------
 const onDrawerClose = () => {
  setIsDrawerOpen(false);
 };

 const onDrawerOpen = () => {
  setIsDrawerOpen(true);
 };

 return { isDrawerOpen, onDrawerClose, onDrawerOpen };
};
