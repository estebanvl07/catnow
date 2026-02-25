"use client"

import type { Store, Product, Section } from "@/lib/types"
import { useCartStore } from "@/lib/cart-store"
import { CartDrawer } from "@/components/store/cart-drawer"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, ShoppingBag, Package, ArrowUpDown } from "lucide-react"
import { ProductDetailModal } from "@/components/store/product-detail-modal"

interface CardsLayoutProps {
  store: Store
  products: Product[]
  sections: Section[]
}

export function CardsLayout({
  store,
  products,
  sections,
}: CardsLayoutProps) {
  const { addItem } = useCartStore()
  const [selectedSection, setSelectedSection] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<string>("default")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filtered = products
    .filter((p) => p.status === "active")
    .filter((p) =>
      selectedSection === "all" ? true : p.section_id === selectedSection,
    )
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price_asc") return Number(a.price) - Number(b.price)
      if (sortBy === "price_desc") return Number(b.price) - Number(a.price)
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {store.logo_url && (
              <img
                src={store.logo_url || "/placeholder.svg"}
                alt={store.name}
                className="h-9 w-9 rounded-xl object-cover"
                crossOrigin="anonymous"
              />
            )}
            <h1 className="text-lg font-bold text-foreground">{store.name}</h1>
          </div>
          <CartDrawer
            whatsappNumber={store.whatsapp_number}
            storeName={store.name}
          />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sección" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {sections.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Por defecto</SelectItem>
                <SelectItem value="price_asc">Menor precio</SelectItem>
                <SelectItem value="price_desc">Mayor precio</SelectItem>
                <SelectItem value="name">Nombre A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20">
            <Package className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-sm text-muted-foreground">
              No se encontraron productos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30 cursor-pointer"
                onClick={() => {
                  setSelectedProduct(product)
                  setIsModalOpen(true)
                }}
              >
                {product.image_url ? (
                  <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] w-full items-center justify-center bg-muted">
                    <Package className="h-14 w-14 text-muted-foreground/30" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <span className="text-xl font-bold text-primary">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <Button
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        addItem(product)
                      }}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}
