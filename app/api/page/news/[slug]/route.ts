import { NextResponse } from "next/server";
import { getNewsBySlugService } from "@/apiPack/service/news.service";

type Params = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const item = await getNewsBySlugService(slug);

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch news article" },
      { status: 500 }
    );
  }
}
