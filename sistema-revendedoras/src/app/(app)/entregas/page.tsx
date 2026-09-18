import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { classificarStatusConferencia, formatarDataBR } from "@/lib/financeiro/datas";

const STATUS_COLOR: Record<string, string> = {
  "Em dia": "bg-green-50 text-green-700",
  "Próximo do vencimento": "bg-yellow-50 text-yellow-700",
  "Vencido": "bg-red-50 text-red-700",
};

export default async function EntregasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filtro = status === "Encerrada" ? "Encerrada" : "Aberta";

  const supabase = await createClient();
  const { data: entregas } = await supabase
    .from("entregas")
    .select(
      "id, data_entrega, data_conferencia_prevista, revendedoras(nome_completo), mostruarios(codigo, nome)"
    )
    .eq("status", filtro)
    .order(filtro === "Aberta" ? "data_conferencia_prevista" : "data_entrega", {
      ascending: filtro === "Aberta",
    });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Entregas</h1>
        <Link
          href="/entregas/nova"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Nova entrega
        </Link>
      </div>

      <div className="mb-4 flex gap-2 text-sm">
        <Link
          href="/entregas?status=Aberta"
          className={`rounded-full px-3 py-1 ${filtro === "Aberta" ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-700"}`}
        >
          Abertas
        </Link>
        <Link
          href="/entregas?status=Encerrada"
          className={`rounded-full px-3 py-1 ${filtro === "Encerrada" ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-700"}`}
        >
          Encerradas
        </Link>
      </div>

      {!entregas || entregas.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Nenhuma entrega {filtro === "Aberta" ? "em aberto" : "encerrada"}.
        </p>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="flex flex-col gap-2 sm:hidden">
            {entregas.map((e) => {
              const statusConf = filtro === "Aberta" ? classificarStatusConferencia(e.data_conferencia_prevista) : null;
              return (
                <Link
                  key={e.id}
                  href={`/entregas/${e.id}`}
                  className="block rounded-md border border-neutral-200 bg-white p-3 text-sm hover:bg-neutral-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-900">{e.revendedoras?.nome_completo}</span>
                    {statusConf && (
                      <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLOR[statusConf]}`}>
                        {statusConf}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-600">
                    {e.mostruarios?.codigo} — {e.mostruarios?.nome}
                  </p>
                  <p className="text-neutral-500">
                    Entrega {formatarDataBR(e.data_entrega)} · Confer. {formatarDataBR(e.data_conferencia_prevista)}
                  </p>
                  {filtro === "Aberta" && (
                    <span className="mt-1 inline-block text-xs font-medium text-neutral-900 underline">
                      Registrar conferência →
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop: tabela */}
          <div className="hidden overflow-x-auto rounded-md border border-neutral-200 sm:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-4 py-2">Revendedora</th>
                  <th className="px-4 py-2">Mostruário</th>
                  <th className="px-4 py-2">Entrega</th>
                  <th className="px-4 py-2">{filtro === "Aberta" ? "Conferência prevista" : "Conferência"}</th>
                  {filtro === "Aberta" && <th className="px-4 py-2">Status</th>}
                  {filtro === "Aberta" && <th className="px-4 py-2"></th>}
                </tr>
              </thead>
              <tbody>
                {entregas.map((e) => {
                  const statusConf = filtro === "Aberta" ? classificarStatusConferencia(e.data_conferencia_prevista) : null;
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
                      {filtro === "Aberta" && (
                        <td className="px-4 py-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLOR[statusConf!]}`}>
                            {statusConf}
                          </span>
                        </td>
                      )}
                      {filtro === "Aberta" && (
                        <td className="px-4 py-2">
                          <Link
                            href={`/conferencias/nova?entregaId=${e.id}`}
                            className="text-xs font-medium text-neutral-900 hover:underline"
                          >
                            Registrar conferência
                          </Link>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
