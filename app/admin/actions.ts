"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  mapPrismaStoreToStore,
  mapPrismaSectionToSection,
  mapPrismaProductToProduct,
} from "@/lib/db"
import type { Store, Section, Product } from "@/lib/types"

async function getStoreId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  const store = await prisma.store.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  })
  return store?.id ?? null
}

export async function getMyStore(): Promise<Store | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  const row = await prisma.store.findFirst({
    where: { userId: session.user.id },
  })
  return row ? mapPrismaStoreToStore(row) : null
}

export async function getMySections(): Promise<Section[]> {
  const storeId = await getStoreId()
  if (!storeId) return []
  const rows = await prisma.section.findMany({
    where: { storeId },
    orderBy: { sortOrder: "asc" },
  })
  return rows.map(mapPrismaSectionToSection)
}

export async function getMyProductsAndSections(): Promise<{
  products: Product[]
  sections: Section[]
} | null> {
  const storeId = await getStoreId()
  if (!storeId) return null
  const [products, sections] = await Promise.all([
    prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.section.findMany({
      where: { storeId },
      orderBy: { sortOrder: "asc" },
    }),
  ])
  return {
    products: products.map(mapPrismaProductToProduct),
    sections: sections.map(mapPrismaSectionToSection),
  }
}

export async function createSection(form: {
  name: string
  description: string | null
  sortOrder: number
}): Promise<{ success: boolean; error?: string }> {
  const storeId = await getStoreId()
  if (!storeId) return { success: false, error: "No autorizado" }
  try {
    await prisma.section.create({
      data: {
        storeId,
        name: form.name.trim(),
        description: form.description?.trim() || null,
        sortOrder: form.sortOrder,
      },
    })
    revalidatePath("/admin")
    return { success: true }
  } catch (e) {
    return { success: false, error: "Error al crear la sección" }
  }
}

export async function updateSection(
  id: string,
  form: { name: string; description: string | null }
): Promise<{ success: boolean; error?: string }> {
  const storeId = await getStoreId()
  if (!storeId) return { success: false, error: "No autorizado" }
  try {
    await prisma.section.updateMany({
      where: { id, storeId },
      data: {
        name: form.name.trim(),
        description: form.description?.trim() || null,
      },
    })
    revalidatePath("/admin")
    return { success: true }
  } catch {
    return { success: false, error: "Error al actualizar la sección" }
  }
}

export async function deleteSection(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const storeId = await getStoreId()
  if (!storeId) return { success: false, error: "No autorizado" }
  try {
    await prisma.section.deleteMany({ where: { id, storeId } })
    revalidatePath("/admin")
    return { success: true }
  } catch {
    return { success: false, error: "Error al eliminar. Verifica que no tenga productos asociados." }
  }
}

export async function createProduct(form: {
  storeId: string
  name: string
  description: string | null
  price: number
  sectionId: string | null
  imageUrl: string | null
  status: "active" | "inactive"
}): Promise<{ success: boolean; error?: string }> {
  const storeId = await getStoreId()
  if (!storeId || storeId !== form.storeId)
    return { success: false, error: "No autorizado" }
  try {
    await prisma.product.create({
      data: {
        storeId: form.storeId,
        name: form.name.trim(),
        description: form.description?.trim() || null,
        price: form.price,
        sectionId: form.sectionId || null,
        imageUrl: form.imageUrl?.trim() || null,
        status: form.status,
      },
    })
    revalidatePath("/admin")
    revalidatePath("/admin/products")
    return { success: true }
  } catch {
    return { success: false, error: "Error al crear el producto" }
  }
}

export async function updateProduct(
  id: string,
  form: {
    storeId: string
    name: string
    description: string | null
    price: number
    sectionId: string | null
    imageUrl: string | null
    status: "active" | "inactive"
  }
): Promise<{ success: boolean; error?: string }> {
  const storeId = await getStoreId()
  if (!storeId || storeId !== form.storeId)
    return { success: false, error: "No autorizado" }
  try {
    await prisma.product.updateMany({
      where: { id, storeId },
      data: {
        name: form.name.trim(),
        description: form.description?.trim() || null,
        price: form.price,
        sectionId: form.sectionId || null,
        imageUrl: form.imageUrl?.trim() || null,
        status: form.status,
      },
    })
    revalidatePath("/admin")
    revalidatePath("/admin/products")
    return { success: true }
  } catch {
    return { success: false, error: "Error al actualizar el producto" }
  }
}

export async function deleteProduct(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const storeId = await getStoreId()
  if (!storeId) return { success: false, error: "No autorizado" }
  try {
    await prisma.product.deleteMany({ where: { id, storeId } })
    revalidatePath("/admin")
    revalidatePath("/admin/products")
    return { success: true }
  } catch {
    return { success: false, error: "Error al eliminar el producto" }
  }
}

export async function createStore(form: {
  name: string
  slug: string
  whatsappNumber: string | null
}): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { success: false, error: "No autorizado" }

  const existing = await prisma.store.findUnique({
    where: { slug: form.slug.trim() },
    select: { id: true },
  })
  if (existing) return { success: false, error: "Ese slug ya está en uso. Elige otro." }

  try {
    await prisma.store.create({
      data: {
        userId: session.user.id,
        name: form.name.trim(),
        slug: form.slug.trim(),
        whatsappNumber: form.whatsappNumber?.trim() || null,
      },
    })
    revalidatePath("/admin")
    revalidatePath("/onboarding")
    return { success: true }
  } catch {
    return { success: false, error: "Error al crear tu tienda. Intenta de nuevo." }
  }
}

export async function updateStore(form: {
  storeId: string
  name: string
  whatsappNumber: string | null
  logoUrl: string | null
  primaryColor: string
  layoutTemplate: string
}): Promise<{ success: boolean; error?: string }> {
  const storeId = await getStoreId()
  if (!storeId || storeId !== form.storeId)
    return { success: false, error: "No autorizado" }
  try {
    const updated = await prisma.store.update({
      where: { id: form.storeId },
      data: {
        name: form.name.trim(),
        whatsappNumber: form.whatsappNumber?.trim() || null,
        logoUrl: form.logoUrl?.trim() || null,
        primaryColor: form.primaryColor,
        layoutTemplate: form.layoutTemplate,
      },
      select: { slug: true },
    })
    revalidatePath("/admin")
    revalidatePath("/admin/settings")
    revalidatePath(`/store/${updated.slug}`)
    return { success: true }
  } catch {
    return { success: false, error: "Error al guardar la configuración" }
  }
}
