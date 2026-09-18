import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { RevendedoraForm } from "@/components/revendedoras/RevendedoraForm";
import { atualizarRevendedora, alternarStatusRevendedora } from "../actions";

export default async function RevendedoraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: revendedora } = await supabase.from("revendedoras").select("*").eq("id", id).single();

  if (!revendedora) {
    notFound();
  }

  const [{ data: entregas }, { data: configuracoes }] = await Promise.all([
    supabase.from("entregas").select("id").eq("revendedora_id", id),
    supabase.from("configuracoes").select("limite_faixa_comissao").eq("id", 1).single(),
  ]);

  const entregaIds = (entregas ?? []).map((e) => e.id);
  const { data: conferencias } = entregaIds.length
    ? await supabase
        .from("conferencias")
        .select("valor_vendido, valor_comissao_revendedora")
        .in("entrega_id", entregaIds)
        .eq("status", "Ativa")
    : { data: [] };

  const limite = configuracoes?.limite_faixa_comissao ?? 1000;
  const totalVendido = (conferencias ?? []).reduce((s, c) => s + c.valor_vendido, 0);
  const totalComissao = (conferencias ?? []).reduce((s, c) => s + c.valor_comissao_revendedora, 0);
  const vendasAbaixo = (conferencias ?? []).filter((c) => c.valor_vendido < limite).length;
  const vendasAcima = (conferencias ?? []).filter((c) => c.valor_vendido >= limite).length;

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const toggleStatus = alternarStatusRevendedora.bind(null, id, revendedora.status);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">{revendedora.nome_completo}</h1>
        <form action={toggleStatus}>
          <button
            type="submit"
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              revendedora.status === "Ativa"
                ? "bg-red-50 text-red-700 hover:bg-red-100"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {revendedora.status === "Ativa" ? "Marcar como Inativa" : "Marcar como Ativa"}
          </button>
        </form>
      </div>

      {(conferencias ?? []).length > 0 && (
        <div className="grid grid-cols-2 gap-4 rounded-md border border-neutral-200 p-4 text-sm sm:grid-cols-4">
          <div>
            <span className="text-neutral-500">Total vendido</span>
            <p className="font-medium">{fmt(totalVendido)}</p>
          </div>
          <div>
            <span className="text-neutral-500">Comissão total</span>
            <p className="font-medium">{fmt(totalComissao)}</p>
          </div>
          <div>
            <span className="text-neutral-500">Vendas abaixo de {fmt(limite)}</span>
            <p>{vendasAbaixo}</p>
          </div>
          <div>
            <span className="text-neutral-500">Vendas de {fmt(limite)}+</span>
            <p>{vendasAcima}</p>
          </div>
        </div>
      )}

      <RevendedoraForm
        revendedora={revendedora}
        action={atualizarRevendedora.bind(null, id)}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
