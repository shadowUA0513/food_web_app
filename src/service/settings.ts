import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { api } from './api'
import type { CompanySettings, CompanySettingsResponse, WorkingHours } from '../types/settings'

interface ApiErrorResponse {
  message?: string
}

type PartialCompanySettings = Partial<CompanySettings>

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError.response?.data?.message ?? fallback
}

function normalizeCompanySettings(raw: unknown): PartialCompanySettings | null {
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
  const paymentAcceptingStyle =
    typeof source.payment_accepting_style === 'string'
      ? source.payment_accepting_style
      : undefined
  const cardPans = Array.isArray(source.card_pans)
    ? source.card_pans
        .filter((value): value is string => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean)
    : undefined
  const rawPhoneNumbers = Array.isArray(source.phone_numbers)
    ? source.phone_numbers
    : Array.isArray(source.phoneNumbers)
      ? source.phoneNumbers
      : undefined
  const phoneNumbers = rawPhoneNumbers
    ? rawPhoneNumbers
        .filter((value): value is string => typeof value === 'string')
        .map((value) => value.trim())
        .filter(Boolean)
    : undefined

  return {
    id,
    name,
    brand_color: brandColor,
    logo_url: logoUrl,
    min_order_amount: minOrderAmount,
    supported_order_types: supportedOrderTypes,
    payment_accepting_style: paymentAcceptingStyle,
    card_pans: cardPans,
    phone_numbers: phoneNumbers,
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

function mergeCompanySettings(
  ...sources: Array<PartialCompanySettings | null>
): CompanySettings | null {
  const merged = sources.reduce<PartialCompanySettings>(
    (acc, source) => ({
      ...acc,
      ...source,
    }),
    {},
  )

  if (!merged.name && !merged.logo_url && !merged.brand_color) {
    return null
  }

  return {
    id: merged.id ?? '',
    name: merged.name ?? '',
    brand_color: merged.brand_color ?? '',
    logo_url: merged.logo_url ?? '',
    min_order_amount: merged.min_order_amount,
    supported_order_types: merged.supported_order_types,
    payment_accepting_style: merged.payment_accepting_style,
    card_pans: merged.card_pans,
    phone_numbers: merged.phone_numbers,
    today_working_hours: merged.today_working_hours ?? null,
  }
}

export async function getCompanySettings(companyId: string) {
  try {
    const { data } = await api.get<CompanySettingsResponse>(
      `/api/v1/twa/company/${companyId}/settings`,
    )

    const companySettings = mergeCompanySettings(
      normalizeCompanySettings(data),
      normalizeCompanySettings(data.data),
      normalizeCompanySettings(data.data?.settings),
      normalizeCompanySettings(data.data?.company_settings),
    )

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
