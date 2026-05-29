import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(),
  getTranslations: vi.fn(),
}));

vi.mock("@/lib/seo", () => ({
  buildPageMetadata: vi.fn((value) => ({ ...value, mocked: true })),
}));

vi.mock("next/link", () => ({
  default: () => null,
}));

vi.mock("@/components/news/NewsShareButtons", () => ({
  default: () => null,
}));

vi.mock("@/apiPack/service/news.service", () => ({
  getPublicNewsService: vi.fn(),
  getNewsBySlugService: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

const article = {
  id: 1,
  isActive: true,
  slug: "test-article",
  title: "Titulo",
  title_en: "Title",
  category: "Categoria",
  category_en: "Category",
  date: "2026-01-01",
  excerpt: "Resumen",
  excerpt_en: "Excerpt",
  content: ["Parrafo 1"],
  content_en: ["Paragraph 1"],
  imageUrl: "https://example.com/image.jpg",
};

describe("app news slug page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("creates static params from public news", async () => {
    const newsService = await import("@/apiPack/service/news.service");
    vi.mocked(newsService.getPublicNewsService).mockResolvedValue({ news: [article] });

    const module = await import("./page");
    const params = await module.generateStaticParams();

    expect(params).toEqual([{ slug: "test-article" }]);
  });

  it("builds metadata from existing article", async () => {
    const nextIntl = await import("next-intl/server");
    const newsService = await import("@/apiPack/service/news.service");
    const seo = await import("@/lib/seo");

    vi.mocked(nextIntl.getLocale).mockResolvedValue("en");
    vi.mocked(nextIntl.getTranslations).mockResolvedValue((key: string) => `seo.${key}`);
    vi.mocked(newsService.getNewsBySlugService).mockResolvedValue(article);

    const module = await import("./page");
    const result = await module.generateMetadata({ params: Promise.resolve({ slug: "test-article" }) });

    expect(seo.buildPageMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Title",
        description: "Excerpt",
        path: "/news/test-article",
        locale: "en",
      }),
    );
    expect(result).toEqual(expect.objectContaining({ mocked: true }));
  });

  it("renders article page when article exists", async () => {
    const nextIntl = await import("next-intl/server");
    const newsService = await import("@/apiPack/service/news.service");

    vi.mocked(nextIntl.getLocale).mockResolvedValue("es");
    vi.mocked(newsService.getNewsBySlugService).mockResolvedValue(article);

    const module = await import("./page");
    const view = await module.default({ params: Promise.resolve({ slug: "test-article" }) });

    expect(view).toBeTruthy();
  });

  it("calls notFound when article does not exist", async () => {
    const nextIntl = await import("next-intl/server");
    const newsService = await import("@/apiPack/service/news.service");
    const navigation = await import("next/navigation");

    vi.mocked(nextIntl.getLocale).mockResolvedValue("es");
    vi.mocked(newsService.getNewsBySlugService).mockResolvedValue(null);

    const module = await import("./page");

    await expect(module.default({ params: Promise.resolve({ slug: "missing" }) })).rejects.toThrow("NOT_FOUND");
    expect(navigation.notFound).toHaveBeenCalledTimes(1);
  });
});
