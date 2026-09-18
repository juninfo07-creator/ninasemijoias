"use client";

import { useActionState } from "react";
import { solicitarRedefinicao, type EsqueciSenhaState } from "./actions";

export function EsqueciSenhaForm() {
  const [state, formAction, pending] = useActionState<EsqueciSenhaState | undefined, FormData>(
    solicitarRedefinicao,
    undefined
  );

  if (state?.success) {
    return (
      <p className="text-sm text-green-700">
        Se esse e-mail estiver cadastrado, você vai receber um link pra redefinir a senha.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-neutral-700">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Enviando..." : "Enviar link de redefinição"}
      </button>
    </form>
  );
}
