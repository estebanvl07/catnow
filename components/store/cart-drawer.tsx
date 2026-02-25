"use client"

import { useCartStore } from "@/lib/cart-store"
import { formatPrice } from "@/lib/format-price"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

interface CartDrawerProps {
  whatsappNumber: string | null
  storeName: string
  currency?: string
}

export function CartDrawer({ whatsappNumber, storeName, currency = "USD" }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } =
    useCartStore()
  const [open, setOpen] = useState(false)
  const itemCount = getItemCount()
  const total = getTotal()

  function handleCheckout() {
    if (!whatsappNumber || items.length === 0) return

    const header = `Hola! Me gustaria hacer un pedido de *${storeName}*:\n\n`
    const itemLines = items
      .map(
        (item, i) =>
          `${i + 1}. *${item.product.name}* x${item.quantity} - ${formatPrice(Number(item.product.price) * item.quantity, currency)}`,
      )
      .join("\n")
    const footer = `\n\n*Total: ${formatPrice(total, currency)}*\n\nGracias!`
    const message = encodeURIComponent(header + itemLines + footer)
    const cleanNumber = whatsappNumber.replace(/\D/g, "")
    const url = `https://wa.me/${cleanNumber}?text=${message}`

    window.open(url, "_blank")
    clearCart()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Carrito de compras</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Carrito ({itemCount})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Tu carrito esta vacio</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-4 py-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-start gap-3">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        className="h-16 w-16 shrink-0 rounded-lg border border-border object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                        <ShoppingCart className="h-5 w-5 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-sm font-semibold text-foreground">
                        {formatPrice(Number(item.product.price), currency)}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-transparent"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-foreground">Total</span>
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(total, currency)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                className="gap-2"
                disabled={!whatsappNumber}
              >
                <MessageCircle className="h-4 w-4" />
                Pedir por WhatsApp
              </Button>
              {!whatsappNumber && (
                <p className="text-center text-xs text-muted-foreground">
                  La tienda no ha configurado WhatsApp
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
