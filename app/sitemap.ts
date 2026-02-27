import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? "https://example.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ]

  const stores = await prisma.store.findMany({
    select: { slug: true, updatedAt: true },
  })

  for (const store of stores) {
    entries.push({
      url: `${baseUrl}/store/${store.slug}`,
      lastModified: store.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  }

  const products = await prisma.product.findMany({
    where: { status: "active" },
    select: { id: true, updatedAt: true, store: { select: { slug: true } } },
  })

  for (const product of products) {
    entries.push({
      url: `${baseUrl}/store/${product.store.slug}/product/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    })
  }

  return entries
}
