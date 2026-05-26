import { NextRequest, NextResponse } from "next/server";
import { getHomeTeamController, updateHomeTeamController } from "@/apiPack/controller/team.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await getHomeTeamController();
  return NextResponse.json(response.body, { status: response.status });
}

export async function PUT(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "El body debe ser un JSON válido." }, { status: 400 });
  }

  const response = await updateHomeTeamController(payload);
  return NextResponse.json(response.body, { status: response.status });
}