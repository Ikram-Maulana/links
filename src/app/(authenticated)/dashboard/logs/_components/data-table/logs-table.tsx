"use client";

import { type ColumnDef } from "@tanstack/react-table";
import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";

import {
  type selectLinkSchema,
  type selectLogSchema,
} from "@/server/db/schema";
import { type z } from "zod";
import { getColumns } from "./logs-table-columns";

type Logs = z.infer<typeof selectLogSchema>;
type Links = z.infer<typeof selectLinkSchema>;
type getLogsType = {
  data: {
    logs: Logs;
    links: Links | null;
  }[];
  pageCount: number;
};

interface LogsTableProps {
  logs: getLogsType;
}

export function LogsTable({ logs }: LogsTableProps) {
  const { data, pageCount } = logs;

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<
    ColumnDef<
      {
        logs: Logs;
        links: Links | null;
      },
      unknown
    >[]
  >(() => getColumns(), []);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  });

  return <DataTable table={table} columns={columns} />;
}
