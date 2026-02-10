"use client";

import type { Store, Product, Section } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";
import { CartDrawer } from "@/components/store/cart-drawer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Package, ArrowUpDown } from "lucide-react";
import { ProductDetailModal } from "@/components/store/product-detail-modal";

interface MinimalLayoutProps {
  store: Store;
  products: Product[];
  sections: Section[];
}

export function MinimalLayout({
  store,
  products,
  sections,
}: MinimalLayoutProps) {
  const { addItem } = useCartStore();
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = products
    .filter((p) => p.status === "active")
    .filter((p) =>
      selectedSection === "all" ? true : p.section_id === selectedSection,
    )
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price_asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price_desc") return Number(b.price) - Number(a.price);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  // Group by section
  const groupedProducts = new Map<string, Product[]>();
  if (selectedSection === "all") {
    for (const section of sections) {
      const sectionProducts = filtered.filter(
        (p) => p.section_id === section.id,
      );
      if (sectionProducts.length > 0) {
        groupedProducts.set(section.name, sectionProducts);
      }
    }
    const uncategorized = filtered.filter((p) => !p.section_id);
    if (uncategorized.length > 0) {
      groupedProducts.set("Otros", uncategorized);
    }
  } else {
    groupedProducts.set("", filtered);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {store.logo_url && (
              <img
                src={store.logo_url || "/placeholder.svg"}
                alt={store.name}
                className="h-8 w-8 rounded-lg object-cover"
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

      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Search and filters */}
        <div className="mb-6 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-3">
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seccion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las secciones</SelectItem>
                {sections.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1">
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

        {/* Product list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20">
            <Package className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-sm text-muted-foreground">
              No se encontraron productos
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Array.from(groupedProducts.entries()).map(
              ([sectionName, sectionProducts]) => (
                <div key={sectionName}>
                  {sectionName && (
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {sectionName}
                    </h2>
                  )}
                  <div className="flex flex-col gap-2">
                    {sectionProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/30 cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsModalOpen(true);
                        }}
                      >
                        {product.image_url ? (
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            className="h-16 w-16 shrink-0 rounded-lg object-cover"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Package className="h-6 w-6 text-muted-foreground/30" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground line-clamp-1">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-base font-bold text-foreground">
                            ${Number(product.price).toFixed(2)}
                          </span>
                          <Button
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              addItem(product);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Agregar al carrito</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
