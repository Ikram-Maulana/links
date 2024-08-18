"use client";

import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";

import { type links } from "@/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { getColumns, searchableColumns } from "./link-table-columns";

type Links = InferSelectModel<typeof links>;
type getLinksType = {
  data: Links[];
  pageCount: number;
};

interface LinksTableProps {
  links: getLinksType;
}

export function LinksTable({ links }: LinksTableProps) {
  const { data, pageCount } = links;

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<Links, unknown>[]>(
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
