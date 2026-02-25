import { prisma } from "@/lib/prisma"
import {
  mapPrismaStoreToStore,
  mapPrismaSectionToSection,
  mapPrismaProductToProduct,
} from "@/lib/db"
import { notFound } from "next/navigation"
import { StoreRenderer } from "@/components/store/store-renderer"
import type { Metadata } from "next"

interface StorePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { slug } = await params
  const store = await prisma.store.findUnique({
    where: { slug },
    select: { name: true },
  })

  if (!store) {
    return { title: "Tienda no encontrada" }
  }

  return {
    title: `${store.name} - Catalogo`,
    description: `Explora el catalogo de ${store.name} y haz tu pedido por WhatsApp.`,
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params

  const storeRow = await prisma.store.findUnique({
    where: { slug },
    include: {
      products: {
        where: { status: "active" },
        orderBy: { createdAt: "desc" },
      },
      sections: {
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  if (!storeRow) {
    notFound()
  }

  const store = mapPrismaStoreToStore(storeRow)
  const products = storeRow.products.map(mapPrismaProductToProduct)
  const sections = storeRow.sections.map(mapPrismaSectionToSection)

  return (
    <StoreRenderer
      store={store}
      products={products}
      sections={sections}
    />
  )
}
