// import { ColumnDef } from "@tanstack/react-table";

// export const performanceColumns: ColumnDef<any>[] = [
//   {
//     accessorKey: "s_no",
//     header: "S No.",
//     cell: ({ row }) => <div className="font-medium">{row.original.s_no}</div>,
//   },
//   {
//     accessorKey: "particulars",
//     header: "PARTICULARS",
//     cell: ({ row }) => {
//       // If s_no is empty, we treat this as a Category Header
//       const isHeader = !row.original.s_no;
//       return (
//         <div
//           className={
//             isHeader
//               ? "font-bold text-blue-800 uppercase py-1"
//               : "pl-4 text-gray-700"
//           }
//         >
//           {row.original.particulars}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "amounts",
//     header: () => <div className="text-right">AMOUNTS</div>,
//     cell: ({ row }) => {
//       const val = row.original.amounts;
//       if (val === null || val === undefined || !row.original.s_no) return null;

//       return (
//         <div className="text-right font-mono">
//           {new Intl.NumberFormat("en-US", {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           }).format(Number(val))}
//         </div>
//       );
//     },
//   },
// ];

import { ColumnDef } from "@tanstack/react-table";

export const performanceColumns: ColumnDef<any>[] = [
  {
    accessorKey: "s_no",
    header: "S No.",
    cell: ({ row }) => <div className="font-medium">{row.original.s_no}</div>,
  },
  {
    accessorKey: "particulars",
    header: "PARTICULARS",
    cell: ({ row }) => {
      const isHeader = !row.original.s_no; // If S No is empty, it's a section title
      return (
        <div
          className={
            isHeader
              ? "font-bold text-blue-900 bg-slate-100 -mx-2 px-2 py-1 uppercase"
              : "pl-4"
          }
        >
          {row.original.particulars}
        </div>
      );
    },
  },
  {
    accessorKey: "amounts",
    header: () => <div className="text-right">AMOUNTS</div>,
    cell: ({ row }) => {
      const amount = row.original.amounts;
      if (amount === null) return null; // Don't show 0.00 for section headers

      return (
        <div className="text-right font-mono">
          {new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(Number(amount))}
        </div>
      );
    },
  },
];
