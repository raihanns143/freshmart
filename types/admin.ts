// =====================================================
// SHARED ADMIN TYPES
// Centralizes all TypeScript types for the Admin Panel
// =====================================================

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "SPAM";

export type UserRole =
  | "USER"
  | "EDITOR"
  | "MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN";

export type CouponType = "PERCENTAGE" | "FIXED";

export type InventoryType =
  | "PURCHASE"
  | "SALE"
  | "RETURN"
  | "ADJUSTMENT"
  | "DAMAGE";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
