-- CreateEnum
CREATE TYPE "AboutCardSectionKey" AS ENUM ('INTRO', 'MISSION', 'VISION', 'SERVICES', 'WHY_US', 'EXPERIENCE');

-- CreateTable
CREATE TABLE "admin_about_card_sections" (
    "id" TEXT NOT NULL,
    "section" "AboutCardSectionKey" NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_about_card_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_about_value_entries" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "valueKey" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_about_value_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_about_country_entries" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_about_country_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_about_card_sections_section_key" ON "admin_about_card_sections"("section");

-- CreateIndex
CREATE UNIQUE INDEX "admin_about_value_entries_position_key" ON "admin_about_value_entries"("position");

-- CreateIndex
CREATE UNIQUE INDEX "admin_about_country_entries_position_key" ON "admin_about_country_entries"("position");
