import { ColumnDef } from "@tanstack/react-table";

// Table 1: Initial State
export const surveyColumns: ColumnDef<any>[] = [
  { accessorKey: "parent_survey", header: "Survey" },
  { accessorKey: "survey_name", header: "Sub Survey Name" },
  { accessorKey: "from_date", header: "From Date" },
  { accessorKey: "to_date", header: "To Date" },
];

// Table 2: When clicking Sub-Survey Pie (Chart 2)
export const subSurveyQuestionColumns: ColumnDef<any>[] = [
  { accessorKey: "question", header: "Question" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "total_responses", header: "Responses" },
];

// Table 3: When clicking Channel Pie (Chart 3)
export const questionColumns: ColumnDef<any>[] = [
  { id: "question", accessorKey: "question", header: "Question" },
  { id: "type", accessorKey: "type", header: "Type" },
  {
    id: "total_responses",
    accessorKey: "total_responses",
    header: "Responses",
    cell: ({ row }) => {
      const details = row.original.response_details || [];
      const hover = details
        .map((d: any) => `${d.name}: ${d.total_response}`)
        .join(" | ");
      return (
        <div title={hover} className="">
          {row.original.total_responses}
        </div>
      );
    },
  },
];
