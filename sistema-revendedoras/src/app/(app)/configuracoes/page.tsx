import { createClient } from "@/utils/supabase/server";
import { ConfiguracoesForm } from "./ConfiguracoesForm";

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
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Configurações</h1>
      <ConfiguracoesForm configuracoes={configuracoes} />
    </div>
  );
}
