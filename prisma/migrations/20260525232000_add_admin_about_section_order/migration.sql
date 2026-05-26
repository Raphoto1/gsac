-- CreateEnum
CREATE TYPE "AboutSectionKey" AS ENUM ('INTRO', 'MISSION', 'VISION', 'VALUES', 'COUNTRIES', 'SERVICES', 'WHY_US', 'EXPERIENCE');

-- CreateTable
CREATE TABLE "admin_about_section_order" (
    "id" TEXT NOT NULL,
    "section" "AboutSectionKey" NOT NULL,
    "position" INTEGER NOT NULL,
    "fixed" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_about_section_order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_about_section_order_section_key" ON "admin_about_section_order"("section");

-- CreateIndex
CREATE UNIQUE INDEX "admin_about_section_order_position_key" ON "admin_about_section_order"("position");
