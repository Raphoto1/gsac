-- CreateTable
CREATE TABLE "home_hero" (
    "id" TEXT NOT NULL DEFAULT 'home_hero',
    "welcomeEs" TEXT NOT NULL,
    "welcomeEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "backgroundImage" TEXT NOT NULL,
    "impact1Es" TEXT NOT NULL,
    "impact1En" TEXT NOT NULL,
    "impact2Es" TEXT NOT NULL,
    "impact2En" TEXT NOT NULL,
    "impact3Es" TEXT NOT NULL,
    "impact3En" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_hero_pkey" PRIMARY KEY ("id")
);