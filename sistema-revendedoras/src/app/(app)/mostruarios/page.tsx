import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { MostruariosTable } from "@/components/mostruarios/MostruariosTable";

export default async function MostruariosPage() {
  const supabase = await createClient();
  const { data: mostruarios } = await supabase
    .from("mostruarios")
    .select("id, codigo, nome, valor_total, status")
    .order("codigo");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Mostruários</h1>
        <Link
          href="/mostruarios/novo"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Novo mostruário
        </Link>
      </div>

      {!mostruarios || mostruarios.length === 0 ? (
        <p className="text-sm text-neutral-500">Nenhum mostruário cadastrado.</p>
      ) : (
        <MostruariosTable mostruarios={mostruarios} />
      )}
    </div>
  );
}
