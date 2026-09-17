"use client";

import { useActionState } from "react";
import { registrarPagamento, type PagamentoState } from "@/app/(app)/conferencias/pagamentos-actions";
import { hojeBrasilia } from "@/lib/financeiro/datas";

const FORMAS = ["PIX", "Dinheiro", "Transferência", "Cartão", "Outro"] as const;

export function PagamentoForm({ conferenciaId, valorSugerido }: { conferenciaId: string; valorSugerido: number }) {
  const action = registrarPagamento.bind(null, conferenciaId);
  const [state, formAction, pending] = useActionState<PagamentoState | undefined, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-md border border-neutral-200 p-4">
      <h3 className="text-sm font-semibold text-neutral-900">Registrar pagamento</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="valor_pago" className="text-xs font-medium text-neutral-700">
            Valor pago (R$)
          </label>
          <input
            id="valor_pago"
            name="valor_pago"
            type="number"
            step="0.01"
            min={0.01}
            defaultValue={valorSugerido > 0 ? valorSugerido : undefined}
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="data" className="text-xs font-medium text-neutral-700">
            Data
          </label>
          <input
            id="data"
            name="data"
            type="date"
            defaultValue={hojeBrasilia()}
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="forma_pagamento" className="text-xs font-medium text-neutral-700">
            Forma
          </label>
          <select
            id="forma_pagamento"
            name="forma_pagamento"
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {FORMAS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input
        name="observacao"
        placeholder="Observação (opcional)"
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Registrando..." : "Registrar pagamento"}
      </button>
    </form>
  );
}
