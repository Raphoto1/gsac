import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin</h1>
          <p className="mt-2 text-base-content/80">Area protegida. Sesion iniciada como {session.user?.email}.</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
