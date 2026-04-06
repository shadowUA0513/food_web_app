import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "./api";

interface ApiErrorResponse {
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.message ?? fallback;
}

export async function getTelegramUser(telegramId: string) {
  try {
    const { data } = await api.get(`/api/v1/users/tg/${telegramId}`);
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load Telegram user."));
  }
}

export function useTelegramUser(telegramId?: string, enabled = true) {
  return useQuery({
    queryKey: ["telegram-user", telegramId],
    queryFn: () => getTelegramUser(telegramId!),
    enabled: enabled && Boolean(telegramId),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
