"use client"

import { useState, useRef, useCallback } from "react"
import { Camera, Upload, X, Loader2, Image as ImageIcon, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { uploadImage, validateImageFile } from "@/lib/cloudinary"
import { toast } from "sonner"

interface ImageUploadMultipleProps {
  value: string[]
  onChange: (urls: string[]) => void
  disabled?: boolean
  className?: string
  maxImages?: number
}

export function ImageUploadMultiple({
  value,
  onChange,
  disabled,
  className,
  maxImages = 10,
}: ImageUploadMultipleProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const urls = Array.isArray(value) ? value : []

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file || urls.length >= maxImages) return
      const validation = validateImageFile(file)
      if (!validation.valid) {
        toast.error(validation.error)
        return
      }
      setUploading(true)
      try {
        const result = await uploadImage(file)
        onChange([...urls, result.url])
        toast.success("Imagen agregada")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error al subir la imagen")
      } finally {
        setUploading(false)
      }
    },
    [urls, maxImages, onChange],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFileSelect(file)
      e.target.value = ""
    },
    [handleFileSelect],
  )

  const handleCameraChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFileSelect(file)
      e.target.value = ""
    },
    [handleFileSelect],
  )

  const remove = useCallback(
    (index: number) => {
      const next = urls.filter((_, i) => i !== index)
      onChange(next)
      toast.success("Imagen eliminada")
    },
    [urls, onChange],
  )

  const move = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= urls.length) return
      const next = [...urls]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      onChange(next)
    },
    [urls, onChange],
  )

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled || uploading || urls.length >= maxImages}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        capture="environment"
        onChange={handleCameraChange}
        disabled={disabled || uploading || urls.length >= maxImages}
        className="hidden"
      />

      {urls.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {urls.length} imagen{urls.length !== 1 ? "es" : ""} (la primera es la principal)
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {urls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                <img
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-1">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => move(index, index - 1)}
                      disabled={disabled}
                      title="Mover atrás"
                    >
                      <GripVertical className="h-4 w-4 rotate-90" />
                    </Button>
                  )}
                  {index < urls.length - 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => move(index, index + 1)}
                      disabled={disabled}
                      title="Mover adelante"
                    >
                      <GripVertical className="h-4 w-4 -rotate-90" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => remove(index)}
                    disabled={disabled}
                    title="Eliminar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
          {urls.length < maxImages && (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Añadir imagen
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => cameraInputRef.current?.click()}
                disabled={disabled || uploading}
                className="gap-2"
              >
                <Camera className="h-4 w-4" />
                Cámara
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-border p-8">
          <div className="text-center">
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-medium">Sin imágenes</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Añade una o varias imágenes para el producto (máx. {maxImages})
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Subir archivo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                disabled={disabled || uploading}
                className="gap-2"
              >
                <Camera className="h-4 w-4" />
                Tomar foto
              </Button>
            </div>
            {uploading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
