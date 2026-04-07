export interface Partner {
  id: string;
  name?: string;
  name_uz?: string;
  name_ru?: string;
  full_name?: string;
  title?: string;
  phone?: string;
  phone_number?: string;
  address_description?: string;
  addressDescription?: string;
  latitude?: number | string;
  longitude?: number | string;
  lat?: number | string;
  lng?: number | string;
  lon?: number | string;
  location_lat?: number | string;
  location_lng?: number | string;
  location_lon?: number | string;
  geo_lat?: number | string;
  geo_lng?: number | string;
  geo_lon?: number | string;
}

export interface CompanyPartnersResponse {
  error: boolean;
  data?: {
    partners?: Partner[];
  } | Partner[];
}
