import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { RevendedorasTable } from "@/components/revendedoras/RevendedorasTable";

export default async function RevendedorasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const filtro = status === "Inativa" ? "Inativa" : "Ativa";
  const busca = q?.trim() ?? "";

  const supabase = await createClient();
  let query = supabase
    .from("revendedoras")
    .select("id, nome_completo, whatsapp, cidade, status")
    .eq("status", filtro)
    .order("nome_completo");

  if (busca) {
    query = query.ilike("nome_completo", `%${busca}%`);
  }

  const { data: revendedoras } = await query;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Revendedoras</h1>
        <Link
          href="/revendedoras/nova"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Nova revendedora
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 text-sm">
          <Link
            href={`/revendedoras?status=Ativa${busca ? `&q=${encodeURIComponent(busca)}` : ""}`}
            className={`rounded-full px-3 py-1 ${filtro === "Ativa" ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-700"}`}
          >
            Ativas
          </Link>
          <Link
            href={`/revendedoras?status=Inativa${busca ? `&q=${encodeURIComponent(busca)}` : ""}`}
            className={`rounded-full px-3 py-1 ${filtro === "Inativa" ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-700"}`}
          >
            Inativas
          </Link>
        </div>
        <form className="flex items-center gap-2">
          <input type="hidden" name="status" value={filtro} />
          <input
            type="search"
            name="q"
            defaultValue={busca}
            placeholder="Buscar por nome..."
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          />
        </form>
      </div>

      {!revendedoras || revendedoras.length === 0 ? (
        <p className="text-sm text-neutral-500">
          {busca
            ? `Nenhuma revendedora ${filtro === "Ativa" ? "ativa" : "inativa"} encontrada pra "${busca}".`
            : `Nenhuma revendedora ${filtro === "Ativa" ? "ativa" : "inativa"}.`}
        </p>
      ) : (
        <RevendedorasTable revendedoras={revendedoras} filtro={filtro} />
      )}
    </div>
  );
}
