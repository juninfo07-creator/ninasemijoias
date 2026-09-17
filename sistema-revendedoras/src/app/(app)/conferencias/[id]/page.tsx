import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { formatarDataBR } from "@/lib/financeiro/datas";
import { PagamentoForm } from "@/components/conferencias/PagamentoForm";
import { cancelarPagamento } from "../pagamentos-actions";

const STATUS_PAGAMENTO_COLOR: Record<string, string> = {
  Pendente: "bg-red-50 text-red-700",
  Parcial: "bg-yellow-50 text-yellow-700",
  Pago: "bg-green-50 text-green-700",
};

export default async function ConferenciaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: conferencia } = await supabase
    .from("conferencias")
    .select("*, entregas(id, revendedoras(nome_completo), mostruarios(codigo, nome))")
    .eq("id", id)
    .single();

  if (!conferencia) {
    notFound();
  }

  const { data: pagamentos } = await supabase
    .from("pagamentos")
    .select("*")
    .eq("conferencia_id", id)
    .order("data", { ascending: false });

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const valorPagoAtivo = (pagamentos ?? [])
    .filter((p) => p.status === "Ativo")
    .reduce((soma, p) => soma + p.valor_pago, 0);
  const valorPendente = Math.max(0, conferencia.valor_empresa - valorPagoAtivo);
  const statusPagamento = valorPagoAtivo <= 0 ? "Pendente" : valorPendente > 0 ? "Parcial" : "Pago";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/entregas/${conferencia.entrega_id}`} className="text-sm text-neutral-500 hover:underline">
          ← Voltar pra entrega
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-neutral-900">
          Conferência {conferencia.tipo} — {formatarDataBR(conferencia.data_realizada)}
        </h1>
        <p className="text-sm text-neutral-500">
          {conferencia.entregas?.revendedoras?.nome_completo} — {conferencia.entregas?.mostruarios?.codigo}{" "}
          {conferencia.entregas?.mostruarios?.nome}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-md border border-neutral-200 p-4 text-sm">
        <div>
          <span className="text-neutral-500">Valor vendido</span>
          <p>{fmt(conferencia.valor_vendido)}</p>
        </div>
        <div>
          <span className="text-neutral-500">Comissão da revendedora</span>
          <p>{fmt(conferencia.valor_comissao_revendedora)}</p>
        </div>
        <div>
          <span className="text-neutral-500">A pagar à empresa</span>
          <p className="font-medium">{fmt(conferencia.valor_empresa)}</p>
        </div>
        <div>
          <span className="text-neutral-500">Proprietária / Sócia</span>
          <p>
            {fmt(conferencia.valor_proprietaria)} / {fmt(conferencia.valor_socia)}
          </p>
        </div>
        {conferencia.proxima_conferencia_prevista && (
          <div>
            <span className="text-neutral-500">Próxima conferência</span>
            <p>{formatarDataBR(conferencia.proxima_conferencia_prevista)}</p>
          </div>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-neutral-900">Pagamento</h2>
          <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_PAGAMENTO_COLOR[statusPagamento]}`}>
            {statusPagamento}
          </span>
        </div>
        <p className="mb-3 text-sm text-neutral-500">
          Pago: {fmt(valorPagoAtivo)} de {fmt(conferencia.valor_empresa)}
          {valorPendente > 0 && ` · Falta ${fmt(valorPendente)}`}
        </p>

        {!pagamentos || pagamentos.length === 0 ? (
          <p className="mb-3 text-sm text-neutral-500">Nenhum pagamento registrado ainda.</p>
        ) : (
          <div className="mb-3 flex flex-col gap-2">
            {pagamentos.map((p) => {
              const cancelar = cancelarPagamento.bind(null, p.id, id);
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between rounded-md border border-neutral-200 p-3 text-sm ${
                    p.status === "Cancelado" ? "opacity-50" : ""
                  }`}
                >
                  <div>
                    <span className="font-medium">{fmt(p.valor_pago)}</span>
                    <span className="ml-2 text-neutral-500">
                      {formatarDataBR(p.data)} · {p.forma_pagamento}
                      {p.status === "Cancelado" && " · Cancelado"}
                    </span>
                    {p.observacao && <p className="text-neutral-500">{p.observacao}</p>}
                  </div>
                  {p.status === "Ativo" && (
                    <form action={cancelar}>
                      <button type="submit" className="text-xs text-red-600 hover:underline">
                        Cancelar
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {valorPendente > 0 && <PagamentoForm conferenciaId={id} valorSugerido={valorPendente} />}
      </div>
    </div>
  );
}
