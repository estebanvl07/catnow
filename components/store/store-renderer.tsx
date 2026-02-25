"use client"

import type { Store, Product, Section } from "@/lib/types"
import { ClassicLayout } from "@/components/store/layouts/classic"
import { ModernLayout } from "@/components/store/layouts/modern"
import { MinimalLayout } from "@/components/store/layouts/minimal"
import { CardsLayout } from "@/components/store/layouts/cards"
import { CompactLayout } from "@/components/store/layouts/compact"

interface StoreRendererProps {
  store: Store
  products: Product[]
  sections: Section[]
}

export function StoreRenderer({ store, products, sections }: StoreRendererProps) {
  switch (store.layout_template) {
    case "modern":
      return (
        <ModernLayout store={store} products={products} sections={sections} />
      )
    case "minimal":
      return (
        <MinimalLayout store={store} products={products} sections={sections} />
      )
    case "cards":
      return (
        <CardsLayout store={store} products={products} sections={sections} />
      )
    case "compact":
      return (
        <CompactLayout store={store} products={products} sections={sections} />
      )
    case "classic":
    default:
      return (
        <ClassicLayout store={store} products={products} sections={sections} />
      )
  }
}
