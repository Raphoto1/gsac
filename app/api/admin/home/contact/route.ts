import { NextResponse } from "next/server";
import {
  getContactInfoService,
  updateContactInfoService,
} from "@/apiPack/service/contact.service";
import {
  contactInfoResponse,
  contactInfoErrorResponse,
} from "@/apiPack/controller/contact.controller";

export async function GET() {
  try {
    const contactInfo = await getContactInfoService();
    return contactInfoResponse(contactInfo);
  } catch (error) {
    return contactInfoErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const contactInfo = await updateContactInfoService(body);
    return contactInfoResponse(contactInfo);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }
    return contactInfoErrorResponse(error);
  }
}
