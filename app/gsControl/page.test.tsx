import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("REDIRECTED");
  }),
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/components/auth/LogoutButton", () => ({
  default: () => null,
}));

vi.mock("@/components/admin/AdminPanel", () => ({
  default: () => null,
}));

vi.mock("@/lib/seo", () => ({
  buildNoIndexMetadata: vi.fn((title: string, description: string) => ({ title, description, robots: { index: false } })),
}));

describe("app gsControl page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("exports private metadata", async () => {
    const module = await import("./page");

    expect(module.metadata).toEqual(
      expect.objectContaining({
        title: "GS Control",
        robots: { index: false },
      }),
    );
  });

  it("redirects to login when there is no session", async () => {
    const nextAuth = await import("next-auth");

    vi.mocked(nextAuth.getServerSession).mockResolvedValue(null);

    const module = await import("./page");

    await expect(module.default()).rejects.toThrow("REDIRECTED");
  });

  it("renders admin page when session exists", async () => {
    const nextAuth = await import("next-auth");

    vi.mocked(nextAuth.getServerSession).mockResolvedValue({ user: { email: "admin@example.com" } });

    const module = await import("./page");
    const view = await module.default();

    expect(view).toBeTruthy();
  });
});
