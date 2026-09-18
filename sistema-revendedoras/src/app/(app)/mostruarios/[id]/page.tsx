import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { MostruarioForm } from "@/components/mostruarios/MostruarioForm";
import { VoltarLink } from "@/components/layout/VoltarLink";
import { atualizarMostruario, marcarManutencao } from "../actions";

export default async function MostruarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: mostruario } = await supabase.from("mostruarios").select("*").eq("id", id).single();

  if (!mostruario) {
    notFound();
  }

  const podeAlternarManutencao = mostruario.status === "Disponível" || mostruario.status === "Em manutenção/perda";
  const toggleManutencao = marcarManutencao.bind(null, id, mostruario.status);

  return (
    <div>
      <VoltarLink href="/mostruarios" label="Mostruários" />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">{mostruario.nome}</h1>
        {podeAlternarManutencao && (
          <form action={toggleManutencao}>
            <button
              type="submit"
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                mostruario.status === "Em manutenção/perda"
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              {mostruario.status === "Em manutenção/perda" ? "Marcar como Disponível" : "Marcar como manutenção/perda"}
            </button>
          </form>
        )}
      </div>

      <MostruarioForm
        mostruario={mostruario}
        action={atualizarMostruario.bind(null, id)}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
