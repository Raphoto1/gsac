import { NextResponse } from "next/server";
import { clearAttendedContactSubmissionsService } from "@/apiPack/service/contact-submission.service";

export async function DELETE() {
  try {
    await clearAttendedContactSubmissionsService();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error clearing attended submissions:", error);
    return NextResponse.json(
      { error: "Failed to clear attended submissions" },
      { status: 500 }
    );
  }
}
