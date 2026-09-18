"use client";

import { useEffect, useState, useTransition } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { buscarFaturamento, type PontoFaturamento } from "@/app/(app)/dashboard/actions";
import { hojeBrasilia } from "@/lib/financeiro/datas";

interface Revendedora {
  id: string;
  nome_completo: string;
}

const PRESETS = [
  { label: "3 meses", meses: 3 },
  { label: "6 meses", meses: 6 },
  { label: "12 meses", meses: 12 },
] as const;

function inicioHaMeses(meses: number): string {
  const [ano, mes] = hojeBrasilia().split("-").map(Number);
  const data = new Date(Date.UTC(ano, mes - 1 - (meses - 1), 1));
  return data.toISOString().slice(0, 10);
}

function formatarMes(mes: string) {
  const [ano, m] = mes.split("-");
  const nomes = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${nomes[Number(m) - 1]}/${ano.slice(2)}`;
}

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function FaturamentoChart({ revendedoras }: { revendedoras: Revendedora[] }) {
  const [presetMeses, setPresetMeses] = useState<number | "personalizado">(6);
  const [inicioCustom, setInicioCustom] = useState(inicioHaMeses(6));
  const [fimCustom, setFimCustom] = useState(hojeBrasilia());
  const [revendedoraId, setRevendedoraId] = useState("");
  const [dados, setDados] = useState<PontoFaturamento[]>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const inicio = presetMeses === "personalizado" ? inicioCustom : inicioHaMeses(presetMeses);
    const fim = presetMeses === "personalizado" ? fimCustom : hojeBrasilia();

    startTransition(async () => {
      const resultado = await buscarFaturamento({
        inicio,
        fim,
        revendedoraId: revendedoraId || undefined,
      });
      setDados(resultado);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetMeses, inicioCustom, fimCustom, revendedoraId]);

  const total = dados.reduce((s, d) => s + d.valor, 0);

  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Faturamento</h2>
          <p className="text-xs text-neutral-500">Total no período: {fmt(total)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.meses}
              type="button"
              onClick={() => setPresetMeses(p.meses)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                presetMeses === p.meses ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPresetMeses("personalizado")}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              presetMeses === "personalizado" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"
            }`}
          >
            Personalizado
          </button>
          <select
            value={revendedoraId}
            onChange={(e) => setRevendedoraId(e.target.value)}
            className="rounded-md border border-neutral-300 px-2 py-1 text-xs"
          >
            <option value="">Todas as revendedoras</option>
            {revendedoras.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome_completo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {presetMeses === "personalizado" && (
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

      <div style={{ width: "100%", height: 260, opacity: pending ? 0.5 : 1 }}>
        {dados.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-neutral-500">
            Nenhuma venda no período selecionado.
          </p>
        ) : (
          <ResponsiveContainer>
            <BarChart data={dados} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e0d9" vertical={false} />
              <XAxis
                dataKey="mes"
                tickFormatter={formatarMes}
                tick={{ fill: "#898781", fontSize: 12 }}
                axisLine={{ stroke: "#c3c2b7" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#898781", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `R$${Math.round(v / 1000)}k`}
                width={48}
              />
              <Tooltip
                formatter={(value) => fmt(Number(value))}
                labelFormatter={(mes) => formatarMes(String(mes))}
                contentStyle={{
                  background: "#fcfcfb",
                  border: "1px solid rgba(11,11,11,0.10)",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="valor" fill="#2a78d6" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
