"use client";

import { useState } from "react";
import { SectionCards } from "./components/section-cards";
import { CommonDataTables } from "@/components/table-data/common-tables";
import DataTableHeader from "@/components/table-data/data-table-header";
import { RoundedPieChart } from "@/components/ui/rounded-pie-chart";
import {
  surveyColumns,
  questionColumns,
  subSurveyQuestionColumns,
} from "./components/columns";
import GrowthLines from "@/components/growthlines";
import { Card } from "@/components/ui/card";
import {
  useDashboard,
  useMenuSurvey,
  useSubSurvey,
  useFilteredQuestions,
} from "./useSurvey";
import { TableSkeleton } from "@/components/ui/dashboard-skeleton";

export default function Salesdashboard() {
  const [selectedMenuId, setSelectedMenuId] = useState<number>(1);
  const [selectedSubSurveyId, setSelectedSubSurveyId] = useState<number | null>(
    null,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  // Queries
  const { data: dashData, isLoading: isDashLoading } = useDashboard();
  const { data: menuData, isLoading: isMenuLoading } = useMenuSurvey();
  const { data: subData, isLoading: isSubLoading } =
    useSubSurvey(selectedMenuId);
  const { data: filterData, isFetching: isFilterLoading } =
    useFilteredQuestions(
      selectedMenuId,
      selectedSubSurveyId ?? undefined,
      selectedCategoryId ?? undefined,
    );

  // Handlers
  const handleMenuClick = (label: string) => {
    const selected = menuData?.raw?.find((m) => m.survey_name === label);
    if (selected) {
      setSelectedMenuId(selected.id);
      setSelectedSubSurveyId(null);
      setSelectedCategoryId(null);
    }
  };

  const handleSubSurveyClick = (label: string) => {
    const sub = subData?.rawSurveys?.find((s: any) => s.survey_name === label);
    if (sub) setSelectedSubSurveyId(sub.id);
  };

  const handleChannelClick = (label: string) => {
    const cat = subData?.categoryPieRaw?.find(
      (c: any) => c.customer_category_name === label,
    );
    if (cat) setSelectedCategoryId(cat.category_id);
  };

  // UI Logic
  const isDeepView = !!selectedSubSurveyId || !!selectedCategoryId;
  const tableData = isDeepView
    ? filterData?.tableData || []
    : subData?.tableData || [];
  const tableColumns = selectedCategoryId
    ? questionColumns
    : selectedSubSurveyId
      ? subSurveyQuestionColumns
      : surveyColumns;
  const tableTitle = selectedCategoryId
    ? `Channel: ${filterData?.categoryName || "Analysis"}`
    : selectedSubSurveyId
      ? "Sub-Survey Questions"
      : "Survey List";

  return (
    <div className="flex flex-1 flex-col pb-6">
      <div className="py-4 px-6 flex justify-center w-full">
        <DataTableHeader title="Survey Overview" />
      </div>

      <div className="px-6 py-2">
        <Card className="px-2 pb-6 grid grid-cols-1 lg:grid-cols-10 gap-2 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <SectionCards data={dashData} isLoading={isDashLoading} />
          </div>
          <div className="lg:col-span-3 flex flex-col justify-center">
            <GrowthLines data={{ completion_rate: 85.2 }} isLoading={false} />
          </div>
        </Card>
      </div>

      <div className="lg:px-6 px-4 grid grid-cols-1 lg:grid-cols-10 gap-2">
        <div className="lg:col-span-3 flex flex-col gap-2">
          <RoundedPieChart
            title="Survey"
            data={menuData?.pieData || []}
            onSliceClick={handleMenuClick}
            isLoading={isMenuLoading}
          />
          <RoundedPieChart
            title="Sub Survey"
            data={subData?.subSurveyPie || []}
            onSliceClick={handleSubSurveyClick}
            isLoading={isSubLoading}
          />
          <RoundedPieChart
            title="Channel"
            data={subData?.categoryPie || []}
            onSliceClick={handleChannelClick}
            isLoading={isSubLoading}
          />
        </div>

        <div className="lg:col-span-7">
          {isSubLoading || isFilterLoading ? (
            <TableSkeleton />
          ) : (
            <CommonDataTables
              columns={tableColumns}
              data={tableData}
              tableHeight={1015}
              headerTitle={tableTitle}
              isFetchingMore={isSubLoading || isFilterLoading}
              key={
                selectedCategoryId
                  ? "cat"
                  : selectedSubSurveyId
                    ? "sub"
                    : "list"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
