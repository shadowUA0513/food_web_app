import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { api } from './api'
import type { CompanySettingsResponse } from '../types/settings'

interface ApiErrorResponse {
  message?: string
}

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError.response?.data?.message ?? fallback
}

export async function getCompanySettings(companyId: string) {
  try {
    const { data } = await api.get<CompanySettingsResponse>(
      `/api/v1/twa/company/${companyId}/settings`,
    )

    const companySettings = data.data?.company_settings

    if (!companySettings) {
      throw new Error('Company settings not found.')
    }

    return companySettings
  } catch (error) {
    if (error instanceof Error && error.message === 'Company settings not found.') {
      throw error
    }

    throw new Error(getErrorMessage(error, 'Failed to load company settings.'))
  }
}

export function useCompanySettings(companyId?: string) {
  return useQuery({
    queryKey: ['company-settings', companyId],
    queryFn: () => getCompanySettings(companyId!),
    enabled: Boolean(companyId),
    refetchOnWindowFocus: true,
  })
}
