import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const STATUS_BADGE: Record<string, string> = {
  "Disponível": "bg-green-50 text-green-700",
  "Com revendedora": "bg-blue-50 text-blue-700",
  "Em conferência": "bg-yellow-50 text-yellow-700",
  "Finalizado": "bg-neutral-100 text-neutral-600",
  "Em manutenção/perda": "bg-red-50 text-red-700",
};

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
        <div className="overflow-x-auto rounded-md border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-2">Código</th>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Valor</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {mostruarios.map((m) => (
                <tr key={m.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-2">
                    <Link href={`/mostruarios/${m.id}`} className="text-neutral-900 hover:underline">
                      {m.codigo}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-neutral-600">{m.nome}</td>
                  <td className="px-4 py-2 text-neutral-600">
                    {m.valor_total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_BADGE[m.status] ?? "bg-neutral-100"}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
