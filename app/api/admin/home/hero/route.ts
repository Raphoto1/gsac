import { NextRequest, NextResponse } from "next/server";
import { getHomeHeroController, updateHomeHeroController } from "@/apiPack/controller/hero.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await getHomeHeroController();
  return NextResponse.json(response.body, { status: response.status });
}

export async function PUT(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "El body debe ser un JSON válido." }, { status: 400 });
  }

  const response = await updateHomeHeroController(payload);
  return NextResponse.json(response.body, { status: response.status });
}