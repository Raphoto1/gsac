-- CreateTable
CREATE TABLE "home_general_info" (
    "id" TEXT NOT NULL DEFAULT 'general_info',
    "companyNameEs" TEXT NOT NULL,
    "companyNameEn" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "taglineEs" TEXT NOT NULL,
    "taglineEn" TEXT NOT NULL,
    "rightsEs" TEXT NOT NULL,
    "rightsEn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_general_info_pkey" PRIMARY KEY ("id")
);
