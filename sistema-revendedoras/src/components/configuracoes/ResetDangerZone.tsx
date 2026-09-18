"use client";

import { useActionState, useState } from "react";
import { resetarDadosOperacionais, type ResetState } from "@/app/(app)/configuracoes/actions";

const FRASE_CONFIRMACAO = "APAGAR TUDO";

export function ResetDangerZone() {
  const [state, formAction, pending] = useActionState<ResetState | undefined, FormData>(
    resetarDadosOperacionais,
    undefined
  );
  const [texto, setTexto] = useState("");
  const confirmado = texto === FRASE_CONFIRMACAO;

  return (
    <section className="flex flex-col gap-3 rounded-md border border-red-300 bg-red-50 p-4">
      <h2 className="text-sm font-semibold text-red-800">Zona de risco</h2>
      <p className="text-sm text-red-700">
        Apaga permanentemente todas as revendedoras, mostruários, entregas, conferências, pagamentos e
        repasses. As configurações (percentuais e prazo) não são afetadas. Essa ação não pode ser desfeita.
      </p>
      <a
        href="/api/backup"
        className="w-fit rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        Baixar backup antes de apagar
      </a>
      <form action={formAction} className="flex flex-col gap-2">
        <label htmlFor="confirmacao" className="text-xs font-medium text-red-800">
          Digite <span className="font-mono">{FRASE_CONFIRMACAO}</span> pra confirmar
        </label>
        <input
          id="confirmacao"
          name="confirmacao"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          autoComplete="off"
          className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm"
        />
        {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
        <button
          type="submit"
          disabled={!confirmado || pending}
          className="w-fit rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Apagando..." : "Apagar dados operacionais"}
        </button>
      </form>
    </section>
  );
}
