-- CreateTable
CREATE TABLE "home_case_entries" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "organizationType" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "advancedDescriptionEs" TEXT NOT NULL,
    "advancedDescriptionEn" TEXT NOT NULL,
    "impactItemsEs" TEXT NOT NULL,
    "impactItemsEn" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_case_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_team_member_entries" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "linkedin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_team_member_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "home_case_entries_position_key" ON "home_case_entries"("position");

-- CreateIndex
CREATE UNIQUE INDEX "home_team_member_entries_position_key" ON "home_team_member_entries"("position");
