import { NextResponse } from "next/server";
import { getHomeSectionsOrderController } from "@/apiPack/controller/gscap.controller";

export async function GET() {
	const response = await getHomeSectionsOrderController();
	return NextResponse.json(response.body, { status: response.status });
}
