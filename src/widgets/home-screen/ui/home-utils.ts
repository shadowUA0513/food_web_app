export function getCompanyId() {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  if (params.get("company_id")) {
    return params.get("company_id");
  }

  if (params.get("companyId")) {
    return params.get("companyId");
  }

  const hashQuery = url.hash.includes("?") ? url.hash.split("?")[1] : "";
  const hashParams = new URLSearchParams(hashQuery);

  return hashParams.get("company_id") ?? hashParams.get("companyId") ?? undefined;
}

export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} UZS`;
}
