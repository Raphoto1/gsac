-- CreateEnum
CREATE TYPE "CompanyListKind" AS ENUM ('HOLDINGS', 'CLIENTS');

-- CreateTable
CREATE TABLE "home_company_list_entries" (
    "id" TEXT NOT NULL,
    "kind" "CompanyListKind" NOT NULL,
    "position" INTEGER NOT NULL,
    "nameEs" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "logo" TEXT,
    "relationshipEs" TEXT,
    "relationshipEn" TEXT,
    "relationshipLabelEs" TEXT,
    "relationshipLabelEn" TEXT,
    "website" TEXT,
    "websiteLabelEs" TEXT,
    "websiteLabelEn" TEXT,
    "caseHref" TEXT,
    "caseLabelEs" TEXT,
    "caseLabelEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_company_list_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "home_company_list_entries_kind_position_idx" ON "home_company_list_entries"("kind", "position");
