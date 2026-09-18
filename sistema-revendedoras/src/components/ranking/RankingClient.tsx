"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { buscarRanking, type RevendedoraRanking } from "@/app/(app)/ranking/actions";
import { hojeBrasilia } from "@/lib/financeiro/datas";
import { PRESETS_RAPIDOS, calcularIntervalo, inicioHaMeses, type PresetPeriodo } from "@/lib/financeiro/periodo";

const MEDALHAS = ["🥇", "🥈", "🥉"];

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function RankingClient() {
  const [preset, setPreset] = useState<PresetPeriodo>(6);
  const [inicioCustom, setInicioCustom] = useState(inicioHaMeses(6));
  const [fimCustom, setFimCustom] = useState(hojeBrasilia());
  const [ranking, setRanking] = useState<RevendedoraRanking[]>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const { inicio, fim } = calcularIntervalo(preset, inicioCustom, fimCustom);
    startTransition(async () => {
      const resultado = await buscarRanking({ inicio, fim });
      setRanking(resultado);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, inicioCustom, fimCustom]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {PRESETS_RAPIDOS.map((p) => (
          <button
            key={p.valor}
            type="button"
            onClick={() => setPreset(p.valor)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              preset === p.valor ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPreset("personalizado")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            preset === "personalizado" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"
          }`}
        >
          Personalizado
        </button>
      </div>

      {preset === "personalizado" && (
        <div className="mb-4 flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1">
            De
            <input
              type="date"
              value={inicioCustom}
              onChange={(e) => setInicioCustom(e.target.value)}
              className="rounded-md border border-neutral-300 px-2 py-1"
            />
          </label>
          <label className="flex items-center gap-1">
            Até
            <input
              type="date"
              value={fimCustom}
              onChange={(e) => setFimCustom(e.target.value)}
              className="rounded-md border border-neutral-300 px-2 py-1"
            />
          </label>
        </div>
      )}

      <div className={`flex flex-col gap-2 ${pending ? "opacity-50" : ""}`}>
        {ranking.length === 0 ? (
          <p className="text-sm text-neutral-500">Nenhuma venda no período selecionado.</p>
        ) : (
          ranking.map((r, i) => (
            <Link
              key={r.revendedoraId}
              href={`/revendedoras/${r.revendedoraId}`}
              className="flex items-center justify-between rounded-md border border-neutral-200 bg-white p-3 text-sm hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 text-center text-lg">{MEDALHAS[i] ?? `${i + 1}º`}</span>
                <div>
                  <span className="font-medium text-neutral-900">{r.nome}</span>
                  <p className="text-neutral-500">{r.numeroVendas} conferência(s)</p>
                </div>
              </div>
              <span className="font-medium text-neutral-900">{fmt(r.totalVendido)}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
