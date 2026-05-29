import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn(),
  getTranslations: vi.fn(),
}));

vi.mock("@/lib/seo", () => ({
  buildPageMetadata: vi.fn((value) => ({ ...value, mocked: true })),
}));

vi.mock("@/components/about/ContentCardsSection", () => ({
  default: () => null,
}));

vi.mock("@/components/BigCardProps", () => ({
  default: () => null,
}));

vi.mock("country-flag-icons/react/3x2", () => ({
  CO: () => null,
  US: () => null,
}));

vi.mock("@/apiPack/service/about-sections.service", () => ({
  getAboutSectionsOrderService: vi.fn(),
}));

vi.mock("@/apiPack/service/about-content.service", () => ({
  getAboutContentService: vi.fn(),
}));

const mockSections = [
  { id: "intro", label: "Intro", fixed: false, visible: true, position: 1 },
  { id: "values", label: "Valores", fixed: false, visible: true, position: 2 },
  { id: "experience", label: "Experiencia", fixed: false, visible: true, position: 3 },
] as const;

const mockContent = {
  cards: {
    intro: {
      title: { es: "Titulo", en: "Title" },
      description: { es: "Descripcion", en: "Description" },
      imageUrl: "https://example.com/intro.jpg",
    },
    mission: {
      title: { es: "Mision", en: "Mission" },
      description: { es: "Mision desc", en: "Mission desc" },
      imageUrl: "https://example.com/mission.jpg",
    },
    vision: {
      title: { es: "Vision", en: "Vision" },
      description: { es: "Vision desc", en: "Vision desc" },
      imageUrl: "https://example.com/vision.jpg",
    },
    services: {
      title: { es: "Servicios", en: "Services" },
      description: { es: "Servicios desc", en: "Services desc" },
      imageUrl: "https://example.com/services.jpg",
    },
    whyUs: {
      title: { es: "Por que", en: "Why" },
      description: { es: "Por que desc", en: "Why desc" },
      imageUrl: "https://example.com/why.jpg",
    },
    experience: {
      title: { es: "Experiencia", en: "Experience" },
      description: { es: "Experiencia desc", en: "Experience desc" },
      imageUrl: "https://example.com/exp.jpg",
    },
  },
  values: [
    {
      key: "valor1",
      title: { es: "Valor", en: "Value" },
      description: { es: "Descripcion", en: "Description" },
    },
  ],
  countries: [{ name: "CO" }],
};

describe("app about page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("builds metadata for about page", async () => {
    const nextIntl = await import("next-intl/server");
    const seo = await import("@/lib/seo");

    vi.mocked(nextIntl.getLocale).mockResolvedValue("en");
    vi.mocked(nextIntl.getTranslations).mockResolvedValue(((key: string) => `seo.${key}`) as never);

    const module = await import("./page");
    const result = await module.generateMetadata();

    expect(seo.buildPageMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "seo.aboutTitle",
        description: "seo.aboutDescription",
        path: "/about",
        locale: "en",
      }),
    );
    expect(result).toEqual(expect.objectContaining({ mocked: true }));
  });

  it("renders server page with mocked services", async () => {
    const nextIntl = await import("next-intl/server");
    const aboutSections = await import("@/apiPack/service/about-sections.service");
    const aboutContent = await import("@/apiPack/service/about-content.service");

    vi.mocked(nextIntl.getLocale).mockResolvedValue("es");
    vi.mocked(nextIntl.getTranslations).mockResolvedValue(((key: string) => key) as never);
    vi.mocked(aboutSections.getAboutSectionsOrderService).mockResolvedValue([...mockSections]);
    vi.mocked(aboutContent.getAboutContentService).mockResolvedValue(mockContent);

    const module = await import("./page");
    const view = await module.default();

    expect(view).toBeTruthy();
  });
});
