import { NextRequest, NextResponse } from "next/server";
import { deleteImageFromBlob, uploadImageFromFormData, ImageUploadError, isVercelBlobUrl } from "@/utils/blobUtils";
import type { AboutCardSectionId } from "@/types/about-content";

export const dynamic = "force-dynamic";

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

export async function POST(request: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const parsedSection = parseSection(section);

  if (!parsedSection) {
    return NextResponse.json({ error: "Seccion invalida." }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const fileName = formData.get("fileName");
    const previousImage = formData.get("previousImage");

    const upload = await uploadImageFromFormData(formData, "file", {
      folder: `about/cards/${parsedSection}`,
      fileName: typeof fileName === "string" ? fileName : undefined,
      maxSizeMb: 6,
    });

    if (typeof previousImage === "string" && previousImage.trim() && previousImage !== upload.url && isVercelBlobUrl(previousImage.trim())) {
      try {
        await deleteImageFromBlob(previousImage.trim());
      } catch (deleteError) {
        console.warn("Could not delete previous about card image blob", deleteError);
      }
    }

    return NextResponse.json({ url: upload.url, pathname: upload.pathname }, { status: 200 });
  } catch (error) {
    const message = error instanceof ImageUploadError ? error.message : "No se pudo subir la imagen.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
