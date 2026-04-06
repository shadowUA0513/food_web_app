import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { CompanyPartnersResponse } from "../types/partner";
import axios from "axios";


interface ApiErrorResponse {
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.message ?? fallback;
}

export async function getCompanyPartners(companyId: string) {
  try {
    const { data } = await axios.get<CompanyPartnersResponse>(
      `https://dynamicrestaurantmanager-production.up.railway.app/api/v1/company/${companyId}/partners`,
    );

    if (Array.isArray(data.data)) {
      return data.data;
    }

    return data.data?.partners ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load partners."));
  }
}

export function useCompanyPartners(companyId?: string) {
  return useQuery({
    queryKey: ["company-partners", companyId],
    queryFn: () => getCompanyPartners(companyId!),
    enabled: Boolean(companyId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}
