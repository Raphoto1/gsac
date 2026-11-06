import type { Metadata } from "next";
import { buildNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNoIndexMetadata(
  "Iniciar sesion",
  "Acceso privado al panel de administracion de GS Capital."
);

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}