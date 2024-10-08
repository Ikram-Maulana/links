"use client";

import type { DataTableSearchableColumn, LinkWithClicked } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import { Badge } from "@/components/ui/badge";
import { LinkTableActions } from "./link-table-actions";
import { PublishedSwitch } from "./published-switch";

type Links = LinkWithClicked;

export function getColumns(): ColumnDef<Links>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Title"
          className="[&>button]:ml-0"
        />
      ),
      cell: ({ row }) => (
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener"
          className="pl-3 font-medium text-blue-500 hover:underline hover:underline-offset-4"
        >
          {row.original.title}
        </a>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "slug",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Slug"
          className="text-xs"
        />
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: "clicked",
      accessorKey: "clicked",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Clicked"
          className="text-xs"
        />
      ),
      cell: ({ row }) => (
        <Badge variant={"outline"}>{row.original.clicked} Clicks</Badge>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "is_published",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Published"
          className="text-xs"
        />
      ),
      cell: ({ row }) => {
        return (
          <PublishedSwitch
            id={row.original.id}
            checked={row.original.isPublished}
            key={`published-${row.original.id}`}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      cell: ({ row }) => <LinkTableActions row={row} />,
    },
  ];
}

export const searchableColumns: DataTableSearchableColumn<Links>[] = [
  {
    id: "title",
    placeholder: "Search Link Title...",
  },
];
