import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { formatarDataBR } from "@/lib/financeiro/datas";

const STATUS_PAGAMENTO_COLOR: Record<string, string> = {
  Pendente: "bg-red-50 text-red-700",
  Parcial: "bg-yellow-50 text-yellow-700",
  Pago: "bg-green-50 text-green-700",
};

export default async function ConferenciasPage() {
  const supabase = await createClient();

  const [{ data: conferencias }, { data: saldos }] = await Promise.all([
    supabase
      .from("conferencias")
      .select(
        "id, tipo, data_realizada, valor_vendido, valor_empresa, entregas(revendedoras(nome_completo), mostruarios(codigo, nome))"
      )
      .eq("status", "Ativa")
      .order("data_realizada", { ascending: false })
      .limit(100),
    supabase.from("v_conferencias_saldo").select("conferencia_id, status_pagamento"),
  ]);

  const statusPorConferencia = new Map((saldos ?? []).map((s) => [s.conferencia_id, s.status_pagamento]));
  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Conferências</h1>

      {!conferencias || conferencias.length === 0 ? (
        <p className="text-sm text-neutral-500">Nenhuma conferência registrada ainda.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Revendedora</th>
                <th className="px-4 py-2">Mostruário</th>
                <th className="px-4 py-2">Vendido</th>
                <th className="px-4 py-2">A pagar</th>
                <th className="px-4 py-2">Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {conferencias.map((c) => {
                const status = statusPorConferencia.get(c.id) ?? "Pendente";
                return (
                  <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                    <td className="px-4 py-2">
                      <Link href={`/conferencias/${c.id}`} className="text-neutral-900 hover:underline">
                        {c.tipo}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-neutral-600">{formatarDataBR(c.data_realizada)}</td>
                    <td className="px-4 py-2 text-neutral-600">{c.entregas?.revendedoras?.nome_completo}</td>
                    <td className="px-4 py-2 text-neutral-600">
                      {c.entregas?.mostruarios?.codigo} — {c.entregas?.mostruarios?.nome}
                    </td>
                    <td className="px-4 py-2 text-neutral-600">{fmt(c.valor_vendido)}</td>
                    <td className="px-4 py-2 text-neutral-600">{fmt(c.valor_empresa)}</td>
                    <td className="px-4 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_PAGAMENTO_COLOR[status]}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
