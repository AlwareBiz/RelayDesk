import { useState } from 'react';

// ********************************************************************************
// == Type ========================================================================
export type DialogDisclosure = ReturnType<typeof useDialogDisclosure>;

// == Hook ========================================================================
export const useDialogDisclosure = () => {
 // -- State ---------------------------------------------------------------------
 const [isDialogOpen, setIsDialogOpen] = useState(false);

 // -- Handler -------------------------------------------------------------------
 const handleCloseDialog = () => {
  setIsDialogOpen(false);
 };

 const handleOpenDialog = () => {
  setIsDialogOpen(true);
 };

 return { handleCloseDialog, handleOpenDialog, isDialogOpen };
};
