import { NextResponse } from "next/server";
import { getHomeHeroController } from "@/apiPack/controller/hero.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await getHomeHeroController();
  return NextResponse.json(response.body, { status: response.status });
}