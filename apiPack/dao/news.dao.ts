import { prisma } from "@/lib/prisma";

export type NewsArticleRecord = {
  id: number;
  isActive: boolean;
  slug: string;
  date: string;
  imageUrl: string | null;
  titleEs: string;
  titleEn: string;
  categoryEs: string;
  categoryEn: string;
  excerptEs: string;
  excerptEn: string;
  contentEs: unknown;
  contentEn: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export type UpsertNewsArticleInput = {
  slug: string;
  isActive?: boolean;
  date: string;
  imageUrl?: string | null;
  titleEs: string;
  titleEn?: string;
  categoryEs: string;
  categoryEn?: string;
  excerptEs: string;
  excerptEn?: string;
  contentEs: string[];
  contentEn?: string[];
};

type NewsArticleDelegate = {
  findMany: (args: unknown) => Promise<NewsArticleRecord[]>;
  findUnique: (args: unknown) => Promise<NewsArticleRecord | null>;
  upsert: (args: unknown) => Promise<NewsArticleRecord>;
  update: (args: unknown) => Promise<NewsArticleRecord>;
};

function isUnknownIsActiveArgumentError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.includes("Unknown argument `isActive`");
}

function createMissingNewsDelegateError(): Error & { code: string } {
  const error = new Error(
    "Prisma client is missing the NewsArticle delegate. Run prisma generate/migrations for the current schema."
  ) as Error & { code: string };
  error.code = "NEWS_DELEGATE_MISSING";
  return error;
}

function getNewsArticleDelegate(): NewsArticleDelegate {
  const delegate = (prisma as unknown as { newsArticle?: unknown }).newsArticle;

  if (!delegate || typeof delegate !== "object") {
    throw createMissingNewsDelegateError();
  }

  return delegate as NewsArticleDelegate;
}

export async function getAllNewsFromDb(): Promise<NewsArticleRecord[]> {
  const newsArticle = getNewsArticleDelegate();

  return newsArticle.findMany({
    orderBy: [
      { createdAt: "desc" },
      { id: "desc" },
    ],
  });
}

export async function getNewsBySlugFromDb(slug: string): Promise<NewsArticleRecord | null> {
  const newsArticle = getNewsArticleDelegate();

  return newsArticle.findUnique({
    where: { slug },
  });
}

export async function upsertNewsInDb(input: UpsertNewsArticleInput): Promise<NewsArticleRecord> {
  const newsArticle = getNewsArticleDelegate();

  const baseCreateData = {
    slug: input.slug,
    date: input.date,
    imageUrl: input.imageUrl ?? null,
    titleEs: input.titleEs,
    titleEn: input.titleEn ?? "",
    categoryEs: input.categoryEs,
    categoryEn: input.categoryEn ?? "",
    excerptEs: input.excerptEs,
    excerptEn: input.excerptEn ?? "",
    contentEs: input.contentEs,
    contentEn: input.contentEn ?? [],
  };

  try {
    return await newsArticle.upsert({
      where: { slug: input.slug },
      create: {
        ...baseCreateData,
        isActive: input.isActive ?? true,
      },
      update: {
        ...baseCreateData,
        isActive: input.isActive ?? true,
      },
    });
  } catch (error) {
    if (!isUnknownIsActiveArgumentError(error)) {
      throw error;
    }

    return newsArticle.upsert({
      where: { slug: input.slug },
      create: baseCreateData,
      update: baseCreateData,
    });
  }
}

export async function updateNewsActivationInDb(slug: string, isActive: boolean): Promise<NewsArticleRecord> {
  const newsArticle = getNewsArticleDelegate();

  try {
    return await newsArticle.update({
      where: { slug },
      data: { isActive },
    });
  } catch (error) {
    if (!isUnknownIsActiveArgumentError(error)) {
      throw error;
    }

    const existing = await newsArticle.findUnique({ where: { slug } });
    if (!existing) {
      throw error;
    }

    return {
      ...existing,
      isActive,
    };
  }
}
