export type LayoutTemplate = "classic" | "modern" | "minimal"
export type PlanType = "small" | "medium" | "superstore" | "custom"
export type ProductStatus = "active" | "inactive"

export interface Store {
  id: string
  user_id: string
  name: string
  slug: string
  logo_url: string | null
  whatsapp_number: string | null
  primary_color: string
  layout_template: LayoutTemplate
  plan: PlanType
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  store_id: string
  name: string
  description: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  store_id: string
  section_id: string | null
  name: string
  description: string | null
  price: number
  image_url: string | null
  status: ProductStatus
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export const PLAN_LIMITS: Record<PlanType, number> = {
  small: 100,
  medium: 300,
  superstore: 600,
  custom: 9999,
}
