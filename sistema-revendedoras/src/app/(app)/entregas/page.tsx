import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { classificarStatusConferencia, formatarDataBR } from "@/lib/financeiro/datas";

const STATUS_COLOR: Record<string, string> = {
  "Em dia": "bg-green-50 text-green-700",
  "Próximo do vencimento": "bg-yellow-50 text-yellow-700",
  "Vencido": "bg-red-50 text-red-700",
};

export default async function EntregasPage() {
  const supabase = await createClient();
  const { data: entregas } = await supabase
    .from("entregas")
    .select(
      "id, data_entrega, data_conferencia_prevista, status, revendedoras(nome_completo), mostruarios(codigo, nome)"
    )
    .eq("status", "Aberta")
    .order("data_conferencia_prevista");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Entregas em aberto</h1>
        <Link
          href="/entregas/nova"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Nova entrega
        </Link>
      </div>

      {!entregas || entregas.length === 0 ? (
        <p className="text-sm text-neutral-500">Nenhuma entrega em aberto.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-2">Revendedora</th>
                <th className="px-4 py-2">Mostruário</th>
                <th className="px-4 py-2">Entrega</th>
                <th className="px-4 py-2">Conferência prevista</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {entregas.map((e) => {
                const statusConf = classificarStatusConferencia(e.data_conferencia_prevista);
                return (
                  <tr key={e.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                    <td className="px-4 py-2">
                      <Link href={`/entregas/${e.id}`} className="text-neutral-900 hover:underline">
                        {e.revendedoras?.nome_completo}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-neutral-600">
                      {e.mostruarios?.codigo} — {e.mostruarios?.nome}
                    </td>
                    <td className="px-4 py-2 text-neutral-600">{formatarDataBR(e.data_entrega)}</td>
                    <td className="px-4 py-2 text-neutral-600">
                      {formatarDataBR(e.data_conferencia_prevista)}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLOR[statusConf]}`}>
                        {statusConf}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
