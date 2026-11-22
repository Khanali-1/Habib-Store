import { countries, type CountryCode } from "@/context/CountryContext";

export interface ProductPricing {
  price: number;
  prices?: Partial<Record<CountryCode, number>>;
}

export interface DisplayPrice {
  available: boolean;
  amount: number;
  /** Ready to render, e.g. "Rs. 2,499" or "€ 24" */
  text: string;
  countryName: string;
}

/**
 * Display price for the selected country, using the same rule the order API
 * enforces: the country's own price must exist. Pakistan keeps the legacy
 * `price` field as a fallback so existing products continue to work.
 */
export function getDisplayPrice(
  product: ProductPricing,
  code: CountryCode
): DisplayPrice {
  const info = countries.find((country) => country.code === code) ?? countries[0];
  const own = product.prices?.[code];

  let amount: number | undefined =
    typeof own === "number" && own > 0 ? own : undefined;

  if (amount === undefined && code === "PK" && Number(product.price) > 0) {
    amount = Number(product.price);
  }

  if (amount === undefined) {
    return { available: false, amount: 0, text: "", countryName: info.name };
  }

  return {
    available: true,
    amount,
    text: `${info.symbol} ${amount.toLocaleString("en-US")}`,
    countryName: info.name,
  };
}
