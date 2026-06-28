// ============================================================
// SHARED TYPES FOR FRESHMART
// ============================================================

// ---------- USER ----------

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  phone: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
}

// ---------- CATEGORY ----------

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  color: string | null;
  icon: string | null;
  itemCount: number;
  parentId: string | null;
  children?: Category[];
}

// ---------- BRAND ----------

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

// ---------- PRODUCT ----------

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  isMain: boolean;
  order: number;
}

export interface ProductSpec {
  id: string;
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDesc: string | null;
  category: Category;
  categoryId: string;
  brand: Brand | null;
  brandId: string | null;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  stock: number;
  inStock: boolean;
  unit: string;
  images: ProductImage[];
  badge: string | null;
  badgeColor: string | null;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  viewCount: number;
  soldCount: number;
  specifications: ProductSpec[];
  createdAt: Date;
  updatedAt: Date;
}

// ---------- REVIEW ----------

export interface Review {
  id: string;
  userId: string;
  user: Pick<User, "id" | "name" | "image">;
  productId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean;
  helpful: number;
  images: string[];
  createdAt: Date;
}

// ---------- CART ----------

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  userId?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  coupon: Coupon | null;
}

// ---------- ORDER ----------

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type PaymentMethod = "CARD" | "CASH_ON_DELIVERY" | "WALLET";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponDiscount: number;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingZip: string | null;
  shippingCountry: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  estimatedDelivery: Date | null;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- ADDRESS ----------

export interface Address {
  id: string;
  userId: string;
  type: "home" | "work" | "other";
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

// ---------- COUPON ----------

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";
  value: number;
  minOrderAmount: number;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date | null;
}

// ---------- BANNER ----------

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  badge: string | null;
  isActive: boolean;
  order: number;
}

// ---------- NOTIFICATION ----------

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "order";
  read: boolean;
  link: string | null;
  createdAt: Date;
}

// ---------- API ----------

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ---------- FILTER ----------

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  tags?: string[];
  search?: string;
  sort?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
  page?: number;
  pageSize?: number;
  isFeatured?: boolean;
}

// ---------- FORM TYPES ----------

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CheckoutFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  paymentMethod: PaymentMethod;
  saveAddress: boolean;
  notes?: string;
}

// ---------- NAV ----------

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}
