import { prisma } from "@/lib/prisma";

export type NewsSectionSettingsRecord = {
  id: string;
  newsEnabled: boolean;
};

type NewsSectionSettingsDelegate = {
  findUnique: (args: unknown) => Promise<NewsSectionSettingsRecord | null>;
  upsert: (args: unknown) => Promise<NewsSectionSettingsRecord>;
};

function createMissingNewsSectionDelegateError(): Error & { code: string } {
  const error = new Error(
    "Prisma client is missing the NewsSectionSettings delegate. Run prisma generate/migrations for the current schema."
  ) as Error & { code: string };

  error.code = "P2021";
  return error;
}

function getNewsSectionSettingsDelegate(): NewsSectionSettingsDelegate {
  const delegate = (prisma as unknown as { newsSectionSettings?: unknown }).newsSectionSettings;

  if (!delegate) {
    throw createMissingNewsSectionDelegateError();
  }

  return delegate as NewsSectionSettingsDelegate;
}

export async function getNewsSectionSettingsFromDb(): Promise<NewsSectionSettingsRecord | null> {
  const settings = getNewsSectionSettingsDelegate();

  return settings.findUnique({
    where: { id: "news_section" },
  });
}

export async function upsertNewsSectionSettingsInDb(newsEnabled: boolean): Promise<NewsSectionSettingsRecord> {
  const settings = getNewsSectionSettingsDelegate();

  return settings.upsert({
    where: { id: "news_section" },
    create: {
      id: "news_section",
      newsEnabled,
    },
    update: {
      newsEnabled,
    },
  });
}
