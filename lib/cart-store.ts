"use client"

import { create } from "zustand"
import type { CartItem, Product } from "@/lib/types"

export interface AddToCartOptions {
  size?: string | null
  color?: string | null
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, options?: AddToCartOptions) => void
  removeItem: (productId: string, options?: AddToCartOptions) => void
  updateQuantity: (productId: string, quantity: number, options?: AddToCartOptions) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, options) => {
    const size = options?.size ?? undefined
    const color = options?.color ?? undefined
    set((state) => {
      const existing = state.items.find(
        (i) =>
          i.product.id === product.id &&
          (i.size ?? "") === (size ?? "") &&
          (i.color ?? "") === (color ?? ""),
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id &&
            (i.size ?? "") === (size ?? "") &&
            (i.color ?? "") === (color ?? "")
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        }
      }
      return {
        items: [...state.items, { product, quantity: 1, size, color }],
      }
    })
  },
  removeItem: (productId, options) => {
    set((state) => {
      if (options !== undefined) {
        const size = options.size ?? ""
        const color = options.color ?? ""
        return {
          items: state.items.filter(
            (i) =>
              !(
                i.product.id === productId &&
                (i.size ?? "") === size &&
                (i.color ?? "") === color
              ),
          ),
        }
      }
      return {
        items: state.items.filter((i) => i.product.id !== productId),
      }
    })
  },
  updateQuantity: (productId, quantity, options) => {
    if (quantity <= 0) {
      get().removeItem(productId, options)
      return
    }
    set((state) => {
      if (options !== undefined) {
        const size = options.size ?? ""
        const color = options.color ?? ""
        return {
          items: state.items.map((i) =>
            i.product.id === productId &&
            (i.size ?? "") === size &&
            (i.color ?? "") === color
              ? { ...i, quantity }
              : i,
          ),
        }
      }
      const first = state.items.find((i) => i.product.id === productId)
      if (!first) return state
      return {
        items: state.items.map((i) =>
          i.product.id === productId &&
          (i.size ?? "") === (first.size ?? "") &&
          (i.color ?? "") === (first.color ?? "")
            ? { ...i, quantity }
            : i,
        ),
      }
    })
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    )
  },
  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  },
}))
