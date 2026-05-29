import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(),
  getTranslations: vi.fn(),
}));

vi.mock("@/lib/seo", () => ({
  buildPageMetadata: vi.fn((value) => ({ ...value, mocked: true })),
}));

vi.mock("@/components/news/NewsSection", () => ({
  default: () => null,
}));

vi.mock("@/apiPack/service/news.service", () => ({
  getNewsSectionVisibilityService: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

describe("app news page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("builds metadata for news page", async () => {
    const nextIntl = await import("next-intl/server");
    const seo = await import("@/lib/seo");

    vi.mocked(nextIntl.getLocale).mockResolvedValue("es");
    vi.mocked(nextIntl.getTranslations).mockResolvedValue((key: string) => `seo.${key}`);

    const module = await import("./page");
    const result = await module.generateMetadata();

    expect(seo.buildPageMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "seo.newsTitle",
        description: "seo.newsDescription",
        path: "/news",
      }),
    );
    expect(result).toEqual(expect.objectContaining({ mocked: true }));
  });

  it("renders section when news is enabled", async () => {
    const newsService = await import("@/apiPack/service/news.service");
    vi.mocked(newsService.getNewsSectionVisibilityService).mockResolvedValue({ newsEnabled: true });

    const module = await import("./page");
    const view = await module.default();

    expect(view).toBeTruthy();
  });

  it("calls notFound when news is disabled", async () => {
    const newsService = await import("@/apiPack/service/news.service");
    const navigation = await import("next/navigation");

    vi.mocked(newsService.getNewsSectionVisibilityService).mockResolvedValue({ newsEnabled: false });

    const module = await import("./page");

    await expect(module.default()).rejects.toThrow("NOT_FOUND");
    expect(navigation.notFound).toHaveBeenCalledTimes(1);
  });
});
