"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { Product } from "@/types";
import { toast } from "sonner";

// ---------- TYPES ----------

interface CartItem {
  id: string;
  productId: string;
  product: Product;
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
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "APPLY_COUPON"; code: string; discount: number }
  | { type: "REMOVE_COUPON" }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; cart: Cart };

interface CartContextValue extends Cart {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  itemCount: number;
}

// ---------- CONSTANTS ----------

const SHIPPING_THRESHOLD = 50; // Free shipping above $50
const SHIPPING_COST = 5.99;
const TAX_RATE = 0.08; // 8%

// ---------- UTILS ----------

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
      const existing = state.items.find(
        (i) => i.productId === action.product.id
      );
      let items: CartItem[];
      if (existing) {
        items = state.items.map((i) =>
          i.productId === action.product.id
            ? { ...i, quantity: i.quantity + (action.quantity ?? 1) }
            : i
        );
      } else {
        items = [
          ...state.items,
          {
            id: `cart-${action.product.id}`,
            productId: action.product.id,
            product: action.product,
            quantity: action.quantity ?? 1,
          },
        ];
      }
      return { ...state, items, ...calcTotals(items, state.discount) };
    }

    case "REMOVE_ITEM": {
      const items = state.items.filter((i) => i.productId !== action.productId);
      return { ...state, items, ...calcTotals(items, state.discount) };
    }

    case "UPDATE_QUANTITY": {
      const items = action.quantity <= 0
        ? state.items.filter((i) => i.productId !== action.productId)
        : state.items.map((i) =>
            i.productId === action.productId
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
  }, []);

  useEffect(() => {
    localStorage.setItem("fm_cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    if (!product.inStock) {
      toast.error("Product is out of stock");
      return;
    }
    dispatch({ type: "ADD_ITEM", product, quantity });
    toast.success(`${product.name} added to cart`, {
      action: {
        label: "View Cart",
        onClick: () => (window.location.href = "/cart"),
      },
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId });
    toast.info("Item removed from cart");
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
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
    (productId: string) => cart.items.some((i) => i.productId === productId),
    [cart.items]
  );

  const getItemQuantity = useCallback(
    (productId: string) =>
      cart.items.find((i) => i.productId === productId)?.quantity ?? 0,
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
