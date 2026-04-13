import { ColumnDef } from "@tanstack/react-table";

export const generateColumns = (headers: string[]): ColumnDef<any>[] => {
  return headers.map((header) => ({
    accessorKey: header,
    header: header,
    cell: ({ row }: any) => row.getValue(header) || "-",
  }));
};
