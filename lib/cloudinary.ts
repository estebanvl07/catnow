// Extraer configuración de Cloudinary de las variables de entorno
function getCloudinaryConfig() {
  const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  const apiKey = process.env.NEXT_PUBLIC_BUCKET_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_BUCKET_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_BUCKET_NAME;

  if (!cloudinaryUrl) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_URL no está configurada");
  }

  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_BUCKET_API_KEY no está configurada");
  }

  if (!apiSecret) {
    throw new Error("NEXT_PUBLIC_BUCKET_API_SECRET no está configurada");
  }

  console.log("Extracted cloud_name:", cloudName); // Para debug
  console.log("Original URL:", cloudinaryUrl); // Para debug

  if (!cloudName) {
    throw new Error(
      "No se pudo extraer el cloud_name de NEXT_PUBLIC_CLOUDINARY_URL. URL: " +
        cloudinaryUrl,
    );
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
  };
}

interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const config = getCloudinaryConfig();

  // Agregar timestamp para firma
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Parámetros para la firma (ordenados alfabéticamente)
  const params = {
    folder: "products",
    timestamp: timestamp.toString(),
    upload_preset: "ml_default",
  };

  // Generar firma para autenticación
  const signature = await generateSignature(params, config.apiSecret);

  const formData = new FormData();

  // Agregar el archivo directamente al FormData
  formData.append("file", file);

  // Agregar todos los parámetros
  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, value);
  });

  formData.append("signature", signature);
  formData.append("api_key", config.apiKey);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al subir imagen: ${errorText}`);
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error("Error en uploadImage:", error);
    throw error;
  }
}

// Función para generar firma de Cloudinary usando Web Crypto API
async function generateSignature(
  params: Record<string, string>,
  apiSecret: string,
): Promise<string> {
  // Ordenar parámetros alfabéticamente y construir la cadena
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const stringToSign = `${paramString}${apiSecret}`;

  console.log("String to sign:", stringToSign); // Para debug

  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    // Para eliminar imágenes necesitarías una signed upload
    // Por ahora, esta función es un placeholder
    console.log("Eliminar imagen:", publicId);
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
  }
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Validar tipo de archivo
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Tipo de archivo no permitido. Solo se aceptan JPG, PNG y WebP",
    };
  }

  // Validar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "El archivo es demasiado grande. Máximo 5MB",
    };
  }

  return { valid: true };
}
