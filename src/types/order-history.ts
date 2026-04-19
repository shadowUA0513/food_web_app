export interface OrderHistoryItem {
  product_id: string;
  name?: string;
  quantity: number;
  price?: number;
}

export interface OrderHistoryOrder {
  id: string;
  company_id?: string;
  partner_id?: string | null;
  user_id?: number;
  payment_type?: string | null;
  status?: string | null;
  comment?: string | null;
  delivery_address?: string | null;
  total_amount?: number;
  created_at?: string | null;
  updated_at?: string | null;
  items: OrderHistoryItem[];
}

export interface CompanyOrderHistoryResponse {
  error: boolean;
  data?: unknown;
}
