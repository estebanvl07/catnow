-- AlterTable
ALTER TABLE "Product" ADD COLUMN "sizes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "colors" TEXT[] DEFAULT ARRAY[]::TEXT[];
