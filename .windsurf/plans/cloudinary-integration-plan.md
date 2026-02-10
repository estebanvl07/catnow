# Plan: Integración de Cloudinary para Subida de Imágenes con Captura de Cámara

Este plan describe la integración de Cloudinary para la subida de imágenes en el modal de creación de productos, incluyendo la opción de tomar fotos con la cámara del dispositivo.

## Análisis Actual

El proyecto actualmente tiene:

- Un modal de creación/edición de productos en `app/admin/products/page.tsx`
- Un campo de texto simple para URL de imagen (líneas 253-263)
- Componentes UI consistentes basados en shadcn/ui
- Next.js 16.1.6 con React 19
- Variable de entorno `NEXT_PUBLIC_CLOUDINARY_URL` disponible

## Objetivos

1. **Reemplazar el campo de URL de imagen actual** con un componente de subida de archivos
2. **Integrar Cloudinary** para el almacenamiento de imágenes
3. **Añadir captura de cámara** como opción alternativa
4. **Mantener consistencia** con los componentes UI existentes
5. **Proporcionar preview** de la imagen antes de guardar

## Implementación

### 1. Instalar dependencias de Cloudinary

- Agregar `cloudinary` y `@cloudinary/react` al package.json

### 2. Crear utilidad de Cloudinary

- Crear `lib/cloudinary.ts` con configuración y funciones de subida
- Usar `NEXT_PUBLIC_CLOUDINARY_URL` para configuración

### 3. Crear componente de subida de imágenes

- Crear `components/ui/image-upload.tsx`
- Incluir:
  - Botón para seleccionar archivo
  - Botón para tomar foto con cámara
  - Preview de imagen
  - Indicador de progreso
  - Manejo de errores

### 4. Modificar el modal de productos

- Reemplazar el Input de URL (líneas 253-263) con el nuevo componente
- Actualizar el estado `formImageUrl` para manejar el proceso de subida
- Mantener la funcionalidad de edición existente

### 5. Funcionalidades específicas

#### Subida de archivo:

- Input type="file" con aceptación de imágenes
- Validación de tipo y tamaño de archivo
- Subida directa a Cloudinary

#### Captura de cámara:

- Input type="file" con capture="environment"
- Acceso a cámara del dispositivo
- Mismo flujo de subida que archivo

#### Preview y gestión:

- Mostrar imagen actual durante edición
- Permitir reemplazar imagen
- Opción de eliminar imagen

## Componentes a modificar/crear

### Nuevo: `lib/cloudinary.ts`

```typescript
// Configuración de Cloudinary y funciones de subida
```

### Nuevo: `components/ui/image-upload.tsx`

```typescript
// Componente reutilizable para subida de imágenes
// Con opciones de archivo y cámara
// Preview y gestión de estado
```

### Modificar: `app/admin/products/page.tsx`

- Importar nuevo componente
- Reemplazar Input de URL
- Actualizar manejo de estado

## Consideraciones técnicas

1. **Seguridad**: Usar unsigned upload presets para simplicidad
2. **UX**: Indicadores de carga durante subida
3. **Validación**: Tipos de archivo permitidos (jpg, png, webp)
4. **Tamaño**: Límite razonable de tamaño de archivo
5. **Responsivo**: Componente funcional en móviles y desktop
6. **Accesibilidad**: Labels y aria-labels apropiados

## Flujo de usuario

1. Usuario abre modal de creación/edición
2. Sección de imagen muestra:
   - Imagen actual (si editando)
   - Botón "Subir archivo"
   - Botón "Tomar foto"
3. Usuario selecciona opción:
   - Archivo: abre selector de archivos
   - Cámara: abre interfaz de cámara
4. Imagen se sube a Cloudinary con progreso
5. Preview se muestra inmediatamente
6. URL se guarda en estado del formulario
7. Al guardar producto, URL de Cloudinary se persiste

## Pruebas y validación

1. Subida de diferentes formatos de imagen
2. Captura de cámara en dispositivos móviles
3. Manejo de errores de red
4. Validación de archivos inválidos
5. Edición de productos con imágenes existentes
