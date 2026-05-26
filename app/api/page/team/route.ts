import { NextResponse } from "next/server";
import { getHomeTeamController } from "@/apiPack/controller/team.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await getHomeTeamController();
  return NextResponse.json(response.body, { status: response.status });
}