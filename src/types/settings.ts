export interface CompanySettings {
  id: string
  name: string
  brand_color: string
  logo_url: string
  min_order_amount?: number
  supported_order_types?: string[]
}

export interface CompanySettingsResponse {
  error: boolean
  data?: {
    company_settings?: Partial<CompanySettings> & {
      company_name?: string
      logo?: string
      logoUrl?: string
      brandColor?: string
    }
    settings?: Partial<CompanySettings> & {
      company_name?: string
      logo?: string
      logoUrl?: string
      brandColor?: string
    }
  } & (Partial<CompanySettings> & {
    company_name?: string
    logo?: string
    logoUrl?: string
    brandColor?: string
  })
}
