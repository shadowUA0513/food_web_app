import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "./api";
import type { CompanyMenuResponse } from "../types/menu";

interface ApiErrorResponse {
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.message ?? fallback;
}

export async function getCompanyMenu(companyId: string) {
  try {
    const { data } = await api.get<CompanyMenuResponse>(
      `/api/v1/twa/company/${companyId}/menu`,
    );

    return data.data?.categories ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load company menu."));
  }
}

export function useCompanyMenu(companyId?: string) {
  return useQuery({
    queryKey: ["company-menu", companyId],
    queryFn: () => getCompanyMenu(companyId!),
    enabled: Boolean(companyId),
    refetchOnWindowFocus: true,
  });
}
