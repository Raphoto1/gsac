import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_HOME_PRODUCTS, DEFAULT_HOME_PRODUCTS_HEADER } from "@/types/home-products";
vi.mock("../dao/products.dao", () => ({ getHomeProductsFromDb: vi.fn(), upsertHomeProductsInDb: vi.fn() }));
import { getHomeProductsFromDb, upsertHomeProductsInDb } from "../dao/products.dao";
import { updateHomeProductsService } from "./products.service";

describe("services visibility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getHomeProductsFromDb).mockResolvedValue({ header: DEFAULT_HOME_PRODUCTS_HEADER, products: DEFAULT_HOME_PRODUCTS });
    vi.mocked(upsertHomeProductsInDb).mockImplementation(async (data) => data);
  });
  it("updates block visibility without losing services", async () => {
    const sections = { header: false, services: true, cases: false };
    const result = await updateHomeProductsService({ sections });
    expect(result.header.sections).toEqual(sections);
    expect(result.products).toEqual(DEFAULT_HOME_PRODUCTS);
  });
  it("preserves block visibility when saving header and individual service states", async () => {
    const sections = { header: false, services: true, cases: false };
    vi.mocked(getHomeProductsFromDb).mockResolvedValue({ header: { ...DEFAULT_HOME_PRODUCTS_HEADER, sections }, products: DEFAULT_HOME_PRODUCTS });
    const result = await updateHomeProductsService({ header: DEFAULT_HOME_PRODUCTS_HEADER, products: DEFAULT_HOME_PRODUCTS.map(p => ({ ...p, visible: false })) });
    expect(result.header.sections).toEqual(sections);
    expect(result.products.every(p => p.visible === false)).toBe(true);
  });
  it("rejects invalid visibility without writing data", async () => {
    await expect(updateHomeProductsService({ sections: { header: "false", services: true, cases: true } })).rejects.toThrow();
    await expect(updateHomeProductsService({ products: [{ ...DEFAULT_HOME_PRODUCTS[0], visible: "false" }] })).rejects.toThrow();
    expect(upsertHomeProductsInDb).not.toHaveBeenCalled();
  });
});
