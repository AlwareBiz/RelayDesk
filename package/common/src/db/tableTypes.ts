export type TableTypes<Row, OptionalOnInsert extends keyof Row> = {
 Row: Row;
 Insert: Omit<Row, OptionalOnInsert> & Partial<Pick<Row, OptionalOnInsert>>;
 Update: Partial<Row>;
};
