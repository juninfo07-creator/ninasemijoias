import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { formatarDataBR } from "@/lib/financeiro/datas";

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

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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
    </div>
  );
}
