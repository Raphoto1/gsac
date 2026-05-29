import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(),
  getTranslations: vi.fn(),
}));

vi.mock("next-intl", () => ({
  useTranslations: vi.fn(),
}));

vi.mock("@/lib/seo", () => ({
  buildPageMetadata: vi.fn((value) => ({ ...value, mocked: true })),
}));

vi.mock("@/components/home/Contact", () => ({
  default: () => null,
}));

describe("app contact page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("builds metadata for contact page", async () => {
    const nextIntl = await import("next-intl/server");
    const seo = await import("@/lib/seo");

    vi.mocked(nextIntl.getLocale).mockResolvedValue("es");
    vi.mocked(nextIntl.getTranslations).mockResolvedValue((key: string) => `seo.${key}`);

    const module = await import("./page");
    const result = await module.generateMetadata();

    expect(seo.buildPageMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "seo.contactTitle",
        description: "seo.contactDescription",
        path: "/contact",
      }),
    );
    expect(result).toEqual(expect.objectContaining({ mocked: true }));
  });

  it("renders without crashing", async () => {
    const intl = await import("next-intl");
    vi.mocked(intl.useTranslations).mockReturnValue((key: string) => key);

    const module = await import("./page");
    const view = module.default();

    expect(view).toBeTruthy();
    expect(intl.useTranslations).toHaveBeenCalledWith("contact");
  });
});
