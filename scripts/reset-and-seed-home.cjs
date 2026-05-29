const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { list, del } = require("@vercel/blob");

const rootDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(rootDir, ".env") });
dotenv.config({ path: path.join(rootDir, ".env.local"), override: true });

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), "utf8"));
}

const seedStaticConfig = readJson(path.join("scripts", "static", "reset-and-seed-home.data.json"));

function requiredSeedField(fieldName) {
  const value = seedStaticConfig[fieldName];
  if (value === undefined || value === null) {
    throw new Error(
      `Invalid seed static config. Missing ${fieldName} in scripts/static/reset-and-seed-home.data.json`
    );
  }

  return value;
}

const DEFAULT_BLOB_PREFIXES = Array.isArray(seedStaticConfig?.blobCleanup?.defaultPrefixes)
  ? seedStaticConfig.blobCleanup.defaultPrefixes
  : ["home/company-list/", "about/cards/"];

const CONTACT_INFO = requiredSeedField("contactInfo");
const GENERAL_INFO = requiredSeedField("generalInfo");
const HOME_HERO = requiredSeedField("homeHero");
const HOME_BIGCARD = requiredSeedField("homeBigCard");
const HOME_PRODUCTS_HEADER = requiredSeedField("homeProductsHeader");
const DEFAULT_SECTION_ORDER = requiredSeedField("defaultSectionOrder");
const CASE_ENTRIES = requiredSeedField("caseEntries");
const HOME_PRODUCT_ENTRIES = requiredSeedField("homeProductEntries");
const HOME_TEAM_MEMBERS = requiredSeedField("homeTeamMembers");
const COMPANY_LIST_ITEMS = requiredSeedField("companyListItems");
const ABOUT_SECTION_ORDER = requiredSeedField("aboutSectionOrder");
const ABOUT_CARD_SECTIONS = requiredSeedField("aboutCardSections");
const ABOUT_VALUES = requiredSeedField("aboutValues");
const ABOUT_COUNTRIES = requiredSeedField("aboutCountries");
const NEWS_SECTION_SETTINGS = requiredSeedField("newsSectionSettings");
const NEWS_ARTICLES = requiredSeedField("newsArticles");

function omitId(record) {
  const { id, ...rest } = record;
  return rest;
}

function parseCsv(value) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizePrefix(prefix) {
  return prefix.replace(/^\/+/, "");
}

function parseOptions(argv) {
  let cleanBlob = false;
  let dryRunBlob = false;
  let blobPrefixes = DEFAULT_BLOB_PREFIXES;

  for (const arg of argv) {
    if (arg === "--clean-blob") {
      cleanBlob = true;
    }

    if (arg === "--skip-blob") {
      cleanBlob = false;
    }

    if (arg === "--dry-run-blob") {
      dryRunBlob = true;
    }

    if (arg.startsWith("--blob-prefix=")) {
      blobPrefixes = [arg.slice("--blob-prefix=".length)].filter(Boolean);
    }

    if (arg.startsWith("--blob-prefixes=")) {
      blobPrefixes = parseCsv(arg.slice("--blob-prefixes=".length));
    }
  }

  return {
    cleanBlob,
    dryRunBlob,
    blobPrefixes: blobPrefixes.map(normalizePrefix).filter(Boolean),
  };
}

function normalizePostgresSslMode(url) {
  if (!(url.startsWith("postgresql://") || url.startsWith("postgres://"))) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const sslMode = parsed.searchParams.get("sslmode");

    if (!sslMode) {
      return url;
    }

    const normalized = sslMode.toLowerCase();
    if (normalized === "prefer" || normalized === "require" || normalized === "verify-ca") {
      parsed.searchParams.set("sslmode", "verify-full");
      return parsed.toString();
    }

    return url;
  } catch {
    return url;
  }
}

function buildPrismaClient() {
  const rawResolvedUrl =
    process.env.DATABASE_URL ??
    process.env.PRISMA_DATABASE_URL ??
    process.env.POSTGRES_URL;

  if (!rawResolvedUrl) {
    throw new Error(
      "Missing Prisma connection URL. Define DATABASE_URL, PRISMA_DATABASE_URL, or POSTGRES_URL."
    );
  }

  const resolvedUrl = normalizePostgresSslMode(rawResolvedUrl);

  if (
    resolvedUrl.startsWith("prisma://") ||
    resolvedUrl.startsWith("prisma+postgres://")
  ) {
    return new PrismaClient({
      accelerateUrl: resolvedUrl,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  if (
    resolvedUrl.startsWith("postgresql://") ||
    resolvedUrl.startsWith("postgres://")
  ) {
    const pool = new Pool({ connectionString: resolvedUrl });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  throw new Error(
    "Invalid database URL protocol. Use prisma://, prisma+postgres://, postgresql:// or postgres://"
  );
}

const prisma = buildPrismaClient();

async function listAllBlobEntries(token) {
  const entries = [];
  let cursor = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await list({ token, limit: 1000, cursor });
    entries.push(...response.blobs.map((blob) => ({ url: blob.url, pathname: blob.pathname || "" })));
    cursor = response.cursor;
    hasMore = response.hasMore;
  }

  return entries;
}

function matchesBlobPrefix(entry, prefixes) {
  if (!prefixes.length) {
    return true;
  }

  return prefixes.some((prefix) => {
    const normalizedPrefix = normalizePrefix(prefix);
    return entry.pathname.startsWith(normalizedPrefix) || entry.url.includes(`/${normalizedPrefix}`);
  });
}

async function deleteBlobStoreContents(options) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    console.log("BLOB_READ_WRITE_TOKEN no configurado. Se omite limpieza de blob store.");
    return 0;
  }

  const entries = await listAllBlobEntries(token);
  const targets = entries.filter((entry) => matchesBlobPrefix(entry, options.blobPrefixes));

  if (!targets.length) {
    console.log("No blob files matched the configured prefixes.");
    return 0;
  }

  if (options.dryRunBlob) {
    console.log(`Dry run: ${targets.length} blob file(s) would be deleted.`);
    return targets.length;
  }

  const urls = targets.map((entry) => entry.url);

  const batchSize = 100;
  for (let index = 0; index < urls.length; index += batchSize) {
    const batch = urls.slice(index, index + batchSize);
    await del(batch, { token });
  }

  console.log(`Deleted ${urls.length} blob file(s).`);
  return urls.length;
}

async function resetAndSeedDatabase() {
  await prisma.$transaction(async (tx) => {
    await tx.homeCompanyListEntry.deleteMany();
    await tx.homeCaseEntry.deleteMany();
    await tx.homeTeamMemberEntry.deleteMany();
    await tx.homeProductEntry.deleteMany();
    await tx.adminHomeSectionOrder.deleteMany();
    await tx.adminAboutSectionOrder.deleteMany();
    await tx.adminAboutCardSection.deleteMany();
    await tx.adminAboutValueEntry.deleteMany();
    await tx.adminAboutCountryEntry.deleteMany();
    await tx.newsArticle.deleteMany();
    await tx.homeCases.deleteMany();
    await tx.homeTeam.deleteMany();

    await tx.homeHero.upsert({
      where: { id: HOME_HERO.id },
      update: omitId(HOME_HERO),
      create: HOME_HERO,
    });

    await tx.homeBigCard.upsert({
      where: { id: HOME_BIGCARD.id },
      update: omitId(HOME_BIGCARD),
      create: HOME_BIGCARD,
    });

    await tx.homeProductsHeader.upsert({
      where: { id: HOME_PRODUCTS_HEADER.id },
      update: omitId(HOME_PRODUCTS_HEADER),
      create: HOME_PRODUCTS_HEADER,
    });

    await tx.homeContactInfo.upsert({
      where: { id: "contact_info" },
      update: {
        companyName: CONTACT_INFO.companyName,
        nit: CONTACT_INFO.nit,
        email: CONTACT_INFO.email,
        phone: CONTACT_INFO.phone,
        address: CONTACT_INFO.address,
      },
      create: {
        id: "contact_info",
        companyName: CONTACT_INFO.companyName,
        nit: CONTACT_INFO.nit,
        email: CONTACT_INFO.email,
        phone: CONTACT_INFO.phone,
        address: CONTACT_INFO.address,
      },
    });

    await tx.homeGeneralInfo.upsert({
      where: { id: "general_info" },
      update: {
        companyNameEs: GENERAL_INFO.companyNameEs,
        companyNameEn: GENERAL_INFO.companyNameEn,
        nit: GENERAL_INFO.nit,
        taglineEs: GENERAL_INFO.taglineEs,
        taglineEn: GENERAL_INFO.taglineEn,
        rightsEs: GENERAL_INFO.rightsEs,
        rightsEn: GENERAL_INFO.rightsEn,
      },
      create: {
        id: "general_info",
        companyNameEs: GENERAL_INFO.companyNameEs,
        companyNameEn: GENERAL_INFO.companyNameEn,
        nit: GENERAL_INFO.nit,
        taglineEs: GENERAL_INFO.taglineEs,
        taglineEn: GENERAL_INFO.taglineEn,
        rightsEs: GENERAL_INFO.rightsEs,
        rightsEn: GENERAL_INFO.rightsEn,
      },
    });

    await tx.newsSectionSettings.upsert({
      where: { id: NEWS_SECTION_SETTINGS.id },
      update: { newsEnabled: NEWS_SECTION_SETTINGS.newsEnabled },
      create: NEWS_SECTION_SETTINGS,
    });

    await tx.adminHomeSectionOrder.createMany({ data: DEFAULT_SECTION_ORDER });
    await tx.homeCaseEntry.createMany({ data: CASE_ENTRIES });
    await tx.homeProductEntry.createMany({ data: HOME_PRODUCT_ENTRIES });
    await tx.homeTeamMemberEntry.createMany({ data: HOME_TEAM_MEMBERS });
    await tx.homeCompanyListEntry.createMany({ data: COMPANY_LIST_ITEMS });

    await tx.adminAboutSectionOrder.createMany({ data: ABOUT_SECTION_ORDER });
    await tx.adminAboutCardSection.createMany({ data: ABOUT_CARD_SECTIONS });
    await tx.adminAboutValueEntry.createMany({
      data: ABOUT_VALUES.map((item, index) => ({
        position: index + 1,
        valueKey: item.valueKey,
        titleEs: item.titleEs,
        titleEn: item.titleEn,
        descriptionEs: item.descriptionEs,
        descriptionEn: item.descriptionEn,
      })),
    });
    await tx.adminAboutCountryEntry.createMany({
      data: ABOUT_COUNTRIES.map((name, index) => ({
        position: index + 1,
        name,
      })),
    });

    await tx.newsArticle.createMany({ data: NEWS_ARTICLES });
  });

  console.log("Database reset and seeded successfully.");
}

async function main() {
  const options = parseOptions(process.argv.slice(2));

  if (options.cleanBlob) {
    console.log("Cleaning blob store...");
    await deleteBlobStoreContents(options);
  } else {
    console.log("Skipping blob cleanup (use --clean-blob to enable).");
  }

  console.log("Resetting and seeding database...");
  await resetAndSeedDatabase();
}

main()
  .catch((error) => {
    console.error("Failed to reset and seed home data.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
