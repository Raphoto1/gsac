import { NextRequest, NextResponse } from "next/server";
import { getHomeCasesController, updateHomeCasesController } from "@/apiPack/controller/cases.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await getHomeCasesController();
  return NextResponse.json(response.body, { status: response.status });
}

export async function PUT(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "El body debe ser un JSON válido." }, { status: 400 });
  }

  const response = await updateHomeCasesController(payload);
  return NextResponse.json(response.body, { status: response.status });
}