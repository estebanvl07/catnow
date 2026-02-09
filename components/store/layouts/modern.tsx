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

interface ModernLayoutProps {
  store: Store
  products: Product[]
  sections: Section[]
}

export function ModernLayout({ store, products, sections }: ModernLayoutProps) {
  const { addItem } = useCartStore()
  const [selectedSection, setSelectedSection] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<string>("default")

  const filtered = products
    .filter((p) => p.status === "active")
    .filter((p) =>
      selectedSection === "all" ? true : p.section_id === selectedSection,
    )
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "price_asc") return Number(a.price) - Number(b.price)
      if (sortBy === "price_desc") return Number(b.price) - Number(a.price)
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {store.logo_url && (
              <img
                src={store.logo_url || "/placeholder.svg"}
                alt={store.name}
                className="h-8 w-8 rounded-full object-cover"
                crossOrigin="anonymous"
              />
            )}
            <h1 className="text-lg font-bold text-foreground">{store.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-9"
              />
            </div>
            <CartDrawer whatsappNumber={store.whatsapp_number} storeName={store.name} />
          </div>
        </div>
        <div className="border-b border-border" />
      </header>

      {/* Hero banner */}
      <div className="bg-primary/5">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground">
            {store.name}
          </h2>
          <p className="mt-2 text-muted-foreground">
            Explora nuestro catalogo y haz tu pedido por WhatsApp
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Section tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedSection("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedSection === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Todo
          </button>
          {sections.map((section) => (
            <button
              type="button"
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedSection === section.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>

        {/* Mobile search + sort */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:hidden">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
          </p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44">
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

        {/* Products Grid - 2 columns */}
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
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
              >
                {product.image_url ? (
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center bg-muted">
                    <Package className="h-14 w-14 text-muted-foreground/20" />
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
                    <span className="text-xl font-bold text-foreground">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <Button className="gap-2" onClick={() => addItem(product)}>
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
    </div>
  )
}
