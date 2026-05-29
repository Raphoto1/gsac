import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(),
  getTranslations: vi.fn(),
}));

vi.mock("@/lib/seo", () => ({
  buildPageMetadata: vi.fn((value) => ({ ...value, mocked: true })),
}));

vi.mock("@/components/BigCardProps", () => ({
  default: () => null,
}));

vi.mock("@/components/products/ProductsList", () => ({
  default: () => null,
}));

vi.mock("@/components/home/Cases", () => ({
  default: () => null,
}));

vi.mock("@/apiPack/service/products.service", () => ({
  getHomeProductsService: vi.fn(),
}));

describe("app products page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("builds metadata for products page", async () => {
    const nextIntl = await import("next-intl/server");
    const seo = await import("@/lib/seo");

    vi.mocked(nextIntl.getLocale).mockResolvedValue("es");
    vi.mocked(nextIntl.getTranslations).mockResolvedValue((key: string) => `seo.${key}`);

    const module = await import("./page");
    const result = await module.generateMetadata();

    expect(seo.buildPageMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "seo.productsTitle",
        description: "seo.productsDescription",
        path: "/products",
      }),
    );
    expect(result).toEqual(expect.objectContaining({ mocked: true }));
  });

  it("renders page and falls back when service fails", async () => {
    const nextIntl = await import("next-intl/server");
    const productsService = await import("@/apiPack/service/products.service");

    vi.mocked(nextIntl.getLocale).mockResolvedValue("es");
    vi.mocked(productsService.getHomeProductsService).mockRejectedValue(new Error("service unavailable"));

    const module = await import("./page");
    const view = await module.default();

    expect(view).toBeTruthy();
  });
});
