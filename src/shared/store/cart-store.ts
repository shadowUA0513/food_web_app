import { create } from "zustand";
import type { Product } from "../../types/menu";

export interface CartItem {
  product: Product;
  count: number;
}

interface CartState {
  items: Record<string, CartItem>;
  totalCount: number;
  addItem: (product: Product, count: number) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  clearCart: () => void;
}

function getTotalCount(items: Record<string, CartItem>) {
  return Object.values(items).reduce((sum, item) => sum + item.count, 0);
}

export const useCartStore = create<CartState>((set) => ({
  items: {},
  totalCount: 0,
  addItem: (product, count) =>
    set((state) => {
      const safeCount = Math.max(1, count);
      const currentCount = state.items[product.id]?.count ?? 0;
      const nextItems: Record<string, CartItem> = {
        ...state.items,
        [product.id]: {
          product,
          count: currentCount + safeCount,
        },
      };

      return {
        items: nextItems,
        totalCount: getTotalCount(nextItems),
      };
    }),
  incrementItem: (productId) =>
    set((state) => {
      const existing = state.items[productId];
      if (!existing) {
        return state;
      }

      const nextItems: Record<string, CartItem> = {
        ...state.items,
        [productId]: {
          ...existing,
          count: existing.count + 1,
        },
      };

      return {
        items: nextItems,
        totalCount: getTotalCount(nextItems),
      };
    }),
  decrementItem: (productId) =>
    set((state) => {
      const existing = state.items[productId];
      if (!existing) {
        return state;
      }

      const nextItems: Record<string, CartItem> = { ...state.items };

      if (existing.count <= 1) {
        delete nextItems[productId];
      } else {
        nextItems[productId] = {
          ...existing,
          count: existing.count - 1,
        };
      }

      return {
        items: nextItems,
        totalCount: getTotalCount(nextItems),
      };
    }),
  clearCart: () =>
    set({
      items: {},
      totalCount: 0,
    }),
}));
