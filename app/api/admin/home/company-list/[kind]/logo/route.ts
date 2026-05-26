import { NextRequest, NextResponse } from "next/server";
import { deleteImageFromBlob, uploadImageFromFormData, ImageUploadError, isVercelBlobUrl } from "@/utils/blobUtils";
import type { CompanyListKind } from "@/types/company-list";

export const dynamic = "force-dynamic";

function parseKind(value: string): CompanyListKind | null {
  return value === "holdings" || value === "clients" ? value : null;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const parsedKind = parseKind(kind);

  if (!parsedKind) {
    return NextResponse.json({ error: "Tipo de lista inválido." }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const fileName = formData.get("fileName");
    const previousLogo = formData.get("previousLogo");
    const upload = await uploadImageFromFormData(formData, "file", {
      folder: `home/company-list/${parsedKind}`,
      fileName: typeof fileName === "string" ? fileName : undefined,
      maxSizeMb: 4,
    });

    if (typeof previousLogo === "string" && previousLogo.trim() && previousLogo !== upload.url && isVercelBlobUrl(previousLogo.trim())) {
      try {
        await deleteImageFromBlob(previousLogo.trim());
      } catch (deleteError) {
        console.warn("Could not delete previous company logo blob", deleteError);
      }
    }

    return NextResponse.json({ url: upload.url, pathname: upload.pathname }, { status: 200 });
  } catch (error) {
    const message = error instanceof ImageUploadError ? error.message : "No se pudo subir el logo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}