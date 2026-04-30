import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "./api";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  Order,
} from "../types/order";
import type {
  CompanyOrderHistoryResponse,
  OrderHistoryItem,
  OrderHistoryOrder,
} from "../types/order-history";

interface ApiErrorResponse {
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.message ?? fallback;
}

interface CreateCompanyOrderRequest {
  payload: CreateOrderPayload;
  file?: File | null;
}

export async function createCompanyOrder({
  payload,
  file,
}: CreateCompanyOrderRequest) {
  try {
    const requestBody = new FormData();
    requestBody.append("payload", JSON.stringify(payload));

    if (file) {
      requestBody.append("file", file);
    }

    const { data } = await api.post<CreateOrderResponse>(
      `/api/v1/twa/company/${payload.company_id}/order`,
      requestBody,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return (data.data?.order ?? data.data ?? null) as Order | null;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create order."));
  }
}

export function useCreateCompanyOrder() {
  return useMutation({
    mutationFn: createCompanyOrder,
  });
}

interface OrderHistoryParams {
  companyId: string;
  userId?: number;
  partnerId?: string | null;
  paymentType?: string | null;
  status?: string | null;
  page?: number | null;
  limit?: number | null;
}

function normalizeOrderHistoryItem(raw: unknown): OrderHistoryItem | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const source = raw as Record<string, unknown>;
  const quantity = Number(source.quantity ?? source.count ?? 0);
  const priceRaw = source.price ?? source.total_price ?? source.amount;
  const price = Number(priceRaw);

  return {
    product_id: String(source.product_id ?? source.productId ?? source.id ?? ""),
    name: String(source.name ?? source.product_name ?? source.title ?? "") || undefined,
    quantity: Number.isFinite(quantity) ? quantity : 0,
    price: Number.isFinite(price) ? price : undefined,
  };
}

function normalizeOrderHistoryOrder(raw: unknown): OrderHistoryOrder | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const source = raw as Record<string, unknown>;
  const itemsSource = Array.isArray(source.items)
    ? source.items
    : Array.isArray(source.order_items)
      ? source.order_items
      : Array.isArray(source.products)
        ? source.products
        : [];
  const totalAmountRaw =
    source.total_amount ?? source.totalPrice ?? source.total ?? source.amount;
  const totalAmount = Number(totalAmountRaw);
  const userId = Number(source.user_id ?? source.userId ?? 0);

  return {
    id: String(source.id ?? source.order_id ?? ""),
    company_id: String(source.company_id ?? source.companyId ?? "") || undefined,
    partner_id: String(source.partner_id ?? source.partnerId ?? "") || undefined,
    user_id: Number.isFinite(userId) ? userId : undefined,
    payment_type: String(source.payment_type ?? source.paymentType ?? "") || undefined,
    status: String(source.status ?? "") || undefined,
    comment: String(source.comment ?? "") || undefined,
    delivery_address: String(source.delivery_address ?? source.address ?? "") || undefined,
    total_amount: Number.isFinite(totalAmount) ? totalAmount : undefined,
    created_at: String(source.created_at ?? source.createdAt ?? "") || undefined,
    updated_at: String(source.updated_at ?? source.updatedAt ?? "") || undefined,
    items: itemsSource
      .map(normalizeOrderHistoryItem)
      .filter((item): item is OrderHistoryItem => Boolean(item)),
  };
}

function extractOrdersHistory(raw: unknown): OrderHistoryOrder[] {
  if (Array.isArray(raw)) {
    return raw
      .map(normalizeOrderHistoryOrder)
      .filter((order): order is OrderHistoryOrder => Boolean(order));
  }

  if (!raw || typeof raw !== "object") {
    return [];
  }

  const source = raw as Record<string, unknown>;
  const nested =
    source.orders_history ?? source.ordersHistory ?? source.orders ?? source.data;

  if (nested) {
    return extractOrdersHistory(nested);
  }

  const singleOrder = normalizeOrderHistoryOrder(source);

  return singleOrder ? [singleOrder] : [];
}

export async function getCompanyOrderHistory({
  companyId,
  userId,
  partnerId = null,
  paymentType = null,
  status = null,
  page = null,
  limit = null,
  
}: OrderHistoryParams) {
  if (!userId) {
    return [];
  }

  try {
    const { data } = await api.get<CompanyOrderHistoryResponse>(
      `/api/v1/company/${companyId}/orders-history`,
      {
        params: {
          partner_id: partnerId ?? "null",
          user_id: userId,
          payment_type: paymentType ?? "null",
          status: status ?? "null",
          page: page ?? "null",
          limit: limit ?? "null",
          company_id : companyId ?? "null"
        },
      },
    );

    return extractOrdersHistory(data.data ?? data);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load order history."));
  }
}

export function useCompanyOrderHistory(params: OrderHistoryParams) {
  const { companyId, userId, partnerId, paymentType, status, page, limit } = params;

  return useQuery({
    queryKey: [
      "company-order-history",
      companyId,
      userId,
      partnerId,
      paymentType,
      status,
      page,
      limit,
    ],
    queryFn: () => getCompanyOrderHistory(params),
    enabled: Boolean(companyId && userId),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}
