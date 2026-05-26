import type { ContactInfo } from "@/types/contact";
import {
  getContactInfoFromDb,
  upsertContactInfoInDb,
} from "../dao/contact.dao";

export class ContactValidationError extends Error {
  constructor(
    public field: string,
    public message: string
  ) {
    super(message);
    this.name = "ContactValidationError";
  }
}

function normalizeText(value: unknown): string {
  if (typeof value !== "string") {
    throw new ContactValidationError(
      "text",
      "Text must be a string"
    );
  }
  return value.trim();
}

function normalizeTextOptional(value: unknown): string {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  if (typeof value !== "string") {
    throw new ContactValidationError(
      "text",
      "Text must be a string or empty"
    );
  }
  return value.trim();
}

export async function getContactInfoService(): Promise<ContactInfo> {
  return getContactInfoFromDb();
}

export async function updateContactInfoService(
  input: unknown
): Promise<ContactInfo> {
  if (typeof input !== "object" || input === null) {
    throw new ContactValidationError(
      "input",
      "Input must be an object"
    );
  }

  const data = input as Record<string, unknown>;

  const companyName = normalizeText(data.companyName);
  if (!companyName) {
    throw new ContactValidationError(
      "companyName",
      "Company name is required"
    );
  }

  const nit = normalizeText(data.nit);
  if (!nit) {
    throw new ContactValidationError(
      "nit",
      "NIT is required"
    );
  }

  const email = normalizeText(data.email);
  if (!email) {
    throw new ContactValidationError(
      "email",
      "Email is required"
    );
  }
  
  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    throw new ContactValidationError(
      "email",
      "Invalid email format"
    );
  }

  const phone = normalizeText(data.phone);
  if (!phone) {
    throw new ContactValidationError(
      "phone",
      "Phone is required"
    );
  }

  const address = normalizeTextOptional(data.address);

  const contactInfo: ContactInfo = {
    id: "contact_info",
    companyName,
    nit,
    email,
    phone,
    address,
  };

  return upsertContactInfoInDb(contactInfo);
}
