import { NextResponse } from "next/server";
import { getHomeProductsController } from "@/apiPack/controller/products.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await getHomeProductsController();
  return NextResponse.json(response.body, { status: response.status });
}
