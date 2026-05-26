import { NextRequest, NextResponse } from "next/server";
import type { CompanyListKind } from "@/types/company-list";
import { getCompanyListController, updateCompanyListController } from "@/apiPack/controller/company-list.controller";

export const dynamic = "force-dynamic";

function parseKind(value: string): CompanyListKind | null {
  return value === "holdings" || value === "clients" ? value : null;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const parsedKind = parseKind(kind);

  if (!parsedKind) {
    return NextResponse.json({ error: "Tipo de lista inválido." }, { status: 400 });
  }

  const response = await getCompanyListController(parsedKind);
  return NextResponse.json(response.body, { status: response.status });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const parsedKind = parseKind(kind);

  if (!parsedKind) {
    return NextResponse.json({ error: "Tipo de lista inválido." }, { status: 400 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "El body debe ser un JSON válido." }, { status: 400 });
  }

  const response = await updateCompanyListController(parsedKind, payload);
  return NextResponse.json(response.body, { status: response.status });
}