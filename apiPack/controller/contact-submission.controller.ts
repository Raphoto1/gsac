import { NextResponse } from "next/server";
import type { ContactSubmissionRow } from "../dao/contact-submission.dao";

export function submissionResponse(
  data: ContactSubmissionRow | ContactSubmissionRow[]
) {
  return NextResponse.json(data);
}

export function submissionErrorResponse(error: unknown, status = 500) {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  return NextResponse.json({ error: message }, { status });
}
