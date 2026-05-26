-- CreateTable
CREATE TABLE "home_bigcard" (
    "id" TEXT NOT NULL DEFAULT 'home_bigcard',
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_bigcard_pkey" PRIMARY KEY ("id")
);
