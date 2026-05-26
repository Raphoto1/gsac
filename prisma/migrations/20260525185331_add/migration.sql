-- CreateTable
CREATE TABLE "home_holdings" (
    "id" TEXT NOT NULL DEFAULT 'home_holdings',
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_clients" (
    "id" TEXT NOT NULL DEFAULT 'home_clients',
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_clients_pkey" PRIMARY KEY ("id")
);
