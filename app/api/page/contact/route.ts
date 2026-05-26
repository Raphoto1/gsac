import { NextResponse } from "next/server";
import { getContactInfoService } from "@/apiPack/service/contact.service";

export async function GET() {
  try {
    const contactInfo = await getContactInfoService();
    return NextResponse.json(contactInfo);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch contact info" },
      { status: 500 }
    );
  }
}
