import { prisma } from "@/lib/prisma"
import {
  mapPrismaStoreToStore,
  mapPrismaProductToProduct,
} from "@/lib/db"
import { notFound } from "next/navigation"
import { StoreThemeWrapper } from "@/components/store/store-theme-wrapper"
import { ProductDetailView } from "@/components/store/product-detail-view"
import type { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{ slug: string; id: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug, id } = await params
  const store = await prisma.store.findUnique({
    where: { slug },
    select: { id: true, name: true },
  })
  if (!store) return { title: "Tienda no encontrada" }
  const product = await prisma.product.findFirst({
    where: { id, storeId: store.id, status: "active" },
    select: { name: true },
  })
  if (!product) return { title: "Producto no encontrado" }
  return {
    title: `${product.name} - ${store.name}`,
    description: product.name,
  }
}

export default async function StoreProductPage({ params }: ProductPageProps) {
  const { slug, id } = await params

  const storeRow = await prisma.store.findUnique({
    where: { slug },
  })
  if (!storeRow) notFound()

  const productRow = await prisma.product.findFirst({
    where: { id, storeId: storeRow.id, status: "active" },
  })
  if (!productRow) notFound()

  const store = mapPrismaStoreToStore(storeRow)
  const product = mapPrismaProductToProduct(productRow)

  return (
    <StoreThemeWrapper store={store}>
      <ProductDetailView store={store} product={product} />
    </StoreThemeWrapper>
  )
}
