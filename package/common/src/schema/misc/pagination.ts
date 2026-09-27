import * as yup from 'yup';

// ********************************************************************************
// == Constant ====================================================================
export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

// == Schema ======================================================================
export const paginationSchema = yup.object({
 limit: yup.number().integer().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
 offset: yup.number().integer().min(0).default(0),
});

// == Type ========================================================================
export type Pagination = yup.InferType<typeof paginationSchema>;
