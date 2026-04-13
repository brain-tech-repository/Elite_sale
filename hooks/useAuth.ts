// utils/authHooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/apiClient"; // axios instance
import { CookieManager } from "@/lib/cookieUtils";

/** ----- Types ----- */
type LoginPayload = { name: string; email: string };
type LoginResponse = {
  token: string;
  user: { id: string; name: string; roleId: string };
};
type Profile = { id: string; name: string; roleId: string };

/** ----- Login Hook ----- */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (data: LoginPayload) => {
      const res = await api.post<LoginResponse>("/login", data);

      if (res.data.token) {
        // Save JWT token in cookie
        // CookieManager.set("token", res.data.token, { path: "/", maxAge: 3600 });
        // Optionally save user info in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
      }

      return res.data;
    },
    // onSuccess: () => {
    //   // Refetch profile or other queries after login
    //   queryClient.invalidateQueries(["profile"]);
    // },
  });
}

/** ----- Logout Hook ----- */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      // Remove token cookie and session storage
      CookieManager.remove("token");
      sessionStorage.removeItem("user");
    },
    onSuccess: () => {
      // Clear cached queries
      queryClient.clear();
    },
  });
}

/** ----- Profile Hook ----- */
export function useProfile() {
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/profile"); // token sent automatically via cookies
      return res.data;
    },
    enabled: !!document.cookie.includes("token"), // fetch only if token exists
  });
}