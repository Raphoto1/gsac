import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/auth/LogoutButton";
import AdminPanel from "@/components/admin/AdminPanel";
import { buildNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNoIndexMetadata("GS Control", "Area privada de administracion de GSAC.");

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
          <p className="mt-2 text-base-content/80">
            Área protegida. Sesión iniciada como{" "}
            <span className="font-medium">{session.user?.email}</span>.
          </p>
        </div>
        <LogoutButton />
      </div>

      <AdminPanel />
    </div>
  );
}
