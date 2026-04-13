// utils/cookies.ts
import Cookies, { CookieSetOptions } from "universal-cookie";

const cookies = new Cookies();

export const CookieManager = {
  set: (
    name: string,
    value: string,
    options: CookieSetOptions = { path: "/" },
  ) => {
    cookies.set(name, value, options);
  },
  get: <T = any>(name: string): T | undefined => cookies.get(name) as T,
  remove: (name: string, options: CookieSetOptions = { path: "/" }) =>
    cookies.remove(name, options),
  getAll: () => cookies.getAll(),
  removeAll: () => {
    Object.keys(cookies.getAll()).forEach((key) =>
      cookies.remove(key, { path: "/" }),
    );
  },
};
