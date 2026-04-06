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
