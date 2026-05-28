import { NextResponse } from "next/server";
import {
  updateContactSubmissionService,
  deleteContactSubmissionService,
} from "@/apiPack/service/contact-submission.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const patch: { priority?: string; attended?: boolean } = {};

    if (body.priority !== undefined) patch.priority = body.priority;
    if (body.attended !== undefined) patch.attended = Boolean(body.attended);

    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await updateContactSubmissionService(id, patch);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating contact submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await deleteContactSubmissionService(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting contact submission:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
