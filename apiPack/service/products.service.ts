import {
  DEFAULT_HOME_PRODUCTS_HEADER,
  HOME_PRODUCT_ICON_OPTIONS,
  type HomeProductIcon,
  type HomeProductItem,
  type HomeProductsHeader,
  type HomeProductsResponse,
} from "@/types/home-products";
import { getHomeProductsFromDb, upsertHomeProductsInDb, type HomeProductsRecord } from "../dao/products.dao";

type ProductsPayload = {
  header?: unknown;
  products?: unknown;
};

export class ProductsValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductsValidationError";
  }
}

function normalizeLocalizedText(value: unknown, fieldName: string) {
  if (!value || typeof value !== "object") {
    throw new ProductsValidationError(`El campo ${fieldName} debe ser un objeto valido.`);
  }

  const es = (value as { es?: unknown }).es;
  const en = (value as { en?: unknown }).en;

  if (typeof es !== "string" || typeof en !== "string") {
    throw new ProductsValidationError(`El campo ${fieldName} debe tener textos en espanol e ingles.`);
  }

  if (!es.trim() || !en.trim()) {
    throw new ProductsValidationError(`El campo ${fieldName} no puede estar vacio.`);
  }

  return { es: es.trim(), en: en.trim() };
}

function normalizeLocalizedTextOptional(value: unknown, fallback: { es: string; en: string }, fieldName: string) {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (!value || typeof value !== "object") {
    throw new ProductsValidationError(`El campo ${fieldName} debe ser un objeto valido.`);
  }

  const es = (value as { es?: unknown }).es;
  const en = (value as { en?: unknown }).en;

  if (typeof es !== "string" || typeof en !== "string") {
    throw new ProductsValidationError(`El campo ${fieldName} debe tener textos en espanol e ingles.`);
  }

  const normalizedEs = es.trim();
  const normalizedEn = en.trim();

  return {
    es: normalizedEs || fallback.es,
    en: normalizedEn || fallback.en,
  };
}

function parseHeader(header: unknown, fallback: HomeProductsHeader): HomeProductsHeader {
  if (!header || typeof header !== "object") {
    throw new ProductsValidationError("El campo header debe ser un objeto valido.");
  }

  const title = normalizeLocalizedText((header as { title?: unknown }).title, "header.title");
  const description = normalizeLocalizedText((header as { description?: unknown }).description, "header.description");
  const secondaryDescription = normalizeLocalizedTextOptional(
    (header as { secondaryDescription?: unknown }).secondaryDescription,
    fallback.secondaryDescription,
    "header.secondaryDescription",
  );

  const imageValue = (header as { imageUrl?: unknown }).imageUrl;
  const imageUrl = typeof imageValue === "string" ? imageValue.trim() : "";

  return {
    title,
    description,
    secondaryDescription,
    imageUrl: imageUrl || fallback.imageUrl,
  };
}

function parseIcon(value: unknown, index: number): HomeProductIcon {
  if (typeof value !== "string") {
    throw new ProductsValidationError(`El icono del servicio ${index + 1} debe ser un texto valido.`);
  }

  if (!HOME_PRODUCT_ICON_OPTIONS.includes(value as HomeProductIcon)) {
    throw new ProductsValidationError(`El icono del servicio ${index + 1} no pertenece al catalogo permitido.`);
  }

  return value as HomeProductIcon;
}

function parseProducts(products: unknown): HomeProductItem[] {
  if (!Array.isArray(products)) {
    throw new ProductsValidationError("El campo products debe ser un arreglo.");
  }

  const parsed = products.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new ProductsValidationError(`El servicio ${index + 1} debe ser un objeto valido.`);
    }

    const idValue = (item as { id?: unknown }).id;
    const title = normalizeLocalizedText((item as { title?: unknown }).title, "product.title");
    const description = normalizeLocalizedText((item as { description?: unknown }).description, "product.description");
    const icon = parseIcon((item as { icon?: unknown }).icon, index);
    const expandTitle = normalizeLocalizedTextOptional(
      (item as { expandTitle?: unknown }).expandTitle,
      title,
      "product.expandTitle",
    );
    const expandText = normalizeLocalizedTextOptional(
      (item as { expandText?: unknown }).expandText,
      description,
      "product.expandText",
    );

    if (typeof idValue !== "number" || !Number.isInteger(idValue) || idValue <= 0) {
      throw new ProductsValidationError(`El servicio ${index + 1} debe incluir un id entero positivo.`);
    }

    const expandImageValue = (item as { expandImage?: unknown }).expandImage;
    const expandImage = typeof expandImageValue === "string" ? expandImageValue.trim() : "";

    return {
      id: idValue,
      title,
      description,
      icon,
      expandTitle,
      expandText,
      expandImage,
    };
  });

  const ids = new Set<number>();
  for (const item of parsed) {
    if (ids.has(item.id)) {
      throw new ProductsValidationError("No se permiten ids duplicados en products.");
    }

    ids.add(item.id);
  }

  return parsed.sort((a, b) => a.id - b.id);
}

function mapRecordToResponse(record: HomeProductsRecord): HomeProductsResponse {
  return {
    header: record.header ?? DEFAULT_HOME_PRODUCTS_HEADER,
    products: record.products,
  };
}

export async function getHomeProductsService(): Promise<HomeProductsResponse> {
  const record = await getHomeProductsFromDb();
  return mapRecordToResponse(record);
}

export async function updateHomeProductsService(payload: unknown): Promise<HomeProductsResponse> {
  if (!payload || typeof payload !== "object") {
    throw new ProductsValidationError("Payload invalido.");
  }

  const data = payload as ProductsPayload;
  if (!("header" in data) && !("products" in data)) {
    throw new ProductsValidationError("El payload debe incluir header, products o ambos.");
  }

  const current = await getHomeProductsFromDb();
  const currentResponse = mapRecordToResponse(current);

  const nextHeader = "header" in data
    ? parseHeader(data.header, currentResponse.header)
    : currentResponse.header;

  const nextProducts = "products" in data
    ? parseProducts(data.products)
    : currentResponse.products;

  const record = await upsertHomeProductsInDb({
    header: nextHeader,
    products: nextProducts,
  });

  return mapRecordToResponse(record);
}
