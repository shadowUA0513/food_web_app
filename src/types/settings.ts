export interface CompanySettings {
  id: string
  name: string
  brand_color: string
  logo_url: string
}

export interface CompanySettingsResponse {
  error: boolean
  data: {
    company_settings: CompanySettings
  }
}
