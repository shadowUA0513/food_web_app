export interface CreateOrderItemPayload {
  product_id: string;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  company_id: string;
  partner_id?: string;
  delivery_address: string;
  user_id: number;
  payment_type: string;
  tg_payment_screenshot_link?: string;
  comment?: string;
  items: CreateOrderItemPayload[];
}

export interface Order {
  id: string;
  company_id: string;
  partner_id?: string | null;
  delivery_address: string;
  user_id: number;
  payment_type?: string | null;
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

export interface UploadPaymentScreenshotResponse {
  error: boolean;
  data?: {
    tg_payment_screenshot_link?: string;
  };
}
