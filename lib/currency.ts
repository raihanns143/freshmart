export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  decimalPlaces: number;
  position: "left" | "right" | string;
  isDefault: boolean;
}

export const defaultBDT: Currency = {
  id: "default-bdt",
  code: "BDT",
  name: "Bangladeshi Taka",
  symbol: "৳",
  exchangeRate: 1,
  decimalPlaces: 0,
  position: "left",
  isDefault: true,
};

export function convertPrice(priceInBDT: number, currency: Currency): number {
  if (!currency || currency.code === "BDT" || currency.exchangeRate === 1) {
    return priceInBDT;
  }
  return priceInBDT / currency.exchangeRate;
}

export function roundCurrency(amount: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(amount * factor) / factor;
}

export function formatPrice(priceInBDT: number, currency?: Currency): string {
  const curr = currency || defaultBDT;
  const converted = convertPrice(priceInBDT, curr);
  
  // Format with browser's Intl.NumberFormat to get the commas/thousands separators
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: curr.decimalPlaces,
    maximumFractionDigits: curr.decimalPlaces,
  });

  const formattedAmount = formatter.format(converted);

  if (curr.position === "right") {
    return `${formattedAmount} ${curr.symbol}`;
  }
  
  // Need space if it's words e.g., SAR 22.00
  if (curr.symbol.length > 2) {
    return `${curr.symbol} ${formattedAmount}`;
  }
  
  return `${curr.symbol}${formattedAmount}`;
}
