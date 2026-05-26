import { NextRequest, NextResponse } from "next/server";
import {
  getHomeBigCardController,
  updateHomeBigCardController,
} from "@/apiPack/controller/bigcard.controller";

export async function GET() {
  const response = await getHomeBigCardController();
  return NextResponse.json(response.body, { status: response.status });
}

export async function PUT(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "El body debe ser un JSON válido." }, { status: 400 });
  }

  const response = await updateHomeBigCardController(payload);
  return NextResponse.json(response.body, { status: response.status });
}