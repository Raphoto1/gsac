import { NextResponse } from "next/server";
import { getHomeCasesController } from "@/apiPack/controller/cases.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await getHomeCasesController();
  return NextResponse.json(response.body, { status: response.status });
}