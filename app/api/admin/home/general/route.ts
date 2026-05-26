import { NextResponse } from "next/server";
import {
  getGeneralInfoController,
  updateGeneralInfoController,
} from "@/apiPack/controller/general.controller";

export async function GET() {
  const response = await getGeneralInfoController();
  return NextResponse.json(response.body, { status: response.status });
}

export async function PUT(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "El body debe ser un JSON válido." }, { status: 400 });
  }

  const response = await updateGeneralInfoController(payload);
  return NextResponse.json(response.body, { status: response.status });
}
