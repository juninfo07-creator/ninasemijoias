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

  const toggleStatus = alternarStatusRevendedora.bind(null, id, revendedora.status);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
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

      <RevendedoraForm
        revendedora={revendedora}
        action={atualizarRevendedora.bind(null, id)}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
