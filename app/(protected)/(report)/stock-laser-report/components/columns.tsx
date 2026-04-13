import { ColumnDef } from "@tanstack/react-table";
import { PerformanceRow } from "../types";

const formatNumber = (value: any) => {
  if (value === null || value === undefined || value === "") return "0";
  const num = parseFloat(String(value).replace(/,/g, ""));
  if (isNaN(num)) return "0";
  return Math.floor(num).toLocaleString("en-IN");
};

// Define types for visibility mapping
type MultipleUOMMap = Record<string, string>;

// ✅ Sum helper
const sumColumn = (data: any[], key: string) => {
  return data.reduce((acc, row) => {
    const val = parseFloat(row[key]) || 0;
    return acc + val;
  }, 0);
};

// ❌ REMOVE footer from common number columns
const createNumberColumn = (
  key: string,
  label: string,
): ColumnDef<PerformanceRow> => ({
  accessorKey: key,
  header: label,

  cell: ({ row }) => formatNumber(row.original[key as keyof PerformanceRow]),
});

// Unique key for complex column
const COMPLEX_HEADER_ID = "complex_header";

// Multiple UOM mapping
const multipleUOMMap: MultipleUOMMap = {
  ctn: "Ctn",
  dzn: "Dzn",
  pcs: "Pcs",
};

export const performanceColumns: ColumnDef<PerformanceRow>[] = [
  // ✅ Material Code with "Total"
  {
    accessorKey: "material_code",
    header: "Material Code",
    footer: () => (
      <div className="font-bold text-center"> Total Closing Value</div>
    ),
  },

  {
    accessorKey: "material_name",
    header: "Material Name",
  },
  {
    accessorKey: "uom",
    header: "UOM",
  },

  createNumberColumn("unit_price", "Unit Price"),
  createNumberColumn("opening_qty", "Opening Qty"),
  createNumberColumn("receipt_qty", "Receipt Qty"),
  createNumberColumn("issued_qty", "Issued Qty"),
  createNumberColumn("closing_qty", "Closing Qty"),

  // ✅ ONLY THIS COLUMN HAS TOTAL
  {
    accessorKey: "closing_value",
    header: "Closing Value",

    cell: ({ row }) => formatNumber(row.original.closing_value),

    footer: ({ table }) => {
      const total = sumColumn(table.options.data, "closing_value");

      return <div className="font-bold text-center">{formatNumber(total)}</div>;
    },
  },

  createNumberColumn("packing_size", "Packing Size"),

  // 🔥 Complex column (unchanged)
  {
    id: COMPLEX_HEADER_ID,
    header: () => (
      <div className="text-center" style={{ borderCollapse: "separate" }}>
        <div>Closing Stock in Multiple UOM</div>

        <div
          style={{
            borderTop: "1px solid white",
            marginTop: "4px",
            marginBottom: "4px",
          }}
        />

        <div className="grid grid-cols-3 gap-1">
          {Object.entries(multipleUOMMap).map(([key, label]) => (
            <div key={key} className="text-xs px-2 text-center">
              {label}
            </div>
          ))}
        </div>
      </div>
    ),

    accessorKey: "ctn",

    cell: ({ row }) => {
      return (
        <div className="grid grid-cols-3 gap-x-2 text-center">
          <div className="border-r pr-1">{formatNumber(row.original.ctn)}</div>
          <div className="border-r border-white/20 px-1">
            {formatNumber(row.original.dzn)}
          </div>
          <div className="pl-1">{formatNumber(row.original.pcs)}</div>
        </div>
      );
    },
  },
];
