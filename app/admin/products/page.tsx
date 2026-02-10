"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, Loader2, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Product, Section } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterSection, setFilterSection] = useState<string>("all");

  // Form state
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formSection, setFormSection] = useState<string>("none");
  const [formImageUrl, setFormImageUrl] = useState<string | undefined>(
    undefined,
  );
  const [formActive, setFormActive] = useState(true);

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!store) return;
    setStoreId(store.id);

    const [productsRes, sectionsRes] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("sections")
        .select("*")
        .eq("store_id", store.id)
        .order("sort_order", { ascending: true }),
    ]);

    setProducts(productsRes.data || []);
    setSections(sectionsRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function openCreate() {
    setEditing(null);
    setFormName("");
    setFormDesc("");
    setFormPrice("");
    setFormSection("none");
    setFormImageUrl(undefined);
    setFormActive(true);
    setDialogOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setFormName(product.name);
    setFormDesc(product.description || "");
    setFormPrice(String(product.price));
    setFormSection(product.section_id || "none");
    setFormImageUrl(product.image_url || undefined);
    setFormActive(product.status === "active");
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!formName.trim() || !storeId || !formPrice) return;
    setSaving(true);
    const supabase = createClient();

    const payload = {
      store_id: storeId,
      name: formName.trim(),
      description: formDesc.trim() || null,
      price: Number.parseFloat(formPrice),
      section_id: formSection === "none" ? null : formSection,
      image_url: formImageUrl?.trim() || null,
      status: formActive ? ("active" as const) : ("inactive" as const),
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editing.id);

      if (error) {
        toast.error("Error al actualizar el producto");
      } else {
        toast.success("Producto actualizado");
      }
    } else {
      const { error } = await supabase.from("products").insert(payload);

      if (error) {
        toast.error("Error al crear el producto");
      } else {
        toast.success("Producto creado");
      }
    }

    setSaving(false);
    setDialogOpen(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar el producto");
    } else {
      toast.success("Producto eliminado");
      fetchData();
    }
  }

  const sectionMap = new Map(sections.map((s) => [s.id, s.name]));

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesSection =
      filterSection === "all" || p.section_id === filterSection;
    return matchesSearch && matchesSection;
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Productos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} producto{products.length !== 1 ? "s" : ""}{" "}
            registrado{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar producto" : "Nuevo producto"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-2">
                <Label>Nombre</Label>
                <Input
                  placeholder="Nombre del producto"
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
                  placeholder="Descripcion del producto..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Precio</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Seccion</Label>
                  <Select value={formSection} onValueChange={setFormSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sin seccion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin seccion</SelectItem>
                      {sections.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  Imagen del producto{" "}
                  <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <ImageUpload
                  value={formImageUrl}
                  onChange={setFormImageUrl}
                  disabled={saving}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <Label className="cursor-pointer">Producto activo</Label>
                <Switch checked={formActive} onCheckedChange={setFormActive} />
              </div>
              <Button
                onClick={handleSave}
                disabled={saving || !formName.trim() || !formPrice}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Guardar cambios" : "Crear producto"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterSection} onValueChange={setFilterSection}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Todas las secciones" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las secciones</SelectItem>
            {sections.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20">
          <Package className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            {products.length === 0 ? "Sin productos" : "Sin resultados"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length === 0
              ? "Agrega tu primer producto para empezar a vender"
              : "Intenta con otra busqueda o filtro"}
          </p>
          {products.length === 0 && (
            <Button onClick={openCreate} className="mt-6 gap-2">
              <Plus className="h-4 w-4" />
              Agregar producto
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-colors hover:border-primary/30"
            >
              {product.image_url ? (
                <div className="relative aspect-video w-full bg-muted">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-muted">
                  <Package className="h-10 w-10 text-muted-foreground/30" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-foreground line-clamp-1">
                    {product.name}
                  </h3>
                  <Badge
                    variant={
                      product.status === "active" ? "default" : "secondary"
                    }
                    className="shrink-0 text-xs"
                  >
                    {product.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                {product.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.section_id && sectionMap.has(product.section_id) && (
                    <Badge variant="outline" className="text-xs">
                      {sectionMap.get(product.section_id)}
                    </Badge>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-1 border-t border-border pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(product)}
                    className="gap-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="gap-1.5 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
