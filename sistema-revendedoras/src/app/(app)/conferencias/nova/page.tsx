import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ConferenciaForm } from "@/components/conferencias/ConferenciaForm";

export default async function NovaConferenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ entregaId?: string }>;
}) {
  const { entregaId } = await searchParams;

  if (!entregaId) {
    notFound();
  }

  const supabase = await createClient();

  const [{ data: entrega }, { data: configuracoes }] = await Promise.all([
    supabase
      .from("entregas")
      .select("id, quantidade_pecas_atual, valor_atual, prazo_dias_aplicado, status, revendedoras(nome_completo), mostruarios(codigo, nome)")
      .eq("id", entregaId)
      .single(),
    supabase.from("configuracoes").select("*").eq("id", 1).single(),
  ]);

  if (!entrega || !configuracoes) {
    notFound();
  }

  if (entrega.status === "Encerrada") {
    return <p className="text-sm text-red-600">Esta entrega já está encerrada.</p>;
  }

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-neutral-900">Registrar conferência</h1>
      <p className="mb-6 text-sm text-neutral-500">
        {entrega.revendedoras?.nome_completo} — {entrega.mostruarios?.codigo} {entrega.mostruarios?.nome}
      </p>
      <ConferenciaForm
        entrega={entrega}
        percentuais={{
          percentualRevendedora: configuracoes.percentual_revendedora,
          percentualEmpresa: configuracoes.percentual_empresa,
          percentualProprietaria: configuracoes.percentual_proprietaria,
          percentualSocia: configuracoes.percentual_socia,
        }}
      />
    </div>
  );
}
