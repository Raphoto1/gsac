import { NextRequest, NextResponse } from "next/server";
import type { AboutCardSectionId } from "@/types/about-content";
import {
  getAboutCardSectionController,
  updateAboutCardSectionController,
} from "@/apiPack/controller/about-content.controller";

function parseSection(value: string): AboutCardSectionId | null {
  return value === "intro" ||
    value === "mission" ||
    value === "vision" ||
    value === "services" ||
    value === "whyUs" ||
    value === "experience"
    ? value
    : null;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const parsedSection = parseSection(section);

  if (!parsedSection) {
    return NextResponse.json({ error: "Seccion invalida." }, { status: 400 });
  }

  const response = await getAboutCardSectionController(parsedSection);
  return NextResponse.json(response.body, { status: response.status });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const parsedSection = parseSection(section);

  if (!parsedSection) {
    return NextResponse.json({ error: "Seccion invalida." }, { status: 400 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "El body debe ser un JSON valido." }, { status: 400 });
  }

  const response = await updateAboutCardSectionController(parsedSection, payload);
  return NextResponse.json(response.body, { status: response.status });
}
