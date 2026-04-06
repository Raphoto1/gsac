import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/auth/LogoutButton";
import AdminHome from "@/components/admin/AdminHome";
import AdminAbout from "@/components/admin/AdminAbout";
import AdminProducts from "@/components/admin/AdminProducts";
import { buildNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNoIndexMetadata(
  "GS Control",
  "Area privada de administracion de GSAC."
);

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login?callbackUrl=/gsControl");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 md:pt-36">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">GS Control</h1>
          <p className="mt-2 text-base-content/80">Area protegida. Sesion iniciada como {session.user?.email}.</p>
        </div>
        <LogoutButton />
      </div>
      <AdminHome />
      <AdminAbout />
      <AdminProducts />
    </div>
  );
}