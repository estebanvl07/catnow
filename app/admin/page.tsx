"use client"

import { useEffect, useState, useCallback } from "react"
import {
  getMyStore,
  getMySections,
  createSection,
  updateSection,
  deleteSection,
} from "@/app/admin/actions"
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  LayoutGrid,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Section } from "@/lib/types"

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Section | null>(null)
  const [formName, setFormName] = useState("")
  const [formDesc, setFormDesc] = useState("")
  const [saving, setSaving] = useState(false)
  const [storeId, setStoreId] = useState<string | null>(null)

  const fetchSections = useCallback(async () => {
    const [store, data] = await Promise.all([getMyStore(), getMySections()])
    if (store) setStoreId(store.id)
    setSections(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  function openCreate() {
    setEditing(null)
    setFormName("")
    setFormDesc("")
    setDialogOpen(true)
  }

  function openEdit(section: Section) {
    setEditing(section)
    setFormName(section.name)
    setFormDesc(section.description || "")
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!formName.trim() || !storeId) return
    setSaving(true)

    if (editing) {
      const res = await updateSection(editing.id, {
        name: formName.trim(),
        description: formDesc.trim() || null,
      })
      if (res.success) toast.success("Seccion actualizada")
      else toast.error(res.error ?? "Error al actualizar la seccion")
    } else {
      const res = await createSection({
        name: formName.trim(),
        description: formDesc.trim() || null,
        sortOrder: sections.length,
      })
      if (res.success) toast.success("Seccion creada")
      else toast.error(res.error ?? "Error al crear la seccion")
    }

    setSaving(false)
    setDialogOpen(false)
    fetchSections()
  }

  async function handleDelete(id: string) {
    const res = await deleteSection(id)
    if (res.success) toast.success("Seccion eliminada")
    else toast.error(res.error ?? "Error al eliminar")
    fetchSections()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Secciones
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organiza tus productos en categorias
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva seccion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar seccion" : "Nueva seccion"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-2">
                <Label>Nombre</Label>
                <Input
                  placeholder="Ej: Ropa, Accesorios, Tecnologia..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  Descripcion{" "}
                  <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <Textarea
                  placeholder="Breve descripcion de la seccion..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                />
              </div>
              <Button onClick={handleSave} disabled={saving || !formName.trim()}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Guardar cambios" : "Crear seccion"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20">
          <LayoutGrid className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Sin secciones
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea tu primera seccion para empezar a organizar productos
          </p>
          <Button onClick={openCreate} className="mt-6 gap-2">
            <Plus className="h-4 w-4" />
            Crear seccion
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <GripVertical className="h-5 w-5 shrink-0 text-muted-foreground/50" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{section.name}</h3>
                {section.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {section.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(section)}
                  aria-label="Editar seccion"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(section.id)}
                  aria-label="Eliminar seccion"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
