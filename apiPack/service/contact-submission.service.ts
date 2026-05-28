import {
  createContactSubmissionInDb,
  getAllContactSubmissionsFromDb,
  updateContactSubmissionInDb,
  deleteContactSubmissionFromDb,
  clearAttendedContactSubmissionsFromDb,
  type ContactSubmissionRow,
} from "../dao/contact-submission.dao";

const VALID_PRIORITIES = ["normal", "urgent"] as const;

export async function createContactSubmissionService(data: {
  name: string;
  email: string;
  company: string;
  message: string;
  resendId: string;
  priority?: string;
}): Promise<ContactSubmissionRow> {
  const priority =
    data.priority && VALID_PRIORITIES.includes(data.priority as "normal" | "urgent")
      ? data.priority
      : "normal";
  return createContactSubmissionInDb({ ...data, priority });
}

export async function getAllContactSubmissionsService(): Promise<
  ContactSubmissionRow[]
> {
  return getAllContactSubmissionsFromDb();
}

export async function updateContactSubmissionService(
  id: string,
  patch: { priority?: string; attended?: boolean }
): Promise<ContactSubmissionRow> {
  const update: { priority?: string; attended?: boolean } = {};
  if (patch.attended !== undefined) update.attended = patch.attended;
  if (patch.priority !== undefined) {
    update.priority = VALID_PRIORITIES.includes(
      patch.priority as "normal" | "urgent"
    )
      ? patch.priority
      : "normal";
  }
  return updateContactSubmissionInDb(id, update);
}

export async function deleteContactSubmissionService(id: string): Promise<void> {
  return deleteContactSubmissionFromDb(id);
}

export async function clearAttendedContactSubmissionsService(): Promise<void> {
  return clearAttendedContactSubmissionsFromDb();
}
