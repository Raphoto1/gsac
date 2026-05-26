import { sampleNews } from "@/components/news/newsData";
import type { NewsItem } from "@/types/news";
import {
  getAllNewsFromDb,
  getNewsBySlugFromDb,
  updateNewsActivationInDb,
  upsertNewsInDb,
  type NewsArticleRecord,
} from "../dao/news.dao";
import {
  getNewsSectionSettingsFromDb,
  upsertNewsSectionSettingsInDb,
} from "../dao/news-section.dao";

export class NewsValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = "NewsValidationError";
  }
}

type NewsPayload = {
  slug?: unknown;
  isActive?: unknown;
  date?: unknown;
  imageUrl?: unknown;
  es?: {
    title?: unknown;
    category?: unknown;
    excerpt?: unknown;
    content?: unknown;
  };
  en?: {
    title?: unknown;
    category?: unknown;
    excerpt?: unknown;
    content?: unknown;
  };
};

type NewsActivationPayload = {
  slug?: unknown;
  isActive?: unknown;
};

type NewsSectionPayload = {
  newsEnabled?: unknown;
};

let newsSectionVisibilityFallback = true;

function normalizeRequiredText(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new NewsValidationError(field, `El campo ${field} debe ser texto.`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new NewsValidationError(field, `El campo ${field} es obligatorio.`);
  }

  return normalized;
}

function normalizeOptionalText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeActivation(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  return true;
}

function normalizeOptionalUrl(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new NewsValidationError("imageUrl", "La URL de imagen debe ser texto.");
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  try {
    // Validate URL shape and keep the original value.
    const parsed = new URL(normalized);
    if (!parsed.protocol) {
      throw new Error("Invalid URL protocol");
    }
  } catch {
    throw new NewsValidationError("imageUrl", "La URL de imagen no es válida.");
  }

  return normalized;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeDate(value: unknown): string {
  const raw = normalizeRequiredText(value, "date");

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  return raw;
}

function normalizeContent(value: unknown, field: string, required: boolean): string[] {
  if (!Array.isArray(value)) {
    if (required) {
      throw new NewsValidationError(field, `El campo ${field} debe ser una lista.`);
    }
    return [];
  }

  const parsed = value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (required && parsed.length === 0) {
    throw new NewsValidationError(field, `El campo ${field} requiere al menos 1 párrafo.`);
  }

  return parsed;
}

function parseJsonContent(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function mapRecordToNewsItem(record: NewsArticleRecord): NewsItem {
  const titleEn = normalizeOptionalText(record.titleEn);
  const categoryEn = normalizeOptionalText(record.categoryEn);
  const excerptEn = normalizeOptionalText(record.excerptEn);
  const contentEn = parseJsonContent(record.contentEn);
  const isActive = typeof record.isActive === "boolean" ? record.isActive : true;

  return {
    id: record.id,
    isActive,
    slug: record.slug,
    date: record.date,
    imageUrl: record.imageUrl ?? undefined,
    title: record.titleEs,
    title_en: titleEn || undefined,
    category: record.categoryEs,
    category_en: categoryEn || undefined,
    excerpt: record.excerptEs,
    excerpt_en: excerptEn || undefined,
    content: parseJsonContent(record.contentEs),
    content_en: contentEn.length ? contentEn : undefined,
  };
}

function isPrismaTableMissingError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeCode = (error as { code?: unknown }).code;
  return maybeCode === "P2021" || maybeCode === "P2022";
}

function isNewsDelegateMissingError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeCode = (error as { code?: unknown }).code;
  return maybeCode === "NEWS_DELEGATE_MISSING";
}

function isDbUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeCode = (error as { code?: unknown }).code;
  return maybeCode === "P1001" || maybeCode === "P1002";
}

export async function getAllNewsService(): Promise<NewsItem[]> {
  const records = await getAllNewsFromDb();
  return records.map(mapRecordToNewsItem);
}

export async function getNewsSectionVisibilityService(): Promise<{
  newsEnabled: boolean;
  source: "db" | "memory";
}> {
  try {
    const record = await getNewsSectionSettingsFromDb();
    if (!record) {
      return { newsEnabled: newsSectionVisibilityFallback, source: "memory" };
    }

    newsSectionVisibilityFallback = record.newsEnabled;
    return { newsEnabled: record.newsEnabled, source: "db" };
  } catch (error) {
    if (!isPrismaTableMissingError(error) && !isDbUnavailableError(error)) {
      throw error;
    }

    return { newsEnabled: newsSectionVisibilityFallback, source: "memory" };
  }
}

export async function updateNewsSectionVisibilityService(payload: unknown): Promise<{
  newsEnabled: boolean;
}> {
  if (!payload || typeof payload !== "object") {
    throw new NewsValidationError("payload", "El body debe ser un objeto JSON válido.");
  }

  const data = payload as NewsSectionPayload;

  if (typeof data.newsEnabled !== "boolean") {
    throw new NewsValidationError("newsEnabled", "newsEnabled debe ser boolean.");
  }

  try {
    const record = await upsertNewsSectionSettingsInDb(data.newsEnabled);
    newsSectionVisibilityFallback = record.newsEnabled;
    return { newsEnabled: record.newsEnabled };
  } catch (error) {
    if (isPrismaTableMissingError(error) || isDbUnavailableError(error)) {
      newsSectionVisibilityFallback = data.newsEnabled;
      return { newsEnabled: data.newsEnabled };
    }

    throw error;
  }
}

export async function getAdminNewsService(): Promise<{ news: NewsItem[]; source: "db" | "sample" }> {
  try {
    const news = await getAllNewsService();
    if (news.length) {
      return { news, source: "db" };
    }
  } catch (error) {
    if (!isPrismaTableMissingError(error) && !isDbUnavailableError(error) && !isNewsDelegateMissingError(error)) {
      throw error;
    }
  }

  return { news: sampleNews, source: "sample" };
}

export async function getPublicNewsService(): Promise<{ news: NewsItem[]; source: "db" | "sample" }> {
  const visibility = await getNewsSectionVisibilityService();
  if (!visibility.newsEnabled) {
    return { news: [], source: "db" };
  }

  const payload = await getAdminNewsService();
  return {
    source: payload.source,
    news: payload.news.filter((item) => item.isActive),
  };
}

export async function getNewsBySlugService(slug: string): Promise<NewsItem | null> {
  const visibility = await getNewsSectionVisibilityService();
  if (!visibility.newsEnabled) {
    return null;
  }

  try {
    const record = await getNewsBySlugFromDb(slug);
    if (!record) {
      const sampleItem = sampleNews.find((item) => item.slug === slug) ?? null;
      if (!sampleItem || !sampleItem.isActive) {
        return null;
      }
      return sampleItem;
    }
    const mapped = mapRecordToNewsItem(record);
    if (!mapped.isActive) {
      return null;
    }
    return mapped;
  } catch (error) {
    if (!isPrismaTableMissingError(error) && !isDbUnavailableError(error) && !isNewsDelegateMissingError(error)) {
      throw error;
    }

    const sampleItem = sampleNews.find((item) => item.slug === slug) ?? null;
    if (!sampleItem || !sampleItem.isActive) {
      return null;
    }
    return sampleItem;
  }
}

export async function upsertNewsService(payload: unknown): Promise<NewsItem> {
  if (!payload || typeof payload !== "object") {
    throw new NewsValidationError("payload", "El body debe ser un objeto JSON válido.");
  }

  const data = payload as NewsPayload;

  const titleEs = normalizeRequiredText(data.es?.title, "es.title");
  const categoryEs = normalizeRequiredText(data.es?.category, "es.category");
  const excerptEs = normalizeRequiredText(data.es?.excerpt, "es.excerpt");
  const contentEs = normalizeContent(data.es?.content, "es.content", true);

  const titleEn = normalizeOptionalText(data.en?.title);
  const categoryEn = normalizeOptionalText(data.en?.category);
  const excerptEn = normalizeOptionalText(data.en?.excerpt);
  const contentEn = normalizeContent(data.en?.content, "en.content", false);

  const slugFromInput = normalizeOptionalText(data.slug);
  const slug = slugify(slugFromInput || titleEs);

  if (!slug) {
    throw new NewsValidationError("slug", "No se pudo construir un slug válido.");
  }

  let record: NewsArticleRecord;

  try {
    record = await upsertNewsInDb({
      slug,
      isActive: normalizeActivation(data.isActive),
      date: normalizeDate(data.date),
      imageUrl: normalizeOptionalUrl(data.imageUrl),
      titleEs,
      titleEn,
      categoryEs,
      categoryEn,
      excerptEs,
      excerptEn,
      contentEs,
      contentEn,
    });
  } catch (error) {
    if (isNewsDelegateMissingError(error)) {
      throw new NewsValidationError(
        "prisma",
        "El cliente de Prisma está desactualizado. Ejecuta prisma generate y reinicia el servidor de desarrollo."
      );
    }

    if (isPrismaTableMissingError(error)) {
      throw new NewsValidationError(
        "schema",
        "La tabla de noticias no existe aún. Ejecuta migraciones de Prisma para crearla."
      );
    }

    throw error;
  }

  return mapRecordToNewsItem(record);
}

export async function updateNewsActivationService(payload: unknown): Promise<NewsItem> {
  if (!payload || typeof payload !== "object") {
    throw new NewsValidationError("payload", "El body debe ser un objeto JSON válido.");
  }

  const data = payload as NewsActivationPayload;
  const slug = normalizeRequiredText(data.slug, "slug");

  if (typeof data.isActive !== "boolean") {
    throw new NewsValidationError("isActive", "isActive debe ser boolean.");
  }

  try {
    const record = await updateNewsActivationInDb(slug, data.isActive);
    return mapRecordToNewsItem(record);
  } catch (error) {
    if (isNewsDelegateMissingError(error)) {
      throw new NewsValidationError(
        "prisma",
        "El cliente de Prisma está desactualizado. Ejecuta prisma generate y reinicia el servidor de desarrollo."
      );
    }

    if (isPrismaTableMissingError(error)) {
      throw new NewsValidationError(
        "schema",
        "La tabla de noticias no existe aún. Ejecuta migraciones de Prisma para crearla."
      );
    }

    throw error;
  }
}
