import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../dao/contact-submission.dao", () => ({
  createContactSubmissionInDb: vi.fn(),
  getAllContactSubmissionsFromDb: vi.fn(),
  updateContactSubmissionInDb: vi.fn(),
  deleteContactSubmissionFromDb: vi.fn(),
  clearAttendedContactSubmissionsFromDb: vi.fn(),
}));

type TestContactInput = {
  name: string;
  email: string;
  company: string;
  message: string;
  resendId: string;
  priority?: "normal" | "urgent";
};

function generateTestContact(overrides: Partial<TestContactInput> = {}): TestContactInput {
  const baseId = Date.now();

  return {
    name: "Jane",
    email: `jane.${baseId}@example.com`,
    company: "ACME",
    message: "Hola equipo GSAC",
    resendId: `res_${baseId}`,
    ...overrides,
  };
}

describe("contact submission service db writes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("uploads data to db with default priority", async () => {
    const dao = await import("../dao/contact-submission.dao");
    const service = await import("./contact-submission.service");
    const contact = generateTestContact();

    vi.mocked(dao.createContactSubmissionInDb).mockResolvedValue({
      id: "1",
      name: contact.name,
      email: contact.email,
      company: contact.company,
      message: contact.message,
      resendId: contact.resendId,
      priority: "normal",
      attended: false,
      createdAt: new Date("2026-05-01T00:00:00.000Z"),
    });

    const result = await service.createContactSubmissionService(contact);

    expect(dao.createContactSubmissionInDb).toHaveBeenCalledWith(
      expect.objectContaining({
        name: contact.name,
        email: contact.email,
        company: contact.company,
        message: contact.message,
        resendId: contact.resendId,
        priority: "normal",
      }),
    );
    expect(result.priority).toBe("normal");
  });

  it("keeps urgent priority when it is valid", async () => {
    const dao = await import("../dao/contact-submission.dao");
    const service = await import("./contact-submission.service");
    const contact = generateTestContact({
      name: "John",
      email: "john@example.com",
      message: "Urgente",
      priority: "urgent",
      resendId: "res_456",
    });

    vi.mocked(dao.createContactSubmissionInDb).mockResolvedValue({
      id: "2",
      name: contact.name,
      email: contact.email,
      company: contact.company,
      message: contact.message,
      resendId: contact.resendId,
      priority: "urgent",
      attended: false,
      createdAt: new Date("2026-05-01T00:00:00.000Z"),
    });

    await service.createContactSubmissionService(contact);

    expect(dao.createContactSubmissionInDb).toHaveBeenCalledWith(
      expect.objectContaining({ priority: "urgent" }),
    );
  });
});
