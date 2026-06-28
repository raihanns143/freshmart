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

interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: Date;
}

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "CLEAR" }
  | { type: "LOAD"; items: WishlistItem[] };

interface WishlistContextValue extends WishlistState {
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggle: (product: Product) => void;
  clear: () => void;
  isInWishlist: (productId: string) => boolean;
}

// ---------- REDUCER ----------

function reducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      if (state.items.some((i) => i.productId === action.product.id)) {
        return state;
      }
      return {
        items: [
          ...state.items,
          {
            id: `wish-${action.product.id}`,
            productId: action.product.id,
            product: action.product,
            addedAt: new Date(),
          },
        ],
      };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter((i) => i.productId !== action.productId),
      };

    case "CLEAR":
      return { items: [] };

    case "LOAD":
      return { items: action.items };

    default:
      return state;
  }
}

// ---------- CONTEXT ----------

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    const stored = localStorage.getItem("fm_wishlist");
    if (stored) {
      try {
        dispatch({ type: "LOAD", items: JSON.parse(stored) });
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("fm_wishlist", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = useCallback((product: Product) => {
    dispatch({ type: "ADD_ITEM", product });
    toast.success(`${product.name} added to wishlist`, {
      icon: "❤️",
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId });
    toast.info("Removed from wishlist");
  }, []);

  const toggle = useCallback(
    (product: Product) => {
      const inWishlist = state.items.some((i) => i.productId === product.id);
      if (inWishlist) {
        dispatch({ type: "REMOVE_ITEM", productId: product.id });
        toast.info("Removed from wishlist");
      } else {
        dispatch({ type: "ADD_ITEM", product });
        toast.success(`${product.name} added to wishlist`, { icon: "❤️" });
      }
    },
    [state.items]
  );

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => state.items.some((i) => i.productId === productId),
    [state.items]
  );

  return (
    <WishlistContext.Provider
      value={{ ...state, addItem, removeItem, toggle, clear, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
