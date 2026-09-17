import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { formatarDataBR, classificarStatusConferencia } from "@/lib/financeiro/datas";

export default async function EntregaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: entrega } = await supabase
    .from("entregas")
    .select("*, revendedoras(id, nome_completo), mostruarios(id, codigo, nome)")
    .eq("id", id)
    .single();

  if (!entrega) {
    notFound();
  }

  const { data: conferencias } = await supabase
    .from("conferencias")
    .select("*")
    .eq("entrega_id", id)
    .eq("status", "Ativa")
    .order("data_realizada", { ascending: false });

  const statusConf = classificarStatusConferencia(entrega.data_conferencia_prevista);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">{entrega.revendedoras?.nome_completo}</h1>
          <p className="text-sm text-neutral-500">
            {entrega.mostruarios?.codigo} — {entrega.mostruarios?.nome}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            entrega.status === "Encerrada"
              ? "bg-neutral-100 text-neutral-600"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {entrega.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-md border border-neutral-200 p-4 text-sm">
        <div>
          <span className="text-neutral-500">Data da entrega</span>
          <p>{formatarDataBR(entrega.data_entrega)}</p>
        </div>
        <div>
          <span className="text-neutral-500">Próxima conferência</span>
          <p>
            {formatarDataBR(entrega.data_conferencia_prevista)}{" "}
            {entrega.status === "Aberta" && (
              <span className="ml-1 text-xs text-neutral-500">({statusConf})</span>
            )}
          </p>
        </div>
        <div>
          <span className="text-neutral-500">Peças atualmente com a revendedora</span>
          <p>{entrega.quantidade_pecas_atual}</p>
        </div>
        <div>
          <span className="text-neutral-500">Valor atual</span>
          <p>{entrega.valor_atual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
        </div>
      </div>

      {entrega.status === "Aberta" && (
        <Link
          href={`/conferencias/nova?entregaId=${entrega.id}`}
          className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Registrar conferência
        </Link>
      )}

      <div>
        <h2 className="mb-2 text-sm font-semibold text-neutral-900">Histórico de conferências</h2>
        {!conferencias || conferencias.length === 0 ? (
          <p className="text-sm text-neutral-500">Nenhuma conferência registrada ainda.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {conferencias.map((c) => (
              <div key={c.id} className="rounded-md border border-neutral-200 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {c.tipo} — {formatarDataBR(c.data_realizada)}
                  </span>
                  <span className="text-neutral-500">
                    Vendido: {c.valor_vendido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <p className="mt-1 text-neutral-600">
                  A pagar à empresa:{" "}
                  {c.valor_empresa.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} · Comissão
                  revendedora:{" "}
                  {c.valor_comissao_revendedora.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
