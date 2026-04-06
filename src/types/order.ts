export interface CreateOrderItemPayload {
  product_id: string;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  company_id: string;
  partner_id: string;
  delivery_address: string;
  user_id: string;
  comment?: string;
  items: CreateOrderItemPayload[];
}

export interface Order {
  id: string;
  company_id: string;
  partner_id: string;
  delivery_address: string;
  user_id: string;
  comment?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrderResponse {
  error: boolean;
  data?: {
    order?: Order;
  };
}
