"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { alterarStatusEmMassa } from "@/app/(app)/revendedoras/actions";

interface Revendedora {
  id: string;
  nome_completo: string;
  whatsapp: string | null;
  cidade: string | null;
}

export function RevendedorasTable({
  revendedoras,
  filtro,
}: {
  revendedoras: Revendedora[];
  filtro: "Ativa" | "Inativa";
}) {
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  function alternarSelecao(id: string) {
    setSelecionadas((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  function alternarTodas() {
    setSelecionadas((atual) =>
      atual.size === revendedoras.length ? new Set() : new Set(revendedoras.map((r) => r.id))
    );
  }

  function aplicarEmMassa(novoStatus: "Ativa" | "Inativa") {
    startTransition(async () => {
      await alterarStatusEmMassa(Array.from(selecionadas), novoStatus);
      setSelecionadas(new Set());
    });
  }

  const todasSelecionadas = revendedoras.length > 0 && selecionadas.size === revendedoras.length;

  return (
    <div>
      {selecionadas.size > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm">
          <span>{selecionadas.size} selecionada(s)</span>
          <button
            type="button"
            disabled={pending}
            onClick={() => aplicarEmMassa(filtro === "Ativa" ? "Inativa" : "Ativa")}
            className="rounded-md bg-neutral-900 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            {filtro === "Ativa" ? "Inativar selecionadas" : "Ativar selecionadas"}
          </button>
        </div>
      )}

      {/* Mobile: cards */}
      <div className="flex flex-col gap-2 sm:hidden">
        {revendedoras.map((r) => (
          <div key={r.id} className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white p-3 text-sm">
            <input
              type="checkbox"
              checked={selecionadas.has(r.id)}
              onChange={() => alternarSelecao(r.id)}
              className="h-4 w-4"
            />
            <Link href={`/revendedoras/${r.id}`} className="flex-1">
              <span className="font-medium text-neutral-900">{r.nome_completo}</span>
              <p className="text-neutral-500">
                {r.whatsapp ?? "—"} {r.cidade && `· ${r.cidade}`}
              </p>
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
                <input type="checkbox" checked={todasSelecionadas} onChange={alternarTodas} className="h-4 w-4" />
              </th>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">WhatsApp</th>
              <th className="px-4 py-2">Cidade</th>
            </tr>
          </thead>
          <tbody>
            {revendedoras.map((r) => (
              <tr key={r.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selecionadas.has(r.id)}
                    onChange={() => alternarSelecao(r.id)}
                    className="h-4 w-4"
                  />
                </td>
                <td className="px-4 py-2">
                  <Link href={`/revendedoras/${r.id}`} className="text-neutral-900 hover:underline">
                    {r.nome_completo}
                  </Link>
                </td>
                <td className="px-4 py-2 text-neutral-600">{r.whatsapp ?? "—"}</td>
                <td className="px-4 py-2 text-neutral-600">{r.cidade ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
