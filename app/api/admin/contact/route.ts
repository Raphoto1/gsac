import { NextResponse } from "next/server";
import {
  getAllContactSubmissionsService,
  createContactSubmissionService,
} from "@/apiPack/service/contact-submission.service";

export async function GET() {
  try {
    const submissions = await getAllContactSubmissionsService();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name: string = (body.name ?? "").trim();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const company: string = (body.company ?? "").trim();
    const message: string = (body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "name, email and message are required" },
        { status: 400 }
      );
    }

    const submission = await createContactSubmissionService({
      name,
      email,
      company,
      message,
      resendId: "",
      priority: "urgent",
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating contact submission:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
