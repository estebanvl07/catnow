-- AlterTable
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "image_urls" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Backfill: copy single image_url into image_urls where we have image_url and empty image_urls
UPDATE "Product"
SET "image_urls" = ARRAY["image_url"]
WHERE "image_url" IS NOT NULL
  AND (COALESCE(array_length("image_urls", 1), 0) = 0);
