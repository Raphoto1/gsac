import { describe, expect, it } from "vitest";
import {
  isLocalizedText,
  normalizeLocalizedText,
  resolveLocalizedText,
} from "@/types/company-list";

describe("company-list localization helpers", () => {
  it("detects valid localized text objects", () => {
    expect(isLocalizedText({ es: "Hola", en: "Hello" })).toBe(true);
    expect(isLocalizedText({ es: "Hola" })).toBe(false);
    expect(isLocalizedText("Hola")).toBe(false);
  });

  it("normalizes string values into bilingual content", () => {
    expect(normalizeLocalizedText("  Texto base  ")).toEqual({
      es: "Texto base",
      en: "Texto base",
    });
  });

  it("normalizes localized objects with locale fallback", () => {
    expect(normalizeLocalizedText({ es: "", en: "Hello" })).toEqual({
      es: "Hello",
      en: "Hello",
    });

    expect(normalizeLocalizedText({ es: "Hola", en: "" })).toEqual({
      es: "Hola",
      en: "Hola",
    });

    expect(normalizeLocalizedText({ es: "", en: "" })).toBeUndefined();
  });

  it("resolves localized text using locale and fallback", () => {
    expect(resolveLocalizedText({ es: "Hola", en: "Hello" }, "es")).toBe("Hola");
    expect(resolveLocalizedText({ es: "", en: "Hello" }, "es")).toBe("Hello");
    expect(resolveLocalizedText("Direct text", "es")).toBe("Direct text");
    expect(resolveLocalizedText(undefined, "es")).toBe("");
  });
});
