export type SearchParams = Record<string, string | string[] | undefined>;

export interface DataTableSearchableColumn<TData> {
  id: keyof TData;
  placeholder?: string;
}
