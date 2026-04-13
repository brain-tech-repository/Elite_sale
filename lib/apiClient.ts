// utils/api.ts

import axios from "axios";
import { CookieManager } from "./cookieUtils";
import { toast } from "sonner";

const api = axios.create({
  //  baseURL: "/backend",   // ✅ MUST be this
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ✅ from env
  // withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = CookieManager.get<string>("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isLogoutTriggered = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === "undefined") return Promise.reject(error);

    const status = error.response?.status;

    if (status === 401 && !isLogoutTriggered) {
      isLogoutTriggered = true;

      toast.error("Session expired. Please login again.");

      CookieManager.remove("token", { path: "/" });
      localStorage.removeItem("user_auth_data");

      setTimeout(() => {
        window.location.href = "/";
        isLogoutTriggered = false;
      }, 1500);
    }

    return Promise.reject(error);
  },
);

export default api;
