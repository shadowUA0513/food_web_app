import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { api } from './api'
import type { CompanySettings, CompanySettingsResponse, WorkingHours } from '../types/settings'

interface ApiErrorResponse {
  message?: string
}

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError.response?.data?.message ?? fallback
}

function normalizeCompanySettings(raw: unknown): CompanySettings | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const source = raw as Record<string, unknown>
  const id = String(source.id ?? '')
  const name = String(source.name ?? source.company_name ?? '')
  const brandColor = String(source.brand_color ?? source.brandColor ?? '')
  const logoUrl = String(source.logo_url ?? source.logo ?? source.logoUrl ?? '')
  const minOrderAmount =
    typeof source.min_order_amount === 'number' ? source.min_order_amount : undefined
  const supportedOrderTypes = Array.isArray(source.supported_order_types)
    ? source.supported_order_types.filter(
        (value): value is string => typeof value === 'string',
      )
    : undefined

  if (!name && !logoUrl && !brandColor) {
    return null
  }

  return {
    id,
    name,
    brand_color: brandColor,
    logo_url: logoUrl,
    min_order_amount: minOrderAmount,
    supported_order_types: supportedOrderTypes,
    today_working_hours: source.today_working_hours && typeof source.today_working_hours === 'object'
      ? ({
          day_of_week: Number((source.today_working_hours as Record<string, unknown>).day_of_week ?? 0),
          start_time: String((source.today_working_hours as Record<string, unknown>).start_time ?? ''),
          end_time: String((source.today_working_hours as Record<string, unknown>).end_time ?? ''),
          is_active: Boolean((source.today_working_hours as Record<string, unknown>).is_active),
        } as WorkingHours)
      : null,
  }
}

export async function getCompanySettings(companyId: string) {
  try {
    const { data } = await api.get<CompanySettingsResponse>(
      `/api/v1/twa/company/${companyId}/settings`,
    )

    const companySettings =
      normalizeCompanySettings(data.data?.company_settings) ??
      normalizeCompanySettings(data.data?.settings) ??
      normalizeCompanySettings(data.data) ??
      normalizeCompanySettings(data)

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
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
