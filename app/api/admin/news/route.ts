import { NextResponse } from "next/server";
import { newsErrorResponse, newsResponse } from "@/apiPack/controller/news.controller";
import {
  getAdminNewsService,
  updateNewsActivationService,
  upsertNewsService,
} from "@/apiPack/service/news.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getAdminNewsService();
    return newsResponse(payload);
  } catch (error) {
    return newsErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await upsertNewsService(body);
    return newsResponse(item);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    return newsErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const item = await updateNewsActivationService(body);
    return newsResponse(item);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    return newsErrorResponse(error);
  }
}
