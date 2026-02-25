import { getStoreColorStyles } from "@/lib/store-colors"
import type { Store } from "@/lib/types"

interface StoreThemeWrapperProps {
  store: Store
  children: React.ReactNode
}

/**
 * Envuelve el catálogo y aplica las variables CSS del color principal de la tienda,
 * para que botones, bordes y acentos usen el color elegido en configuración.
 */
export function StoreThemeWrapper({ store, children }: StoreThemeWrapperProps) {
  const style = getStoreColorStyles(store.primary_color)
  return (
    <div className="min-h-screen" style={style}>
      {children}
    </div>
  )
}
