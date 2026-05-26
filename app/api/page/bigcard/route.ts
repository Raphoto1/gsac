import { NextResponse } from "next/server";
import { getHomeBigCardController } from "@/apiPack/controller/bigcard.controller";

export async function GET() {
  const response = await getHomeBigCardController();
  return NextResponse.json(response.body, { status: response.status });
}