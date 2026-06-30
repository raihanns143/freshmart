import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Flat cart item so page components can access item.price, item.name etc. directly
export interface CartItem {
  id: string;        // product ID
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  unit: string;
  images: { url: string; alt: string | null }[];
  quantity: number;
}

interface CartState {
  items: CartItem[];
  coupon: string | null;
  discountAmount: number;

  // Computed
  total: number;
  itemCount: number;

  // Actions
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
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

      addItem: (product: any, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          let newItems: CartItem[];
          if (existing) {
            newItems = state.items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
            );
          } else {
            const item: CartItem = {
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              originalPrice: product.originalPrice ?? null,
              unit: product.unit ?? "piece",
              images: product.images ?? [],
              quantity,
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

      removeItem: (productId: string) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== productId);
          return {
            items: newItems,
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
            total: calcTotal(newItems, state.discountAmount),
          };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          const newItems =
            quantity <= 0
              ? state.items.filter((i) => i.id !== productId)
              : state.items.map((i) => (i.id === productId ? { ...i, quantity } : i));
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
      isInCart: (productId: string) => {
        return get().items.some((i) => i.id === productId);
      },
      getItemQuantity: (productId: string) => {
        return get().items.find((i) => i.id === productId)?.quantity || 0;
      },
    }),
    {
      name: "freshmart-cart-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
