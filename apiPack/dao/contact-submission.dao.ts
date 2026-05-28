import { prisma } from "@/lib/prisma";

type ContactSubmissionDelegate = {
  create: typeof prisma.contactSubmission.create;
  findMany: typeof prisma.contactSubmission.findMany;
  update: typeof prisma.contactSubmission.update;
  delete: typeof prisma.contactSubmission.delete;
  deleteMany: typeof prisma.contactSubmission.deleteMany;
};

function getContactSubmissionDelegate(): ContactSubmissionDelegate {
  const delegate = (
    prisma as unknown as { contactSubmission?: ContactSubmissionDelegate }
  ).contactSubmission;

  if (!delegate) {
    throw new Error(
      "Prisma delegate 'contactSubmission' is unavailable. Run 'npm run prisma:generate' and restart the Next.js dev server."
    );
  }

  return delegate;
}

export type ContactSubmissionRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  resendId: string;
  priority: string;
  attended: boolean;
  createdAt: Date;
};

export async function createContactSubmissionInDb(data: {
  name: string;
  email: string;
  company: string;
  message: string;
  resendId: string;
  priority?: string;
}): Promise<ContactSubmissionRow> {
  return getContactSubmissionDelegate().create({
    data: {
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
      resendId: data.resendId,
      priority: data.priority ?? "normal",
    },
  });
}

export async function getAllContactSubmissionsFromDb(): Promise<
  ContactSubmissionRow[]
> {
  return getContactSubmissionDelegate().findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateContactSubmissionInDb(
  id: string,
  patch: { priority?: string; attended?: boolean }
): Promise<ContactSubmissionRow> {
  return getContactSubmissionDelegate().update({
    where: { id },
    data: patch,
  });
}

export async function deleteContactSubmissionFromDb(id: string): Promise<void> {
  await getContactSubmissionDelegate().delete({ where: { id } });
}

export async function clearAttendedContactSubmissionsFromDb(): Promise<void> {
  await getContactSubmissionDelegate().deleteMany({ where: { attended: true } });
}
