import { NextResponse } from "next/server";
import { newsErrorResponse, newsResponse } from "@/apiPack/controller/news.controller";
import {
  getNewsSectionVisibilityService,
  updateNewsSectionVisibilityService,
} from "@/apiPack/service/news.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getNewsSectionVisibilityService();
    return newsResponse(payload);
  } catch (error) {
    return newsErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const payload = await updateNewsSectionVisibilityService(body);
    return newsResponse(payload);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    return newsErrorResponse(error);
  }
}
