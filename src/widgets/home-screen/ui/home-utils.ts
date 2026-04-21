interface PriceWithDiscount {
  price: number;
  discounted_price?: number | null;
}

export function getCompanyId() {
  return (
    getQueryParam("company_id") ??
    getQueryParam("companyId") ??
    "08d016ac-f8a2-4273-8219-806d5dd1fba1"
  );
}

export function getPartnerId() {
  return getQueryParam("partner_id") ?? getQueryParam("partnerId") ?? undefined;
}

export function getTelegramId() {
  return getQueryParam("tg_id") ?? getQueryParam("tgId") ?? undefined;
}

export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} UZS`;
}

export function getProductDiscount(product: PriceWithDiscount) {
  const originalPrice = Number(product.price);
  const discountedPrice = Number(product.discounted_price ?? 0);

  if (
    !Number.isFinite(originalPrice) ||
    originalPrice <= 0 ||
    !Number.isFinite(discountedPrice) ||
    discountedPrice <= 0 ||
    discountedPrice >= originalPrice
  ) {
    return 0;
  }

  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

export function getDiscountedPrice(product: PriceWithDiscount) {
  const originalPrice = Number(product.price);
  const discountedPrice = Number(product.discounted_price ?? 0);

  if (
    !Number.isFinite(originalPrice) ||
    originalPrice <= 0 ||
    !Number.isFinite(discountedPrice) ||
    discountedPrice <= 0 ||
    discountedPrice >= originalPrice
  ) {
    return product.price;
  }

  return discountedPrice;
}

import type { CompanySettings } from "../../../types/settings";

function getQueryParam(key: string) {
  const url = new URL(window.location.href);
  const searchValue = url.searchParams.get(key);

  if (searchValue) {
    return searchValue;
  }

  const hashQuery = url.hash.includes("?") ? url.hash.split("?")[1] : "";
  const hashParams = new URLSearchParams(hashQuery);

  return hashParams.get(key);
}

export function isCompanyOpen(settings?: CompanySettings): boolean {
  const wh = settings?.today_working_hours;
  if (!wh || !wh.is_active) {
    return false;
  }

  const now = new Date();
  const [startH = 0, startM = 0, startS = 0] = wh.start_time
    .split(":")
    .map(Number);
  const [endH = 0, endM = 0, endS = 0] = wh.end_time.split(":").map(Number);

  if (
    [startH, startM, startS, endH, endM, endS].some(
      (value) => !Number.isFinite(value),
    )
  ) {
    return false;
  }

  const currentSeconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const startSeconds = startH * 3600 + startM * 60 + startS;
  const endSeconds = endH * 3600 + endM * 60 + endS;

  if (startSeconds <= endSeconds) {
    return currentSeconds >= startSeconds && currentSeconds <= endSeconds;
  }

  return currentSeconds >= startSeconds || currentSeconds <= endSeconds;
}

