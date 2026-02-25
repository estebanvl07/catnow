import type { Store, Section, Product } from "@/lib/types"
import type { Store as PrismaStore, Section as PrismaSection, Product as PrismaProduct } from "@prisma/client"

export function mapPrismaStoreToStore(s: PrismaStore): Store {
  return {
    id: s.id,
    user_id: s.userId,
    name: s.name,
    slug: s.slug,
    logo_url: s.logoUrl,
    whatsapp_number: s.whatsappNumber,
    primary_color: s.primaryColor,
    layout_template: s.layoutTemplate as Store["layout_template"],
    currency: (s as PrismaStore & { currency?: string }).currency ?? "USD",
    plan: s.plan as Store["plan"],
    created_at: s.createdAt.toISOString(),
    updated_at: s.updatedAt.toISOString(),
  }
}

export function mapPrismaSectionToSection(s: PrismaSection): Section {
  return {
    id: s.id,
    store_id: s.storeId,
    name: s.name,
    description: s.description,
    sort_order: s.sortOrder,
    created_at: s.createdAt.toISOString(),
    updated_at: s.updatedAt.toISOString(),
  }
}

export function mapPrismaProductToProduct(p: PrismaProduct): Product {
  const imageUrls = (p as PrismaProduct & { imageUrls?: string[] }).imageUrls ?? []
  const sizes = "sizes" in p && Array.isArray((p as { sizes?: string[] }).sizes) ? (p as { sizes: string[] }).sizes : []
  const colors = "colors" in p && Array.isArray((p as { colors?: string[] }).colors) ? (p as { colors: string[] }).colors : []
  return {
    id: p.id,
    store_id: p.storeId,
    section_id: p.sectionId,
    name: p.name,
    description: p.description,
    price: p.price,
    image_url: p.imageUrl,
    image_urls: imageUrls.length > 0 ? imageUrls : (p.imageUrl ? [p.imageUrl] : []),
    sizes,
    colors,
    status: p.status as Product["status"],
    created_at: p.createdAt.toISOString(),
    updated_at: p.updatedAt.toISOString(),
  }
}
