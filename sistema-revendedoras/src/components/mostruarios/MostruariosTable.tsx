"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { alterarStatusEmMassa } from "@/app/(app)/mostruarios/actions";

const STATUS_BADGE: Record<string, string> = {
  "Disponível": "bg-green-50 text-green-700",
  "Com revendedora": "bg-blue-50 text-blue-700",
  "Em conferência": "bg-yellow-50 text-yellow-700",
  "Finalizado": "bg-neutral-100 text-neutral-600",
  "Em manutenção/perda": "bg-red-50 text-red-700",
};

interface Mostruario {
  id: string;
  codigo: string;
  nome: string;
  valor_total: number;
  status: string;
}

export function MostruariosTable({ mostruarios }: { mostruarios: Mostruario[] }) {
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  function alternarSelecao(id: string) {
    setSelecionados((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  function alternarTodos() {
    setSelecionados((atual) =>
      atual.size === mostruarios.length ? new Set() : new Set(mostruarios.map((m) => m.id))
    );
  }

  function aplicarEmMassa(novoStatus: "Disponível" | "Em manutenção/perda") {
    startTransition(async () => {
      await alterarStatusEmMassa(Array.from(selecionados), novoStatus);
      setSelecionados(new Set());
    });
  }

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const todosSelecionados = mostruarios.length > 0 && selecionados.size === mostruarios.length;

  return (
    <div>
      {selecionados.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm">
          <span>{selecionados.size} selecionado(s)</span>
          <button
            type="button"
            disabled={pending}
            onClick={() => aplicarEmMassa("Disponível")}
            className="rounded-md bg-neutral-900 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            Marcar Disponível
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => aplicarEmMassa("Em manutenção/perda")}
            className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            Marcar manutenção/perda
          </button>
          <span className="text-xs text-neutral-500">Não afeta os que estão com alguma revendedora.</span>
        </div>
      )}

      {/* Mobile: cards */}
      <div className="flex flex-col gap-2 sm:hidden">
        {mostruarios.map((m) => (
          <div key={m.id} className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white p-3 text-sm">
            <input
              type="checkbox"
              checked={selecionados.has(m.id)}
              onChange={() => alternarSelecao(m.id)}
              className="h-4 w-4"
            />
            <Link href={`/mostruarios/${m.id}`} className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-900">{m.codigo} — {m.nome}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_BADGE[m.status] ?? "bg-neutral-100"}`}>
                  {m.status}
                </span>
              </div>
              <p className="text-neutral-500">{fmt(m.valor_total)}</p>
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop: tabela */}
      <div className="hidden overflow-x-auto rounded-md border border-neutral-200 sm:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              <th className="w-10 px-4 py-2">
                <input type="checkbox" checked={todosSelecionados} onChange={alternarTodos} className="h-4 w-4" />
              </th>
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Valor</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {mostruarios.map((m) => (
              <tr key={m.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selecionados.has(m.id)}
                    onChange={() => alternarSelecao(m.id)}
                    className="h-4 w-4"
                  />
                </td>
                <td className="px-4 py-2">
                  <Link href={`/mostruarios/${m.id}`} className="text-neutral-900 hover:underline">
                    {m.codigo}
                  </Link>
                </td>
                <td className="px-4 py-2 text-neutral-600">{m.nome}</td>
                <td className="px-4 py-2 text-neutral-600">{fmt(m.valor_total)}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_BADGE[m.status] ?? "bg-neutral-100"}`}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
