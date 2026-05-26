import { NextResponse } from "next/server";
import { getGeneralInfoController } from "@/apiPack/controller/general.controller";

export async function GET() {
  const response = await getGeneralInfoController();
  return NextResponse.json(response.body, { status: response.status });
}
