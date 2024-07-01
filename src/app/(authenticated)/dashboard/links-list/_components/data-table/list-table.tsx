"use client";

import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";

import { type list } from "@/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { getColumns, searchableColumns } from "./list-table-columns";

type List = InferSelectModel<typeof list>;
type getListType = {
  data: List[];
  pageCount: number;
};

interface ListTableProps {
  list: getListType;
}

export function ListTable({ list }: ListTableProps) {
  const { data, pageCount } = list;

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<List, unknown>[]>(
    () => getColumns(),
    [],
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    searchableColumns,
  });

  return (
    <DataTable
      table={table}
      columns={columns}
      searchableColumns={searchableColumns}
    />
  );
}
