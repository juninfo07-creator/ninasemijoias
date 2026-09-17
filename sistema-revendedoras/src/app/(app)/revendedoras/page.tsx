import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function RevendedorasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filtro = status === "Inativa" ? "Inativa" : "Ativa";

  const supabase = await createClient();
  const { data: revendedoras } = await supabase
    .from("revendedoras")
    .select("id, nome_completo, whatsapp, cidade, status")
    .eq("status", filtro)
    .order("nome_completo");

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

      <div className="mb-4 flex gap-2 text-sm">
        <Link
          href="/revendedoras?status=Ativa"
          className={`rounded-full px-3 py-1 ${filtro === "Ativa" ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-700"}`}
        >
          Ativas
        </Link>
        <Link
          href="/revendedoras?status=Inativa"
          className={`rounded-full px-3 py-1 ${filtro === "Inativa" ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-700"}`}
        >
          Inativas
        </Link>
      </div>

      {!revendedoras || revendedoras.length === 0 ? (
        <p className="text-sm text-neutral-500">Nenhuma revendedora {filtro === "Ativa" ? "ativa" : "inativa"}.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">WhatsApp</th>
                <th className="px-4 py-2">Cidade</th>
              </tr>
            </thead>
            <tbody>
              {revendedoras.map((r) => (
                <tr key={r.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-2">
                    <Link href={`/revendedoras/${r.id}`} className="text-neutral-900 hover:underline">
                      {r.nome_completo}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-neutral-600">{r.whatsapp ?? "—"}</td>
                  <td className="px-4 py-2 text-neutral-600">{r.cidade ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
