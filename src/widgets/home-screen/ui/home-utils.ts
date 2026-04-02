const DEFAULT_COMPANY_ID = "08d016ac-f8a2-4273-8219-806d5dd1fba1";

export function getCompanyId() {
  const params = new URLSearchParams(window.location.search);

  return (
    params.get("company_id") ?? params.get("companyId") ?? DEFAULT_COMPANY_ID
  );
}

export function formatPrice(price: number) {
  return `${new Intl.NumberFormat("ru-RU").format(price)} UZS`;
}
