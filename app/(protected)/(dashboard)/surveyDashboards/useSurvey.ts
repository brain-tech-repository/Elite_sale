import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/lib/apiClient";
import {
  DashboardData,
  DashboardResponse,
  MenuResponse,
  SubSurveyNormalized,
  SubMenuResponse,
  MenuItem,
} from "./types";

const STALE_TIME = 1000 * 60 * 5; // 5 minutes
const GC_TIME = 1000 * 60 * 30; // 30 minutes

/* ---------------- DASHBOARD ---------------- */
const getDashboard = async (): Promise<DashboardData> => {
  const res = await api.get<DashboardResponse>("bee-survey-dashboard");
  return res.data.data;
};

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false, // Prevents refetch when switching tabs
  });
};

/* ---------------- MENU (Pie 1) ---------------- */
const getMenuSurvey = async (): Promise<MenuItem[]> => {
  const res = await api.post<MenuResponse>("menu-survey");
  return res.data.data;
};

export const useMenuSurvey = () => {
  return useQuery({
    queryKey: ["menu-survey"],
    queryFn: getMenuSurvey,
    select: (data) => ({
      raw: data,
      pieData: data.map((item) => ({
        label: item.survey_name,
        y: 1,
      })),
    }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false, // Prevents refetch when switching tabs
  });
};

/* ---------------- SUB SURVEY ---------------- */
const getSubSurvey = async (menuId: number): Promise<SubSurveyNormalized> => {
  const res = await api.post<SubMenuResponse | any>(
    `menu-survey?menu_id=${menuId}`,
  );
  const data = res.data.data;
  if (Array.isArray(data)) return { surveys: data, categories: [] };
  return {
    surveys: data?.surveys || [],
    categories: data?.categories || [],
  };
};

export const useSubSurvey = (menuId?: number) => {
  const { data: menuList } = useMenuSurvey();
  return useQuery({
    queryKey: ["sub-survey", menuId],
    queryFn: () => getSubSurvey(menuId!),
    enabled: !!menuId,
    select: (data) => {
      const parentName =
        menuList?.raw?.find((m) => m.id === menuId)?.survey_name || "";
      return {
        subSurveyPie: data.surveys.map((item) => ({
          label: item.survey_name,
          y: 1,
        })),
        categoryPie: data.categories.map((item) => ({
          label: item.customer_category_name,
          y: 1,
        })),
        categoryPieRaw: data.categories,
        rawSurveys: data.surveys,
        tableData: data.surveys.map((item) => ({
          parent_survey: parentName,
          survey_name: item.survey_name,
          from_date: item.from_date,
          to_date: item.to_date,
          total_questions: item.total_questions, // ✅ added
          total_responses: item.total_responses, // ✅ added
        })),
      };
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false, // Prevents refetch when switching tabs
  });
};

/* ---------------- DYNAMIC FILTERED QUESTIONS ---------------- */
// This hook handles ANY combination of IDs: ?menu_id=X&survey_id=Y&category_id=Z
const getFilteredQuestions = async (
  menuId?: number,
  surveyId?: number,
  categoryId?: number,
) => {
  const params = new URLSearchParams();
  if (menuId) params.append("menu_id", menuId.toString());
  if (surveyId) params.append("survey_id", surveyId.toString());
  if (categoryId) params.append("category_id", categoryId.toString());

  const res = await api.post<any>(`menu-survey?${params.toString()}`);
  return res.data.data;
};

export const useFilteredQuestions = (
  menuId?: number,
  surveyId?: number,
  categoryId?: number,
) => {
  return useQuery({
    queryKey: ["filtered-questions", menuId, surveyId, categoryId],
    queryFn: () => getFilteredQuestions(menuId, surveyId, categoryId),
    enabled: !!menuId && (!!surveyId || !!categoryId),
    placeholderData: keepPreviousData,
    select: (data) => {
      // 1. If data is a direct array of questions (Menu 2, 3 or specific filters)
      if (Array.isArray(data) && data.length > 0 && !("questions" in data[0])) {
        return {
          tableData: data.map((q: any) => ({
            category_name: q.customer_category_name,
            question: q.question,
            type: q.question_type,
            total_responses: q.total_question_response,
            response_details: q.options || [],
          })),
        };
      }

      // 2. If data is an array of categories (Menu 1 style)
      if (Array.isArray(data)) {
        return {
          tableData: data.flatMap((cat: any) =>
            (cat.questions || []).map((q: any) => ({
              category_name: cat.customer_category_name,
              question: q.question,
              type: q.question_type,
              total_responses: q.total_question_response,
              response_details: q.options || [],
            })),
          ),
        };
      }

      // 3. If data is an object with questions inside (Category click)
      const questions = data?.questions || data?.data || [];
      return {
        categoryName: data?.category?.customer_category_name || "Filtered View",
        tableData: questions.map((q: any) => ({
          question: q.question,
          type: q.question_type,
          total_responses: q.total_question_response,
          response_details: q.options || [],
        })),
      };
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false, // Prevents refetch when switching tabs
  });
};
