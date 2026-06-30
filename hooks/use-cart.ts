import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;        // product ID
  variantId?: string; // variant ID (optional)
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  unit: string;
  images: { url: string; alt: string | null }[];
  quantity: number;
  variantName?: string; // e.g. "Large / Red"
}

interface CartState {
  items: CartItem[];
  coupon: string | null;
  discountAmount: number;

  total: number;
  itemCount: number;

  addItem: (product: any, quantity?: number, variant?: any) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  isInCart: (productId: string, variantId?: string) => boolean;
  getItemQuantity: (productId: string, variantId?: string) => number;
  mergeGuestCart: (serverItems: CartItem[]) => void;
}

function calcTotal(items: CartItem[], discount: number): number {
  const sub = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return Math.max(0, sub - discount);
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      discountAmount: 0,
      total: 0,
      itemCount: 0,

      addItem: (product: any, quantity = 1, variant?: any) => {
        set((state) => {
          const productId = product.id;
          const variantId = variant?.id;
          const existing = state.items.find(
            (i) => i.id === productId && i.variantId === variantId
          );
          let newItems: CartItem[];
          if (existing) {
            newItems = state.items.map((i) =>
              i.id === productId && i.variantId === variantId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
          } else {
            const item: CartItem = {
              id: productId,
              variantId: variantId || undefined,
              name: product.name,
              slug: product.slug,
              price: variant?.price ?? product.price,
              originalPrice: variant?.salePrice ?? product.originalPrice ?? null,
              unit: product.unit ?? "piece",
              images: product.images ?? [],
              quantity,
              variantName: variant
                ? `${variant.size ?? ""}${variant.size && variant.color ? " / " : ""}${variant.color ?? ""}`.trim()
                : undefined,
            };
            newItems = [...state.items, item];
          }
          return {
            items: newItems,
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
            total: calcTotal(newItems, state.discountAmount),
          };
        });
      },

      removeItem: (productId: string, variantId?: string) => {
        set((state) => {
          const newItems = state.items.filter(
            (i) => !(i.id === productId && i.variantId === variantId)
          );
          return {
            items: newItems,
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
            total: calcTotal(newItems, state.discountAmount),
          };
        });
      },

      updateQuantity: (productId: string, quantity: number, variantId?: string) => {
        set((state) => {
          const newItems =
            quantity <= 0
              ? state.items.filter((i) => !(i.id === productId && i.variantId === variantId))
              : state.items.map((i) =>
                  i.id === productId && i.variantId === variantId ? { ...i, quantity } : i
                );
          return {
            items: newItems,
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
            total: calcTotal(newItems, state.discountAmount),
          };
        });
      },

      clearCart: () => {
        set({ items: [], coupon: null, discountAmount: 0, total: 0, itemCount: 0 });
      },

      applyCoupon: (code: string, discount: number) => {
        set((state) => ({
          coupon: code,
          discountAmount: discount,
          total: calcTotal(state.items, discount),
        }));
      },

      removeCoupon: () => {
        set((state) => ({
          coupon: null,
          discountAmount: 0,
          total: calcTotal(state.items, 0),
        }));
      },
      isInCart: (productId: string, variantId?: string) => {
        return get().items.some((i) => i.id === productId && i.variantId === variantId);
      },
      getItemQuantity: (productId: string, variantId?: string) => {
        return get().items.find((i) => i.id === productId && i.variantId === variantId)?.quantity || 0;
      },
      mergeGuestCart: (serverItems: CartItem[]) => {
        set((state) => {
          const merged = [...state.items];
          for (const serverItem of serverItems) {
            const existing = merged.find(
              (i) => i.id === serverItem.id && i.variantId === serverItem.variantId
            );
            if (existing) {
              existing.quantity = Math.max(existing.quantity, serverItem.quantity);
            } else {
              merged.push(serverItem);
            }
          }
          return {
            items: merged,
            itemCount: merged.reduce((sum, i) => sum + i.quantity, 0),
            total: calcTotal(merged, state.discountAmount),
          };
        });
      },
    }),
    {
      name: "freshmart-cart-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
