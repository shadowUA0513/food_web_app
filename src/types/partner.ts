export interface Partner {
  id: string;
  name?: string;
  full_name?: string;
  title?: string;
  phone?: string;
  phone_number?: string;
}

export interface CompanyPartnersResponse {
  error: boolean;
  data?: {
    partners?: Partner[];
  } | Partner[];
}
