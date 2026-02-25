"use client"

import type { Store, Product } from "@/lib/types"
import { useCartStore } from "@/lib/cart-store"
import { formatPrice } from "@/lib/format-price"
import { getProductImages } from "@/lib/product-image"
import { CartDrawer } from "@/components/store/cart-drawer"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ShoppingBag, Package, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface ProductDetailViewProps {
  store: Store
  product: Product
}

export function ProductDetailView({ store, product }: ProductDetailViewProps) {
  const { addItem } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const images = getProductImages(product)
  const currency = store.currency ?? "USD"
  const hasSizes = product.sizes?.length > 0
  const hasColors = product.colors?.length > 0
  const canAddToCart =
    (!hasSizes || selectedSize !== null) && (!hasColors || selectedColor !== null)

  const handleAddToCart = () => {
    if (!canAddToCart) return
    setIsAdding(true)
    addItem(product, {
      size: selectedSize ?? undefined,
      color: selectedColor ?? undefined,
    })
    setIsAdding(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link
            href={`/store/${store.slug}`}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>
          <div className="flex items-center gap-3">
            {store.logo_url && (
              <img
                src={store.logo_url}
                alt=""
                className="h-8 w-8 rounded-lg object-cover"
                crossOrigin="anonymous"
              />
            )}
            <span className="text-sm font-medium text-foreground">{store.name}</span>
          </div>
          <CartDrawer
            whatsappNumber={store.whatsapp_number}
            storeName={store.name}
            currency={currency}
          />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Galería: carrusel de imágenes (siempre que haya al menos una) */}
          <div className="aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted">
            {images.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-24 w-24 text-muted-foreground/30" />
              </div>
            ) : (
              <Carousel opts={{ loop: images.length > 1 }} className="h-full w-full">
                <CarouselContent className="h-full">
                  {images.map((url, i) => (
                    <CarouselItem key={i} className="h-full">
                      <img
                        src={url}
                        alt={`${product.name} - imagen ${i + 1}`}
                        className="h-full w-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 border-border bg-background/80" />
                <CarouselNext className="right-2 border-border bg-background/80" />
              </Carousel>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl font-bold text-primary">
              {formatPrice(Number(product.price), currency)}
            </p>
            {product.description && (
              <div className="mt-6 flex-1">
                <h2 className="text-sm font-semibold text-foreground">Descripción</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
            {hasSizes && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">Talla</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes!.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {hasColors && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-foreground mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors!.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      variant={selectedColor === color ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-8 border-t border-border pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={isAdding || !canAddToCart}
                className="w-full gap-2"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5" />
                {isAdding ? "Agregado" : "Agregar al carrito"}
              </Button>
              {!canAddToCart && (hasSizes || hasColors) && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {hasSizes && !selectedSize && "Elige una talla. "}
                  {hasColors && !selectedColor && "Elige un color."}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
