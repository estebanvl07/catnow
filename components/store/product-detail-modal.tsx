"use client";

import type { Product } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format-price";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingBag, Package } from "lucide-react";
import { useState } from "react";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency?: string;
}

export function ProductDetailModal({
  product,
  open,
  onOpenChange,
  currency = "USD",
}: ProductDetailModalProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addItem(product);
      onOpenChange(false);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
            {product.image_url ? (
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {formatPrice(Number(product.price), currency)}
              </h3>
            </div>

            {product.description && (
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Descripción
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full gap-2"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5" />
                {isAdding ? "Agregando..." : "Agregar al carrito"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
