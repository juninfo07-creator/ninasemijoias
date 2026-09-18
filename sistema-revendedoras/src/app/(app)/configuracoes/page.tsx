import { createClient } from "@/utils/supabase/server";
import { ConfiguracoesForm } from "./ConfiguracoesForm";
import { ResetDangerZone } from "@/components/configuracoes/ResetDangerZone";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const { data: configuracoes, error } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !configuracoes) {
    return <p className="text-sm text-red-600">Erro ao carregar configurações.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-6 text-xl font-semibold text-neutral-900">Configurações</h1>
        <ConfiguracoesForm configuracoes={configuracoes} />
      </div>
      <ResetDangerZone />
    </div>
  );
}
