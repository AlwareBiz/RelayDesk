import { FiActivity, FiEdit2, FiLogOut, FiMenu, FiTrash2, FiUser } from 'react-icons/fi';
import { PiTranslate } from 'react-icons/pi';

// ********************************************************************************
// == Constant ====================================================================
export const appIcons = {
 delete: <FiTrash2 />,
 edit: <FiEdit2 />,
 language: <PiTranslate />,
 logout: <FiLogOut />,
 menu: <FiMenu />,
 overview: <FiActivity />,
 profile: <FiUser />,
} as const;
