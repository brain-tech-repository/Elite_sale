import { ColumnDef } from "@tanstack/react-table";

// Table 1: Initial State
export const surveyColumns: ColumnDef<any>[] = [
  {
    accessorKey: "survey_name",
    header: "Survey Name", // ✅ updated label
  },
  {
    accessorKey: "from_date",
    header: "From Date",
  },
  {
    accessorKey: "to_date",
    header: "To Date",
  },
  {
    accessorKey: "total_questions",
    header: "Total Questions",
  },
  {
    accessorKey: "total_responses",
    header: "Total Responses",
  },
];

// Table 2: When clicking Sub-Survey Pie (Chart 2)
export const subSurveyQuestionColumns: ColumnDef<any>[] = [
  {
    accessorKey: "category_name",
    header: "Category",
    cell: ({ row }) => <span className="">{row.original.category_name}</span>,
  },
  // { accessorKey: "category_name", header: "Category" },
  { accessorKey: "question", header: "Question" },
  // { accessorKey: "type", header: "Type" },
  {
    id: "total_responses",
    accessorKey: "total_responses",
    header: "Responses",
    cell: ({ row }) => {
      const details = row.original.response_details || [];
      const total = row.original.total_responses;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer  hover:underline">{total}</div>
            </TooltipTrigger>
            <TooltipContent className="p-3 bg-white text-gray-800">
              <div className="space-y-1">
                {details.length > 0 ? (
                  details.map((d: any, i: number) => (
                    <div key={i} className="flex justify-between gap-2 text-xs">
                      <span className="text-gray-800">{d.name}:</span>
                      <span className="font-mono">{d.total_response}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs">No data available</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

// Table 3: When clicking Channel Pie (Chart 3)
// import { ColumnDef } from "@tanstack/react-table";

// import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const questionColumns: ColumnDef<any>[] = [
  { id: "question", accessorKey: "question", header: "Question" },
  { id: "type", accessorKey: "type", header: "Type" },
  {
    id: "total_responses",
    accessorKey: "total_responses",
    header: "Responses",
    cell: ({ row }) => {
      const details = row.original.response_details || [];
      const total = row.original.total_responses;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer  hover:underline">{total}</div>
            </TooltipTrigger>
            <TooltipContent className="p-3 bg-white text-gray-800">
              <div className="space-y-1">
                {details.length > 0 ? (
                  details.map((d: any, i: number) => (
                    <div key={i} className="flex justify-between gap-2 text-xs">
                      <span className="text-gray-800">{d.name}:</span>
                      <span className="font-mono">{d.total_response}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs">No data available</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
