import { NextResponse } from "next/server";
import type { ContactInfo } from "@/types/contact";
import { ContactValidationError } from "../service/contact.service";

export function contactInfoResponse(data: ContactInfo) {
  return NextResponse.json(data);
}

export function contactInfoErrorResponse(error: unknown) {
  if (error instanceof ContactValidationError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        field: error.field,
        message: error.message,
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: "An unexpected error occurred",
    },
    { status: 500 }
  );
}
