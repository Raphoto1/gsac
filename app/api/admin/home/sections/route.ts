import { NextRequest, NextResponse } from "next/server";
import {
  getHomeSectionsOrderController,
  updateHomeSectionsOrderController,
} from "@/apiPack/controller/gscap.controller";
import { prismaConnectionMode } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const response = await getHomeSectionsOrderController();

  const shouldIncludeDebug =
    process.env.NODE_ENV !== "production" &&
    request.nextUrl.searchParams.get("test") === "1";

  if (shouldIncludeDebug) {
    return NextResponse.json(
      {
        ...((response.body ?? {}) as Record<string, unknown>),
        debug: {
          prismaConnectionMode,
        },
      },
      { status: response.status }
    );
  }

  return NextResponse.json(response.body, { status: response.status });
}

export async function PUT(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El body debe ser un JSON válido." },
      { status: 400 }
    );
  }

  const response = await updateHomeSectionsOrderController(payload);
  return NextResponse.json(response.body, { status: response.status });
}
