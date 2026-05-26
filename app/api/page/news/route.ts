import { NextResponse } from "next/server";
import { getPublicNewsService } from "@/apiPack/service/news.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await getPublicNewsService();
    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
