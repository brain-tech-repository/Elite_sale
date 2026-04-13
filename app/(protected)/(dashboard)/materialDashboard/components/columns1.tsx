import { ColumnDef } from "@tanstack/react-table";

export type SKU = {
  material_code: string;
  material_description: string;
};

export const skuColumns: ColumnDef<SKU>[] = [
  {
    header: "Material Code",
    accessorKey: "material_code",
    cell: ({ row }) => {
      return row.original.material_code || "-";
    },
  },
  {
    header: "Description",
    accessorKey: "material_description",
    cell: ({ row }) => {
      const desc = row.original.material_description;

      return desc ? (
        <span className={desc.includes("DO NOT USE") ? "" : ""}>{desc}</span>
      ) : (
        "-"
      );
    },
  },
];
