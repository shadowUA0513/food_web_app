export interface WorkingHours {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface CompanySettings {
  id: string
  name: string
  brand_color: string
  logo_url: string
  min_order_amount?: number
  supported_order_types?: string[]
  payment_accepting_style?: string
  card_pans?: string[]
  today_working_hours?: WorkingHours | null;
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
