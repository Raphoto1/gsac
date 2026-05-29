import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(),
  getTranslations: vi.fn(),
}));

vi.mock("@/lib/seo", () => ({
  buildPageMetadata: vi.fn((value) => ({ ...value, mocked: true })),
}));

vi.mock("@/components/home/Home", () => ({
  default: () => null,
}));

describe("app home page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("builds metadata with localized seo values", async () => {
    const nextIntl = await import("next-intl/server");
    const seo = await import("@/lib/seo");

    vi.mocked(nextIntl.getLocale).mockResolvedValue("es");
    vi.mocked(nextIntl.getTranslations).mockResolvedValue((key: string) => `seo.${key}`);

    const module = await import("./page");
    const result = await module.generateMetadata();

    expect(seo.buildPageMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "seo.homeTitle",
        description: "seo.homeDescription",
        path: "/",
        locale: "es",
      }),
    );
    expect(result).toEqual(expect.objectContaining({ mocked: true }));
  });

  it("renders without crashing", async () => {
    const module = await import("./page");
    const view = module.default();
    expect(view).toBeTruthy();
  });
});
