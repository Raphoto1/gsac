-- CreateTable
CREATE TABLE "home_cases" (
    "id" TEXT NOT NULL DEFAULT 'home_cases',
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_team" (
    "id" TEXT NOT NULL DEFAULT 'home_team',
    "members" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_team_pkey" PRIMARY KEY ("id")
);
