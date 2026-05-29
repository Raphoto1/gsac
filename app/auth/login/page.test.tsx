import { describe, expect, it } from "vitest";

describe("app auth login page", () => {
  it("exports a page component", async () => {
    const module = await import("./page");
    expect(typeof module.default).toBe("function");
  });
});
