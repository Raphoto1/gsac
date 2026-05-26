import { NextResponse } from "next/server";
import { getNewsSectionVisibilityService } from "@/apiPack/service/news.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getNewsSectionVisibilityService();
    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to fetch news section visibility" }, { status: 500 });
  }
}
