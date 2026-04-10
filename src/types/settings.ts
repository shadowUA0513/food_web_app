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
  data: {
    company_settings: CompanySettings
  }
}
