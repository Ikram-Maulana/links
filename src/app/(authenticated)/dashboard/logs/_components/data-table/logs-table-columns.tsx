"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import {
  type selectLinkSchema,
  type selectLogSchema,
} from "@/server/db/schema";
import { type z } from "zod";
import UserAgentAccordion from "./user-agent-accordion";

type Logs = z.infer<typeof selectLogSchema>;
type Links = z.infer<typeof selectLinkSchema>;

export function getColumns(): ColumnDef<{
  logs: Logs;
  links: Links | null;
}>[] {
  return [
    {
      accessorKey: "linkTitle",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Link Title" />
      ),
      cell: ({ row }) => {
        const linkTitle = row.original.links?.title
          ? row.original.links.title
          : null;

        if (linkTitle) {
          return linkTitle;
        } else {
          return "Invalid Link";
        }
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "ipAddress",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="IP Address"
          className="text-xs"
        />
      ),
      cell: ({ row }) => {
        const ipAddress = row.original.logs.ipAddress
          ? row.original.logs.ipAddress
          : null;

        if (ipAddress) {
          return (
            <a
              href={`https://ipinfo.io/${ipAddress}`}
              target="_blank"
              rel="noopener"
              className="font-medium text-blue-500 hover:underline hover:underline-offset-4"
            >
              {ipAddress}
            </a>
          );
        } else {
          return "Invalid IP Address";
        }
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "userAgent",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="User Agent"
          className="text-xs"
        />
      ),
      cell: ({ row }) => {
        const userAgent = row.original.logs.userAgent
          ? row.original.logs.userAgent
          : null;

        if (userAgent) {
          return (
            <UserAgentAccordion
              userAgent={userAgent}
              key={`user-agent-${row.id}`}
            />
          );
        } else {
          return "Invalid User Agent";
        }
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "referer",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Referer"
          className="text-xs"
        />
      ),
      cell: ({ row }) => {
        const referer = row.original.logs.referer
          ? new URL(row.original.logs.referer)
          : null;

        if (referer) {
          return (
            <a
              href={referer.href}
              target="_blank"
              rel="noopener"
              className="font-medium text-blue-500 hover:underline hover:underline-offset-4"
            >
              {referer.hostname}
            </a>
          );
        } else {
          return "Invalid URL";
        }
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "platform",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Platform" />
      ),
      cell: ({ row }) => {
        const platform = row.original.logs.platform
          ? row.original.logs.platform
          : null;

        if (platform) {
          return platform;
        } else {
          return "Invalid Platform";
        }
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Time Clicked"
          className="text-xs"
        />
      ),
      cell: ({ row }) => {
        const date = row.original.logs.createdAt
          ? new Date(row.original.logs.createdAt)
          : null;

        if (date) {
          const day = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();
          const hours = date.getHours();
          const minutes = date.getMinutes();

          const monthNames = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
          ];

          const formattedDate = `${day} ${monthNames[month]} ${year}`;
          const formattedTime = `${hours.toString().padStart(2, "0")}.${minutes.toString().padStart(2, "0")} WIB`;

          return `${formattedDate} ${formattedTime}`;
        } else {
          return "Invalid Date";
        }
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
