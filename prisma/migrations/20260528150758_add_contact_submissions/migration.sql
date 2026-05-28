/*
  Warnings:

  - You are about to drop the `home_clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `home_holdings` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[kind,position]` on the table `home_company_list_entries` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "admin_home_section_order" ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "home_clients";

-- DropTable
DROP TABLE "home_holdings";

-- CreateTable
CREATE TABLE "home_products_header" (
    "id" TEXT NOT NULL DEFAULT 'home_products_header',
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "secondaryDescriptionEs" TEXT NOT NULL,
    "secondaryDescriptionEn" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_products_header_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_product_entries" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "expandTitleEs" TEXT NOT NULL,
    "expandTitleEn" TEXT NOT NULL,
    "expandTextEs" TEXT NOT NULL,
    "expandTextEn" TEXT NOT NULL,
    "expandImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_product_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_contact_info" (
    "id" TEXT NOT NULL DEFAULT 'contact_info',
    "companyName" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_contact_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_articles" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "date" TEXT NOT NULL,
    "imageUrl" TEXT,
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL DEFAULT '',
    "categoryEs" TEXT NOT NULL,
    "categoryEn" TEXT NOT NULL DEFAULT '',
    "excerptEs" TEXT NOT NULL,
    "excerptEn" TEXT NOT NULL DEFAULT '',
    "contentEs" JSONB NOT NULL,
    "contentEn" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_section_settings" (
    "id" TEXT NOT NULL DEFAULT 'news_section',
    "newsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_section_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "resendId" TEXT NOT NULL DEFAULT '',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "home_product_entries_position_key" ON "home_product_entries"("position");

-- CreateIndex
CREATE UNIQUE INDEX "news_articles_slug_key" ON "news_articles"("slug");

-- CreateIndex
CREATE INDEX "news_articles_createdAt_idx" ON "news_articles"("createdAt");

-- CreateIndex
CREATE INDEX "contact_submissions_createdAt_idx" ON "contact_submissions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "home_company_list_entries_kind_position_key" ON "home_company_list_entries"("kind", "position");
