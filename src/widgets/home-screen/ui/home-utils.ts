export function getCompanyId() {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  const companyIdFromSearch = params.get("company_id") ?? undefined;
  if (companyIdFromSearch) {
    return companyIdFromSearch;
  }

  const legacyCompanyIdFromSearch = params.get("companyId") ?? undefined;
  if (legacyCompanyIdFromSearch) {
    return legacyCompanyIdFromSearch;
  }

  const hashQuery = url.hash.includes("?") ? url.hash.split("?")[1] : "";
  const hashParams = new URLSearchParams(hashQuery);

  return (
    hashParams.get("company_id") ??
    hashParams.get("companyId") ??
    undefined
  );
}

export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} UZS`;
}
