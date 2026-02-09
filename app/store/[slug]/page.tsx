import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { StoreRenderer } from "@/components/store/store-renderer"
import type { Metadata } from "next"

interface StorePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: store } = await supabase
    .from("stores")
    .select("name")
    .eq("slug", slug)
    .single()

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
  const supabase = await createClient()

  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!store) {
    notFound()
  }

  const [productsRes, sectionsRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .eq("status", "active")
      .order("created_at", { ascending: false }),
    supabase
      .from("sections")
      .select("*")
      .eq("store_id", store.id)
      .order("sort_order", { ascending: true }),
  ])

  return (
    <StoreRenderer
      store={store}
      products={productsRes.data || []}
      sections={sectionsRes.data || []}
    />
  )
}
