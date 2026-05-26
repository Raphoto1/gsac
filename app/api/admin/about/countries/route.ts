import { NextRequest, NextResponse } from "next/server";
import {
  getAboutCountriesController,
  updateAboutCountriesController,
} from "@/apiPack/controller/about-content.controller";

export async function GET() {
  const response = await getAboutCountriesController();
  return NextResponse.json(response.body, { status: response.status });
}

export async function PUT(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "El body debe ser un JSON valido." }, { status: 400 });
  }

  const response = await updateAboutCountriesController(payload);
  return NextResponse.json(response.body, { status: response.status });
}
