"use client";

import { useActionState, useMemo, useState } from "react";
import { criarEntrega, type EntregaState } from "@/app/(app)/entregas/actions";
import { somarDias, hojeBrasilia } from "@/lib/financeiro/datas";

interface Revendedora {
  id: string;
  nome_completo: string;
}

interface Mostruario {
  id: string;
  codigo: string;
  nome: string;
  quantidade_pecas: number;
  valor_total: number;
}

export function EntregaForm({
  revendedoras,
  mostruarios,
  prazoPadraoDias,
}: {
  revendedoras: Revendedora[];
  mostruarios: Mostruario[];
  prazoPadraoDias: number;
}) {
  const [state, formAction, pending] = useActionState<EntregaState | undefined, FormData>(
    criarEntrega,
    undefined
  );

  const hoje = useMemo(() => hojeBrasilia(), []);
  const [dataEntrega, setDataEntrega] = useState(hoje);
  const [mostruarioId, setMostruarioId] = useState("");
  const [prazoDias, setPrazoDias] = useState(prazoPadraoDias);

  const mostruarioSelecionado = mostruarios.find((m) => m.id === mostruarioId);
  const dataConferenciaPrevista = somarDias(dataEntrega, prazoDias);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="revendedora_id" className="text-sm font-medium text-neutral-700">
          Revendedora
        </label>
        <select
          id="revendedora_id"
          name="revendedora_id"
          required
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Selecione...</option>
          {revendedoras.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome_completo}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="mostruario_id" className="text-sm font-medium text-neutral-700">
          Mostruário
        </label>
        <select
          id="mostruario_id"
          name="mostruario_id"
          required
          value={mostruarioId}
          onChange={(e) => setMostruarioId(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">Selecione...</option>
          {mostruarios.map((m) => (
            <option key={m.id} value={m.id}>
              {m.codigo} — {m.nome}
            </option>
          ))}
        </select>
      </div>

      <input
        type="hidden"
        name="quantidade_pecas_entrega"
        value={mostruarioSelecionado?.quantidade_pecas ?? ""}
      />
      <input type="hidden" name="valor_total_entrega" value={mostruarioSelecionado?.valor_total ?? ""} />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="data_entrega" className="text-sm font-medium text-neutral-700">
            Data da entrega
          </label>
          <input
            id="data_entrega"
            name="data_entrega"
            type="date"
            required
            value={dataEntrega}
            onChange={(e) => setDataEntrega(e.target.value)}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="prazo_dias_aplicado" className="text-sm font-medium text-neutral-700">
            Prazo (dias)
          </label>
          <input
            id="prazo_dias_aplicado"
            name="prazo_dias_aplicado"
            type="number"
            required
            value={prazoDias}
            onChange={(e) => setPrazoDias(Number(e.target.value))}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="data_conferencia_prevista" className="text-sm font-medium text-neutral-700">
          Data prevista da conferência
        </label>
        <input
          id="data_conferencia_prevista"
          name="data_conferencia_prevista"
          type="date"
          required
          defaultValue={dataConferenciaPrevista}
          key={dataConferenciaPrevista}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <p className="text-xs text-neutral-500">
          Calculada automaticamente ({dataConferenciaPrevista.split("-").reverse().join("/")}), mas você pode
          ajustar.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="responsavel" className="text-sm font-medium text-neutral-700">
          Responsável pela entrega
        </label>
        <input
          id="responsavel"
          name="responsavel"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="observacoes" className="text-sm font-medium text-neutral-700">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={2}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="excecao_autorizada" />
        Autorizar mesmo com pendência da revendedora
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || !mostruarioId}
        className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Registrando..." : "Registrar entrega"}
      </button>
    </form>
  );
}
