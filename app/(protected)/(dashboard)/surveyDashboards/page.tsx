"use client";

import { useState } from "react";
import { SectionCards } from "./components/section-cards";
import { CommonDataTables } from "@/components/table-data/common-tables";
import DataTableHeader from "@/components/table-data/data-table-header";

import {
  surveyColumns,
  questionColumns,
  subSurveyQuestionColumns,
} from "./components/columns";

import { Card } from "@/components/ui/card";
import {
  useDashboard,
  useMenuSurvey,
  useSubSurvey,
  useFilteredQuestions,
} from "./useSurvey";
import { TableSkeleton } from "@/components/ui/dashboard-skeleton";
import { RoundedPieChart } from "@/components/ui/rounded-pie-chart";
import GrowthLines from "@/components/ui/growthlines";

export default function Salesdashboard() {
  // Inside Salesdashboard component
  const [selectedMenuName, setSelectedMenuName] =
    useState<string>("AAVAA Survey");
  const [selectedSubSurveyName, setSelectedSubSurveyName] = useState<
    string | null
  >(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);
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
      setSelectedMenuName(label); // Update name
      setSelectedSubSurveyId(null);
      setSelectedSubSurveyName(null); // Reset sub-path
      setSelectedCategoryId(null);
      setSelectedCategoryName(null); // Reset sub-path
    }
  };

  const handleSubSurveyClick = (label: string) => {
    const sub = subData?.rawSurveys?.find((s: any) => s.survey_name === label);
    if (sub) {
      setSelectedSubSurveyId(sub.id);
      setSelectedSubSurveyName(label); // Update name
    }
  };

  const handleChannelClick = (label: string) => {
    const cat = subData?.categoryPieRaw?.find(
      (c: any) => c.customer_category_name === label,
    );
    if (cat) {
      setSelectedCategoryId(cat.category_id);
      setSelectedCategoryName(label); // Update name
    }
  };

  const handleBreadcrumbReset = () => {
    setSelectedSubSurveyId(null);
    setSelectedSubSurveyName(null);
    setSelectedCategoryId(null);
    setSelectedCategoryName(null);
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
            <GrowthLines
              isLoading={isDashLoading}
              items={[
                {
                  label: "Completion Rate",
                  value: dashData?.completion_percentage
                    ? dashData.completion_percentage * 100
                    : 0,
                },
              ]}
            />
          </div>
        </Card>
      </div>

      <div className="lg:px-6 px-4 grid grid-cols-1 lg:grid-cols-10 gap-4 items-stretch">
        {/* LEFT COLUMN: PIE CHARTS */}
        <div className="lg:col-span-3 flex flex-col gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col gap-1">
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
        </div>

        {/* RIGHT COLUMN: BREADCRUMBS & TABLE */}
        <div className="lg:col-span-7 flex flex-col gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
          {/* BREADCRUMB UI */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm w-fit">
            <button
              onClick={handleBreadcrumbReset}
              className={`hover:underline font-semibold ${!selectedSubSurveyName ? "text-blue-600" : "text-slate-500"}`}
            >
              {selectedMenuName}
            </button>

            {selectedSubSurveyName && (
              <>
                <span className="text-slate-400 font-medium">{"→"}</span>
                <span
                  className={`font-semibold ${!selectedCategoryName ? "text-blue-600" : "text-slate-500"}`}
                >
                  {selectedSubSurveyName}
                </span>
              </>
            )}

            {selectedCategoryName && (
              <>
                <span className="text-slate-400 font-medium">{"→"}</span>
                <span className="font-semibold text-blue-600">
                  {selectedCategoryName}
                </span>
              </>
            )}
          </div>

          {/* TABLE SECTION */}
          <div className="flex-grow min-h-0">
            {isSubLoading || isFilterLoading ? (
              <TableSkeleton />
            ) : (
              <CommonDataTables
                columns={tableColumns}
                data={tableData}
                pageSize={10}
                headerTitle={tableTitle}
                height={550} // Adjusted slightly to match the 3-chart stack height
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
    </div>
  );
}
