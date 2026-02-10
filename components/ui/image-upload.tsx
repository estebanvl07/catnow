"use client";

import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadImage, validateImageFile } from "@/lib/cloudinary";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file) return;

      // Validar archivo
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }

      setUploading(true);

      try {
        // Crear preview temporal
        const tempPreview = URL.createObjectURL(file);
        setPreview(tempPreview);

        // Subir a Cloudinary
        const result = await uploadImage(file);

        // Limpiar preview temporal
        URL.revokeObjectURL(tempPreview);

        // Actualizar estado
        setPreview(result.url);
        onChange(result.url);

        toast.success("Imagen subida correctamente");
      } catch (error) {
        // Limpiar preview temporal en caso de error
        setPreview(value);
        toast.error(
          error instanceof Error ? error.message : "Error al subir la imagen",
        );
      } finally {
        setUploading(false);
      }
    },
    [onChange, value],
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
      // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
      event.target.value = "";
    },
    [handleFileSelect],
  );

  const handleCameraChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
      // Limpiar el input para permitir tomar la misma foto nuevamente
      event.target.value = "";
    },
    [handleFileSelect],
  );

  const handleRemove = useCallback(() => {
    setPreview(undefined);
    onChange(undefined);
    toast.success("Imagen eliminada");
  }, [onChange]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const openCamera = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Input oculto para selección de archivo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />

      {/* Input oculto para cámara */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        capture="environment"
        onChange={handleCameraChange}
        disabled={disabled || uploading}
        className="hidden"
      />

      {/* Preview de la imagen */}
      {preview ? (
        <div className="relative group">
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-border">
            <img
              src={preview}
              alt="Preview del producto"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Overlay con acciones */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={openFileDialog}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Reemplazar
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={openCamera}
              disabled={uploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              Cámara
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>

          {/* Indicador de carga */}
          {uploading && (
            <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-white text-sm">Subiendo imagen...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Estado vacío */
        <div className="border-2 border-dashed border-border rounded-lg p-8">
          <div className="text-center">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Sin imagen</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Agrega una imagen para tu producto
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                variant="outline"
                onClick={openFileDialog}
                disabled={disabled || uploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Subir archivo
              </Button>

              <Button
                variant="outline"
                onClick={openCamera}
                disabled={disabled || uploading}
                className="gap-2"
              >
                <Camera className="h-4 w-4" />
                Tomar foto
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Formatos: JPG, PNG, WebP (máx. 5MB)
            </p>
          </div>

          {/* Indicador de carga en estado vacío */}
          {uploading && (
            <div className="mt-4 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Subiendo imagen...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
