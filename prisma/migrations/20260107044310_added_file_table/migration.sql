-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('aws', 'cloudflare');

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "provider" "StorageProvider" NOT NULL DEFAULT 'cloudflare',

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_key_key" ON "File"("key");
