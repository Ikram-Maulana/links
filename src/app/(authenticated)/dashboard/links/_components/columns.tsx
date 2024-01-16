"use client";

import { type linksList } from "@/server/db/schema";
import { type ColumnDef } from "@tanstack/react-table";
import { type InferSelectModel } from "drizzle-orm";
import Image from "next/image";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-action";

type TLinks = InferSelectModel<typeof linksList>;

export const columns: ColumnDef<TLinks>[] = [
  {
    id: "Gambar",
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gambar" />
    ),
    cell: ({ row }) =>
      row.original.image ? (
        <a href={row.original.image} target="_blank" rel="noopener noreferrer">
          <Image
            src={row.original.image}
            alt={row.original.title}
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "100%",
              maxWidth: "50px",
              height: "auto",
              maxHeight: "50px",
            }}
            className="cursor-pointer rounded-lg object-cover"
          />
        </a>
      ) : (
        <div className="flex h-[40px] w-[50px] items-center justify-center">
          -
        </div>
      ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "Link Title",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Link Title" />
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "Slug",
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
    cell: ({ row }) => (
      <a
        href={`/s/${row.original.slug}`}
        className="text-blue-500 hover:underline"
        target="_blank"
      >
        s/{row.original.slug}
      </a>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "URL",
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
