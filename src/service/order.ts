import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "./api";
import type { CreateOrderPayload, CreateOrderResponse, Order } from "../types/order";

interface ApiErrorResponse {
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.message ?? fallback;
}

export async function createCompanyOrder(payload: CreateOrderPayload) {
  try {
    const { data } = await api.post<CreateOrderResponse>(
      `/api/v1/twa/company/${payload.company_id}/order`,
      payload,
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
