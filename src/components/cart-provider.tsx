"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number;
  name: string;
  priceCents: number;
  image?: string | null;
  quantity: number;
};

export type SavedItem = {
  id: number;
  name: string;
  priceCents: number;
  image?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
  subtotalCents: number;
  itemCount: number;
  saved: SavedItem[];
  toggleSaved: (item: SavedItem) => void;
  saveForLater: (item: SavedItem) => void;
  isSaved: (id: number) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "lunor-cart";
const SAVED_KEY = "lunor-saved";

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<SavedItem[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(SAVED_KEY);
    if (stored) {
      try {
        setSaved(JSON.parse(stored));
      } catch {
        setSaved([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }, [saved]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((entry) => entry.id === item.id);
        if (existing) {
          return prev.map((entry) =>
            entry.id === item.id
              ? { ...entry, quantity: entry.quantity + quantity }
              : entry
          );
        }
        return [...prev, { ...item, quantity }];
      });
    },
    []
  );

  const updateQuantity = useCallback((id: number, quantity: number) => {
    setItems((prev) =>
      prev
        .map((entry) => (entry.id === id ? { ...entry, quantity } : entry))
        .filter((entry) => entry.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const toggleSaved = useCallback((item: SavedItem) => {
    setSaved((prev) => {
      const exists = prev.some((entry) => entry.id === item.id);
      if (exists) {
        return prev.filter((entry) => entry.id !== item.id);
      }
      return [...prev, item];
    });
  }, []);

  const saveForLater = useCallback((item: SavedItem) => {
    setSaved((prev) => {
      const exists = prev.some((entry) => entry.id === item.id);
      if (exists) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const isSaved = useCallback(
    (id: number) => saved.some((entry) => entry.id === id),
    [saved]
  );

  const subtotalCents = useMemo(
    () => items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      subtotalCents,
      itemCount,
      saved,
      toggleSaved,
      saveForLater,
      isSaved,
    }),
    [
      items,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      subtotalCents,
      itemCount,
      saved,
      toggleSaved,
      saveForLater,
      isSaved,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
