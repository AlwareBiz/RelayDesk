export type TableTypes<Row, OptionalOnInsert extends keyof Row> = {
 Insert: Omit<Row, OptionalOnInsert> & Partial<Pick<Row, OptionalOnInsert>>;
 Row: Row;
 Update: Partial<Row>;
};
