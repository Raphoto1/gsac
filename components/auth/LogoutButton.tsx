"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Cerrar sesion
    </button>
  );
}
