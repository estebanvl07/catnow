"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [storeName, setStoreName] = useState("")
  const [slug, setSlug] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  function handleNameChange(value: string) {
    setStoreName(value)
    const generated = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40)
    setSlug(generated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!storeName.trim() || !slug.trim()) {
      toast.error("El nombre y el slug son requeridos")
      return
    }

    setLoading(true)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("No se encontro tu sesion. Por favor inicia sesion de nuevo.")
      router.push("/auth/login")
      return
    }

    // Check if slug is available
    const { data: existing } = await supabase
      .from("stores")
      .select("id")
      .eq("slug", slug.trim())
      .single()

    if (existing) {
      toast.error("Ese slug ya esta en uso. Elige otro.")
      setLoading(false)
      return
    }

    const { error } = await supabase.from("stores").insert({
      user_id: user.id,
      name: storeName.trim(),
      slug: slug.trim(),
      whatsapp_number: whatsapp.trim() || null,
    })

    if (error) {
      toast.error("Error al crear tu tienda. Intenta de nuevo.")
      setLoading(false)
      return
    }

    toast.success("Tienda creada exitosamente!")
    router.push("/admin")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            CatalogoYa
          </span>
        </div>

        <div className="w-full rounded-2xl border border-border bg-card p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-foreground">
              Configura tu tienda
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Completa los datos de tu negocio para crear tu catalogo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="storeName">Nombre de tu tienda</Label>
              <Input
                id="storeName"
                placeholder="Mi Tienda Online"
                value={storeName}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">Slug (URL de tu catalogo)</Label>
              <div className="flex items-center gap-0 rounded-md border border-input">
                <span className="shrink-0 border-r border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                  catalogoya.com/
                </span>
                <Input
                  id="slug"
                  placeholder="mi-tienda"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "")
                        .slice(0, 40)
                    )
                  }
                  className="border-0 focus-visible:ring-0"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="whatsapp">
                Numero de WhatsApp{" "}
                <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="whatsapp"
                placeholder="+58 412 1234567"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Incluye el codigo de pais. Ej: +58, +1, +34
              </p>
            </div>

            <Button type="submit" disabled={loading} className="mt-2 gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {loading ? "Creando tienda..." : "Crear mi tienda"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
