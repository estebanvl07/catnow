"use client"

import type { Store, Product, Section } from "@/lib/types"
import { useCartStore } from "@/lib/cart-store"
import { formatPrice } from "@/lib/format-price"
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
import { Search, Plus, Package, ArrowUpDown } from "lucide-react"
import { ProductDetailModal } from "@/components/store/product-detail-modal"

interface CompactLayoutProps {
  store: Store
  products: Product[]
  sections: Section[]
}

export function CompactLayout({
  store,
  products,
  sections,
}: CompactLayoutProps) {
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
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-3">
          <div className="flex min-w-0 items-center gap-2">
            {store.logo_url && (
              <img
                src={store.logo_url || "/placeholder.svg"}
                alt={store.name}
                className="h-7 w-7 shrink-0 rounded-md object-cover"
                crossOrigin="anonymous"
              />
            )}
            <h1 className="truncate text-base font-bold text-foreground">
              {store.name}
            </h1>
          </div>
          <CartDrawer
            whatsappNumber={store.whatsapp_number}
            storeName={store.name}
            currency={store.currency ?? "USD"}
          />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-3 py-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="h-9 w-full text-sm sm:w-32">
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
              <SelectTrigger className="h-9 w-28 text-sm">
                <ArrowUpDown className="mr-1.5 h-3 w-3" />
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Defecto</SelectItem>
                <SelectItem value="price_asc">Precio ↑</SelectItem>
                <SelectItem value="price_desc">Precio ↓</SelectItem>
                <SelectItem value="name">Nombre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12">
            <Package className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">
              No se encontraron productos
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-2.5 py-2 transition-colors hover:border-primary/30 cursor-pointer"
                onClick={() => {
                  setSelectedProduct(product)
                  setIsModalOpen(true)
                }}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="h-11 w-11 shrink-0 rounded-md object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Package className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-foreground">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(Number(product.price), store.currency ?? "USD")}
                  </p>
                </div>
                <Button
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    addItem(product)
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Agregar</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        currency={store.currency ?? "USD"}
      />
    </div>
  )
}
