import { NextRequest, NextResponse } from "next/server";
import {
  getHomeProductsController,
  updateHomeProductsController,
} from "@/apiPack/controller/products.controller";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await getHomeProductsController();
  return NextResponse.json(response.body, { status: response.status });
}

export async function PUT(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "El body debe ser un JSON valido." }, { status: 400 });
  }

  const response = await updateHomeProductsController(payload);
  return NextResponse.json(response.body, { status: response.status });
}
