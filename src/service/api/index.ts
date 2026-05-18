import axios, { AxiosError } from "axios";
import { AUTH_COOKIE_KEY, API_TIMEOUT_MS } from "./constant";
import { env } from "./env";
import { clearAuthSession } from "./session";
import { i18n } from "../../shared/i18n";

function getCookie(name: string) {
  const escapedName = name.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));

  return match ? decodeURIComponent(match[1]) : null;
}

export const api = axios.create({
  baseURL: env.baseUrl,
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
});

function getRequestLanguage() {
  const language = i18n.resolvedLanguage ?? i18n.language ?? "ru";

  if (language === "uz" || language === "ru" || language === "en") {
    return language;
  }

  if (language.startsWith("uz")) {
    return "uz";
  }

  if (language.startsWith("en")) {
    return "en";
  }

  return "ru";
}

api.interceptors.request.use((config) => {
  const token = getCookie(AUTH_COOKIE_KEY);

  if (token) {
    config.headers.Authorization ??= `Bearer ${token}`;
  }

  config.headers["X-Language"] = getRequestLanguage();

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuthSession();

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);
