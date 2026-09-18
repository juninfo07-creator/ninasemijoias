import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { formatarDataBR } from "@/lib/financeiro/datas";

const STATUS_PAGAMENTO_COLOR: Record<string, string> = {
  Pendente: "bg-red-50 text-red-700",
  Parcial: "bg-yellow-50 text-yellow-700",
  Pago: "bg-green-50 text-green-700",
};

const FILTROS = ["Todas", "Pendente", "Parcial", "Pago"] as const;

export default async function ConferenciasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filtro = FILTROS.includes(status as (typeof FILTROS)[number]) ? (status as (typeof FILTROS)[number]) : "Todas";

  const supabase = await createClient();

  const [{ data: conferencias }, { data: saldos }] = await Promise.all([
    supabase
      .from("conferencias")
      .select(
        "id, data_realizada, valor_vendido, valor_empresa, entregas(revendedoras(nome_completo), mostruarios(codigo, nome))"
      )
      .eq("status", "Ativa")
      .order("data_realizada", { ascending: false })
      .limit(200),
    supabase.from("v_conferencias_saldo").select("conferencia_id, status_pagamento"),
  ]);

  const statusPorConferencia = new Map((saldos ?? []).map((s) => [s.conferencia_id, s.status_pagamento]));
  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const comStatus = (conferencias ?? []).map((c) => ({
    ...c,
    statusPagamento: statusPorConferencia.get(c.id) ?? "Pendente",
  }));
  const lista = filtro === "Todas" ? comStatus : comStatus.filter((c) => c.statusPagamento === filtro);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Conferências</h1>

      <div className="mb-4 flex gap-2 text-sm">
        {FILTROS.map((f) => (
          <Link
            key={f}
            href={f === "Todas" ? "/conferencias" : `/conferencias?status=${f}`}
            className={`rounded-full px-3 py-1 ${filtro === f ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-700"}`}
          >
            {f}
          </Link>
        ))}
      </div>

      {lista.length === 0 ? (
        <p className="text-sm text-neutral-500">Nenhuma conferência {filtro !== "Todas" ? `com pagamento ${filtro.toLowerCase()}` : "registrada ainda"}.</p>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="flex flex-col gap-2 sm:hidden">
            {lista.map((c) => (
              <Link
                key={c.id}
                href={`/conferencias/${c.id}`}
                className="block rounded-md border border-neutral-200 bg-white p-3 text-sm hover:bg-neutral-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-900">{c.entregas?.revendedoras?.nome_completo}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_PAGAMENTO_COLOR[c.statusPagamento]}`}>
                    {c.statusPagamento}
                  </span>
                </div>
                <p className="text-neutral-600">
                  {c.entregas?.mostruarios?.codigo} — {c.entregas?.mostruarios?.nome}
                </p>
                <p className="text-neutral-500">
                  {formatarDataBR(c.data_realizada)} · Vendido {fmt(c.valor_vendido)} · A pagar {fmt(c.valor_empresa)}
                </p>
              </Link>
            ))}
          </div>

          {/* Desktop: tabela */}
          <div className="hidden overflow-x-auto rounded-md border border-neutral-200 sm:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2">Revendedora</th>
                  <th className="px-4 py-2">Mostruário</th>
                  <th className="px-4 py-2">Vendido</th>
                  <th className="px-4 py-2">A pagar</th>
                  <th className="px-4 py-2">Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((c) => (
                  <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                    <td className="px-4 py-2 text-neutral-600">{formatarDataBR(c.data_realizada)}</td>
                    <td className="px-4 py-2">
                      <Link href={`/conferencias/${c.id}`} className="text-neutral-900 hover:underline">
                        {c.entregas?.revendedoras?.nome_completo}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-neutral-600">
                      {c.entregas?.mostruarios?.codigo} — {c.entregas?.mostruarios?.nome}
                    </td>
                    <td className="px-4 py-2 text-neutral-600">{fmt(c.valor_vendido)}</td>
                    <td className="px-4 py-2 text-neutral-600">{fmt(c.valor_empresa)}</td>
                    <td className="px-4 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_PAGAMENTO_COLOR[c.statusPagamento]}`}>
                        {c.statusPagamento}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
