"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { CartProduct } from "@/types";
import { toast } from "sonner";

// ---------- TYPES ----------

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  variantName?: string;
  product: CartProduct;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  couponCode: string | null;
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; product: CartProduct; quantity?: number; variantId?: string; variantName?: string }
  | { type: "REMOVE_ITEM"; productId: string; variantId?: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number; variantId?: string }
  | { type: "APPLY_COUPON"; code: string; discount: number }
  | { type: "REMOVE_COUPON" }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; cart: Cart };

interface CartContextValue extends Cart {
  addItem: (product: CartProduct, quantity?: number, variantId?: string, variantName?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  isInCart: (productId: string, variantId?: string) => boolean;
  getItemQuantity: (productId: string, variantId?: string) => number;
  itemCount: number;
  isHydrated: boolean;
}

// ---------- CONSTANTS ----------

const SHIPPING_THRESHOLD = 50; // Free shipping above $50
const SHIPPING_COST = 5.99;
const TAX_RATE = 0.08; // 8%

// ---------- UTILS ----------

function sameLine(item: CartItem, productId: string, variantId?: string) {
  return item.productId === productId && (item.variantId ?? undefined) === (variantId ?? undefined);
}

function calcTotals(
  items: CartItem[],
  discount: number
): { subtotal: number; shipping: number; tax: number; total: number } {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discounted = Math.max(0, subtotal - discount);
  const tax = discounted * TAX_RATE;
  const total = discounted + shipping + tax;
  return { subtotal, shipping, tax, total };
}

// ---------- REDUCER ----------

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) =>
        sameLine(i, action.product.id, action.variantId)
      );
      let items: CartItem[];
      if (existing) {
        items = state.items.map((i) =>
          sameLine(i, action.product.id, action.variantId)
            ? { ...i, quantity: i.quantity + (action.quantity ?? 1) }
            : i
        );
      } else {
        items = [
          ...state.items,
          {
            id: `cart-${action.product.id}${action.variantId ? `-${action.variantId}` : ""}`,
            productId: action.product.id,
            variantId: action.variantId,
            variantName: action.variantName,
            product: action.product,
            quantity: action.quantity ?? 1,
          },
        ];
      }
      return { ...state, items, ...calcTotals(items, state.discount) };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter(
        (i) => !sameLine(i, action.productId, action.variantId)
      );
      return { ...state, items, ...calcTotals(items, state.discount) };
    }
    case "UPDATE_QUANTITY": {
      const items = action.quantity <= 0
        ? state.items.filter((i) => !sameLine(i, action.productId, action.variantId))
        : state.items.map((i) =>
            sameLine(i, action.productId, action.variantId)
              ? { ...i, quantity: action.quantity }
              : i
          );
      return { ...state, items, ...calcTotals(items, state.discount) };
    }
    case "APPLY_COUPON": {
      const totals = calcTotals(state.items, action.discount);
      return {
        ...state,
        couponCode: action.code,
        discount: action.discount,
        ...totals,
      };
    }
    case "REMOVE_COUPON": {
      const totals = calcTotals(state.items, 0);
      return { ...state, couponCode: null, discount: 0, ...totals };
    }
    case "CLEAR_CART":
      return { ...initialCart };
    case "LOAD_CART":
      return action.cart;
    default:
      return state;
  }
}

// ---------- INITIAL STATE ----------

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  discount: 0,
  couponCode: null,
  total: 0,
};

// ---------- CONTEXT ----------

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Persist to localStorage
  useEffect(() => {
    const stored = localStorage.getItem("fm_cart");
    if (stored) {
      try {
        dispatch({ type: "LOAD_CART", cart: JSON.parse(stored) });
      } catch {
        // ignore
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("fm_cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = useCallback((product: CartProduct, quantity = 1, variantId?: string, variantName?: string) => {
    if (!product.inStock) {
      toast.error("Product is out of stock");
      return;
    }
    dispatch({ type: "ADD_ITEM", product, quantity, variantId, variantName });
    toast.success(`${product.name} added to cart`, {
      action: {
        label: "View Cart",
        onClick: () => (window.location.href = "/cart"),
      },
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    dispatch({ type: "REMOVE_ITEM", productId, variantId });
    toast.info("Item removed from cart");
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variantId?: string) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity, variantId });
  }, []);

  const applyCoupon = useCallback((code: string, discount: number) => {
    dispatch({ type: "APPLY_COUPON", code, discount });
  }, []);

  const removeCoupon = useCallback(() => {
    dispatch({ type: "REMOVE_COUPON" });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const isInCart = useCallback(
    (productId: string, variantId?: string) =>
      cart.items.some((i) => sameLine(i, productId, variantId)),
    [cart.items]
  );

  const getItemQuantity = useCallback(
    (productId: string, variantId?: string) =>
      cart.items.find((i) => sameLine(i, productId, variantId))?.quantity ?? 0,
    [cart.items]
  );

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...cart,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        isInCart,
        getItemQuantity,
        itemCount,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}