import type { Product } from "@/lib/types"

/** Devuelve la lista de imágenes del producto (múltiples o una derivada de image_url). */
export function getProductImages(product: Product): string[] {
  if (product.image_urls?.length) return product.image_urls
  if (product.image_url) return [product.image_url]
  return []
}

/** Devuelve la primera imagen del producto para listados y miniaturas. */
export function getProductFirstImage(product: Product): string | null {
  const images = getProductImages(product)
  return images[0] ?? null
}
