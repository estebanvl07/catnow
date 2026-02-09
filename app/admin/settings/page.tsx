"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Save, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import type { Store, LayoutTemplate } from "@/lib/types"
import { LayoutPreview } from "@/components/admin/layout-preview"

const colorOptions = [
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "blue", label: "Azul", class: "bg-blue-500" },
  { value: "emerald", label: "Esmeralda", class: "bg-emerald-500" },
  { value: "rose", label: "Rosa", class: "bg-rose-500" },
  { value: "amber", label: "Ambar", class: "bg-amber-500" },
  { value: "slate", label: "Slate", class: "bg-slate-500" },
]

export default function AdminSettingsPage() {
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [primaryColor, setPrimaryColor] = useState("indigo")
  const [layoutTemplate, setLayoutTemplate] = useState<LayoutTemplate>("classic")

  const fetchStore = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (data) {
      setStore(data)
      setName(data.name)
      setWhatsapp(data.whatsapp_number || "")
      setLogoUrl(data.logo_url || "")
      setPrimaryColor(data.primary_color || "indigo")
      setLayoutTemplate(data.layout_template || "classic")
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStore()
  }, [fetchStore])

  async function handleSave() {
    if (!store) return
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from("stores")
      .update({
        name: name.trim(),
        whatsapp_number: whatsapp.trim() || null,
        logo_url: logoUrl.trim() || null,
        primary_color: primaryColor,
        layout_template: layoutTemplate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", store.id)

    if (error) {
      toast.error("Error al guardar la configuracion")
    } else {
      toast.success("Configuracion guardada")
      fetchStore()
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Configuracion
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Personaliza tu tienda y catalogo
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="layout">Diseno</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col gap-2">
              <Label>Nombre de la tienda</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mi Tienda"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Slug</Label>
              <Input value={store?.slug || ""} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">
                El slug no se puede cambiar despues de crear la tienda
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Numero de WhatsApp</Label>
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+58 412 1234567"
              />
              <p className="text-xs text-muted-foreground">
                Los pedidos se enviaran a este numero. Incluye el codigo de pais.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label>
                URL del logo{" "}
                <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <Button onClick={handleSave} disabled={saving} className="gap-2 self-end">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Guardar cambios
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="layout">
          <div className="flex flex-col gap-8">
            {/* Color picker */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <Label className="mb-3 block text-base font-medium">
                Color principal
              </Label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setPrimaryColor(color.value)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${color.class} transition-transform ${
                      primaryColor === color.value
                        ? "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background"
                        : "hover:scale-105"
                    }`}
                    aria-label={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Layout picker */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <Label className="mb-4 block text-base font-medium">
                Diseno del catalogo
              </Label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {(["classic", "modern", "minimal"] as LayoutTemplate[]).map(
                  (layout) => (
                    <button
                      key={layout}
                      type="button"
                      onClick={() => setLayoutTemplate(layout)}
                      className={`group flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                        layoutTemplate === layout
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <LayoutPreview layout={layout} />
                      <span className="text-sm font-medium capitalize text-foreground">
                        {layout === "classic"
                          ? "Clasico"
                          : layout === "modern"
                            ? "Moderno"
                            : "Minimalista"}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="gap-2 self-end">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Guardar cambios
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
