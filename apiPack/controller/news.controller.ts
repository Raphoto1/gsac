import { NextResponse } from "next/server";
import { NewsValidationError } from "../service/news.service";

export function newsResponse(data: unknown) {
  return NextResponse.json(data);
}

export function newsErrorResponse(error: unknown) {
  if (error instanceof NewsValidationError) {
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
