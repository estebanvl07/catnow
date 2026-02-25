"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  ShoppingBag,
  LayoutGrid,
  Package,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import type { Store } from "@/lib/types"
import { useState } from "react"

const navItems = [
  { label: "Secciones", href: "/admin", icon: LayoutGrid },
  { label: "Productos", href: "/admin/products", icon: Package },
  { label: "Configuracion", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar({
  store,
  userEmail,
}: {
  store: Store
  userEmail: string
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await signOut({ callbackUrl: "/" })
  }

  const headerContent = (
    <div className="flex items-center gap-2 border-b border-border px-4 py-4 md:px-5 md:py-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
        <ShoppingBag className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="min-w-0 flex-1 truncate">
        <p className="truncate text-sm font-semibold text-foreground">
          {store.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          /{store.slug}
        </p>
      </div>
    </div>
  )

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="hidden md:block">{headerContent}</div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}

        <Link
          href={`/store/${store.slug}`}
          target="_blank"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          Ver catalogo
        </Link>
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center justify-between px-3">
          <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesion
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile: header fijo arriba con menú expandible */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="min-w-0 flex-1 truncate">
          <p className="truncate text-sm font-semibold text-foreground">
            {store.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            /{store.slug}
          </p>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar: en desktop estático; en mobile panel deslizable bajo el header */}
      <aside
        className={cn(
          "fixed left-0 top-14 bottom-0 z-40 w-64 border-r border-border bg-card transition-transform md:static md:top-0 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
