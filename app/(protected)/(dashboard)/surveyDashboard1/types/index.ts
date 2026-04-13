export interface DashboardData {
  total_menu_survey: number;
  total_sub_survey: number;
  total_responds: number;
}

export interface DashboardResponse {
  status: boolean;
  message: string;
  data: DashboardData;
}

export interface MenuItem {
  id: number;
  survey_name: string;
}

export interface MenuResponse {
  status: boolean;
  message: string;
  data: MenuItem[];
}

export interface SubSurvey {
  id: number;
  survey_name: string;
  from_date: string;
  to_date: string;
}

export interface Category {
  category_id: number;
  customer_category_name: string;
}

export interface SubSurveyNormalized {
  surveys: SubSurvey[];
  categories: Category[];
}

export interface SubMenuResponse {
  status: boolean;
  message: string;
  data: {
    surveys: SubSurvey[];
    categories: Category[];
  };
}
