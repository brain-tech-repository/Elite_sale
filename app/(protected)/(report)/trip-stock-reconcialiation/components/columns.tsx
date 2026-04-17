import { ColumnDef } from "@tanstack/react-table";
import { PerformanceRow } from "../types";

const formatNumber = (value: any) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const numCol = (
  key: keyof PerformanceRow,
  label: string,
): ColumnDef<PerformanceRow> => ({
  accessorKey: key,
  header: label,
  cell: ({ row }) => (
    <div className="text-right">{formatNumber(row.original[key])}</div>
  ),
});

export const performanceColumns: ColumnDef<PerformanceRow>[] = [
  /* PARAMETERS */
  {
    id: "parameters_root",
    header: () => <div className="text-center w-full">PARAMETERS</div>,
    columns: [
      {
        id: "parameters_totals",
        header: () => <div className="text-center w-full">Totals</div>,
        columns: [
          { accessorKey: "material_code", header: "Material Code" },
          { accessorKey: "material_name", header: "Material Name" },
          numCol("pcs_in_carton", "Pcs In Carton"),
          numCol("unit_price", "Unit Selling Price"),
        ],
      },
    ],
  },

  /* LOADING */
  {
    id: "loading_root",
    header: () => <div className="text-center w-full">LOADING</div>,
    columns: [
      {
        id: "loading_summary",
        header: () => <div className="text-right w-full">22,473,268.00</div>,
        columns: [
          numCol("loaded_qty", "Loaded Qty (Pcs)"),
          numCol("loaded_ctn", "Ctn"),
          numCol("loaded_dzn", "Dzn"),
          numCol("loaded_pcs", "Pcs"),
          numCol("loaded_value", "Loaded Value"),
        ],
      },
    ],
  },

  /* SALES */
  {
    id: "sales_root",
    header: () => <div className="text-center w-full">SALES</div>,
    columns: [
      {
        id: "sales_summary",
        header: () => <div className="text-right w-full">299,174.00</div>,
        columns: [
          numCol("sold_qty", "Sold Qty (Pcs)"),
          numCol("sold_ctn", "Ctn"),
          numCol("sold_dzn", "Dzn"),
          numCol("sold_pcs", "Pcs"),
          numCol("sold_value", "Sold Value"),
        ],
      },
    ],
  },

  /* CUSTOMER RETURNS */
  {
    id: "returns_root",
    header: () => <div className="text-center w-full">CUSTOMER RETURNS</div>,
    columns: [
      {
        id: "good_returns_summary",
        header: () => <div className="text-right w-full">0.00</div>,
        columns: [
          numCol("good_qty", "Good Qty (Pcs)"),
          numCol("good_ctn", "Ctn"),
          numCol("good_dzn", "Dzn"),
          numCol("good_pcs", "Pcs"),
          numCol("return_value", "Return Value"),
        ],
      },
      {
        id: "bad_returns_summary",
        header: () => <div className="text-right w-full">0.00</div>,
        columns: [
          numCol("bad_qty", "Bad Qty (Pcs)"),
          numCol("bad_ctn", "Ctn"),
          numCol("bad_dzn", "Dzn"),
          numCol("bad_pcs", "Pcs"),
          numCol("bad_value", "Bad Value"),
        ],
      },
      {
        id: "customer_total_summary",
        header: () => <div className="text-right w-full">0.00</div>,
        columns: [numCol("total_customer", "Total Customer")],
      },
    ],
  },

  /* VAN DAMAGED STOCK */
  {
    id: "damaged_root",
    header: () => <div className="text-center w-full">VAN DAMAGED STOCK</div>,
    columns: [
      {
        id: "damaged_summary",
        header: () => <div className="text-right w-full">0.00</div>,
        columns: [
          numCol("damage_qty", "Damages Qty (Pcs)"),
          numCol("damage_ctn", "Ctn"),
          numCol("damage_dzn", "Dzn"),
          numCol("damage_pcs", "Pcs"),
          numCol("damage_value", "Damages Value"),
        ],
      },
    ],
  },

  /* TOTAL UNLOADED STOCK */
  {
    id: "unloaded_root",
    header: () => (
      <div className="text-center w-full">TOTAL UNLOADED STOCK</div>
    ),
    columns: [
      {
        id: "unloaded_summary",
        header: () => <div className="text-right w-full">22,174,094.00</div>,
        columns: [
          numCol("closing_qty", "Closing Qty (Pcs)"),
          numCol("closing_ctn", "Ctn"),
          numCol("closing_dzn", "Dzn"),
          numCol("closing_pcs", "Pcs"),
          numCol("closing_value", "Closing Value"),
        ],
      },
    ],
  },

  /* STOCK FOR NEW TRIP */
  {
    id: "new_trip_root",
    header: () => <div className="text-center w-full">STOCK FOR NEW TRIP</div>,
    columns: [
      {
        id: "new_trip_summary",
        header: () => <div className="text-right w-full">22,174,094.00</div>,
        columns: [
          numCol("net_stock_qty", "Net Stock Qty"),
          numCol("net_stock_ctn", "Ctn"),
          numCol("net_stock_dzn", "Dzn"),
          numCol("net_stock_pcs", "Pcs"),
          numCol("net_stock_value", "Net Stock Value"),
        ],
      },
    ],
  },
];
