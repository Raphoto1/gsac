import { NextResponse } from "next/server";
import type { CompanyListKind } from "@/types/company-list";
import { getCompanyListController } from "@/apiPack/controller/company-list.controller";

export const dynamic = "force-dynamic";

function parseKind(value: string): CompanyListKind | null {
  return value === "holdings" || value === "clients" ? value : null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const parsedKind = parseKind(kind);

  if (!parsedKind) {
    return NextResponse.json({ error: "Tipo de lista inválido." }, { status: 400 });
  }

  const response = await getCompanyListController(parsedKind);
  return NextResponse.json(response.body, { status: response.status });
}