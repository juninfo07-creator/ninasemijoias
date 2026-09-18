import { createClient } from "@/utils/supabase/server";
import { EntregaForm } from "@/components/entregas/EntregaForm";
import { VoltarLink } from "@/components/layout/VoltarLink";

export default async function NovaEntregaPage() {
  const supabase = await createClient();

  const [{ data: revendedoras }, { data: mostruarios }, { data: configuracoes }] = await Promise.all([
    supabase.from("revendedoras").select("id, nome_completo").eq("status", "Ativa").order("nome_completo"),
    supabase
      .from("mostruarios")
      .select("id, codigo, nome, valor_total")
      .eq("status", "Disponível")
      .order("codigo"),
    supabase.from("configuracoes").select("prazo_padrao_dias").eq("id", 1).single(),
  ]);

  return (
    <div>
      <VoltarLink href="/entregas" label="Entregas" />
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Nova entrega</h1>
      {!mostruarios || mostruarios.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Nenhum mostruário disponível no momento. Cadastre um novo mostruário ou aguarde uma conferência
          final liberar um.
        </p>
      ) : (
        <EntregaForm
          revendedoras={revendedoras ?? []}
          mostruarios={mostruarios}
          prazoPadraoDias={configuracoes?.prazo_padrao_dias ?? 60}
        />
      )}
    </div>
  );
}
