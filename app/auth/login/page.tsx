"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/gsControl";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (!result || result.error) {
      setError("Credenciales invalidas");
      return;
    }

    router.push(result.url || callbackUrl);
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4">
      <form onSubmit={handleSubmit} className="card w-full bg-base-100 shadow-xl">
        <div className="card-body gap-3">
          <h1 className="card-title text-2xl">Iniciar sesion</h1>
          <label className="form-control w-full">
            <span className="label-text mb-1">Email</span>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text mb-1">Password</span>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <button type="submit" className="btn btn-primary mt-2" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
