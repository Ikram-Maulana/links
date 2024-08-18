export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  placeholder?: string;
}
