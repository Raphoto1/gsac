import "server-only";

import { del, put, type PutBlobResult } from "@vercel/blob";

const DEFAULT_MAX_IMAGE_SIZE_MB = 8;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"]);

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

function getBlobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new ImageUploadError("Falta BLOB_READ_WRITE_TOKEN en variables de entorno.");
  }

  return token;
}

function sanitizeSegment(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function extensionFromFile(file: File): string {
  const byType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/svg+xml": "svg",
  };

  const fromMime = byType[file.type];
  if (fromMime) return fromMime;

  const splitByDot = file.name.split(".");
  const fromName = splitByDot.length > 1 ? sanitizeSegment(splitByDot.pop() || "") : "";
  return fromName || "bin";
}

export function validateImageFile(file: File, maxSizeMb = DEFAULT_MAX_IMAGE_SIZE_MB): void {
  if (!(file instanceof File)) {
    throw new ImageUploadError("El archivo recibido no es válido.");
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new ImageUploadError("Formato de imagen no permitido.");
  }

  const maxBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new ImageUploadError(`La imagen supera el tamaño máximo de ${maxSizeMb}MB.`);
  }
}

export type UploadImageOptions = {
  folder?: string;
  fileName?: string;
  maxSizeMb?: number;
  cacheControlMaxAge?: number;
};

export async function uploadImageToBlob(file: File, options: UploadImageOptions = {}): Promise<PutBlobResult> {
  const { folder = "uploads", fileName, maxSizeMb = DEFAULT_MAX_IMAGE_SIZE_MB, cacheControlMaxAge = 60 * 60 * 24 * 30 } = options;

  validateImageFile(file, maxSizeMb);

  const token = getBlobToken();
  const ext = extensionFromFile(file);
  const baseName = sanitizeSegment(fileName || file.name.replace(/\.[^.]+$/, "")) || "image";
  const normalizedFolder = sanitizeSegment(folder) || "uploads";
  const pathname = `${normalizedFolder}/${baseName}-${Date.now()}.${ext}`;

  return put(pathname, file, {
    access: "public",
    token,
    addRandomSuffix: false,
    contentType: file.type,
    cacheControlMaxAge,
  });
}

export async function deleteImageFromBlob(url: string): Promise<void> {
  const token = getBlobToken();
  const parsed = new URL(url);

  if (!parsed.hostname.includes("blob.vercel-storage.com")) {
    throw new ImageUploadError("La URL no corresponde a Vercel Blob.");
  }

  await del(url, { token });
}

export function isVercelBlobUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes("blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function uploadImageFromFormData(formData: FormData, fieldName = "file", options: UploadImageOptions = {}): Promise<PutBlobResult> {
  const maybeFile = formData.get(fieldName);

  if (!(maybeFile instanceof File)) {
    throw new ImageUploadError(`No se encontró un archivo en el campo ${fieldName}.`);
  }

  return uploadImageToBlob(maybeFile, options);
}
