import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format currency */
export function formatCurrency(
  amount: number,
  currency = "BDT",
  locale = "en-BD"
): string {
  if (currency === "BDT") {
    return "৳" + amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format date */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(new Date(date));
}

/** Generate order number */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FM-${timestamp}-${random}`;
}

/** Truncate text */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/** Calculate discount percentage */
export function calcDiscountPercent(original: number, current: number): number {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

/** Slugify text */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Get main product image */
export function getMainImage(images: { url: string; isMain: boolean }[]): string {
  if (!images || images.length === 0) return "/images/placeholder-product.png";
  const main = images.find((img) => img.isMain);
  return main ? main.url : images[0].url;
}

/** Get badge color classes */
export function getBadgeColor(color: string | null): string {
  switch (color) {
    case "blue":
      return "bg-blue-500 text-white";
    case "blue":
      return "bg-blue-500 text-white";
    case "red":
      return "bg-red-500 text-white";
    case "yellow":
      return "bg-yellow-400 text-black";
    case "orange":
      return "bg-orange-500 text-white";
    case "purple":
      return "bg-purple-500 text-white";
    default:
      return "bg-primary text-white";
  }
}

/** Debounce function */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Get order status color */
export function getOrderStatusColor(status: string): string {
  switch (status) {
    case "DELIVERED":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "SHIPPED":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "PROCESSING":
    case "CONFIRMED":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "CANCELLED":
    case "REFUNDED":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

/** Parse search params */
export function parseSearchParams(params: Record<string, string | string[] | undefined>) {
  return {
    category: params.category as string | undefined,
    brand: params.brand as string | undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice as string) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice as string) : undefined,
    rating: params.rating ? parseFloat(params.rating as string) : undefined,
    inStock: params.inStock === "true" ? true : undefined,
    search: params.search as string | undefined,
    sort: params.sort as string | undefined,
    page: params.page ? parseInt(params.page as string) : 1,
    pageSize: params.pageSize ? parseInt(params.pageSize as string) : 12,
  };
}
