import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { CardResumo } from "@/components/dashboard/CardResumo";
import { FaturamentoChart } from "@/components/dashboard/FaturamentoChart";
import { classificarStatusConferencia, formatarDataBR } from "@/lib/financeiro/datas";

const STATUS_COLOR: Record<string, string> = {
  "Em dia": "bg-green-50 text-green-700",
  "Próximo do vencimento": "bg-yellow-50 text-yellow-700",
  "Vencido": "bg-red-50 text-red-700",
};

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: revendedorasAtivas },
    { count: mostruariosEmCirculacao },
    { data: entregasAbertas },
    { data: conferenciasAtivas },
    { data: pendencias },
    { data: repasses },
    { data: revendedorasTodas },
  ] = await Promise.all([
    supabase.from("revendedoras").select("id", { count: "exact", head: true }).eq("status", "Ativa"),
    supabase.from("mostruarios").select("id", { count: "exact", head: true }).eq("status", "Com revendedora"),
    supabase
      .from("entregas")
      .select(
        "id, data_entrega, data_conferencia_prevista, revendedoras(nome_completo), mostruarios(codigo, nome)"
      )
      .eq("status", "Aberta")
      .order("data_conferencia_prevista"),
    supabase
      .from("conferencias")
      .select("valor_vendido, valor_comissao_revendedora, valor_proprietaria, valor_socia")
      .eq("status", "Ativa"),
    supabase.from("v_conferencias_saldo").select("valor_pendente").eq("mais_recente", true),
    supabase.from("repasses").select("valor").eq("status", "Ativo"),
    supabase.from("revendedoras").select("id, nome_completo").order("nome_completo"),
  ]);

  const proximasConferencias = (entregasAbertas ?? []).map((e) => ({
    ...e,
    statusConf: classificarStatusConferencia(e.data_conferencia_prevista),
  }));

  const conferenciasVencendo7Dias = proximasConferencias.filter(
    (e) => e.statusConf === "Próximo do vencimento"
  ).length;
  const conferenciasAtrasadas = proximasConferencias.filter((e) => e.statusConf === "Vencido").length;

  const valorVendido = (conferenciasAtivas ?? []).reduce((s, c) => s + c.valor_vendido, 0);
  const totalComissoes = (conferenciasAtivas ?? []).reduce((s, c) => s + c.valor_comissao_revendedora, 0);
  const valorProprietaria = (conferenciasAtivas ?? []).reduce((s, c) => s + c.valor_proprietaria, 0);
  const totalSocia = (conferenciasAtivas ?? []).reduce((s, c) => s + c.valor_socia, 0);
  const totalRepasses = (repasses ?? []).reduce((s, r) => s + r.valor, 0);
  const valorSociaPendente = Math.max(0, totalSocia - totalRepasses);
  const valorAReceber = (pendencias ?? []).reduce((s, p) => s + Math.max(0, p.valor_pendente ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <CardResumo label="Revendedoras ativas" valor={revendedorasAtivas ?? 0} />
        <CardResumo label="Mostruários em circulação" valor={mostruariosEmCirculacao ?? 0} />
        <CardResumo label="Conferências vencendo em 7 dias" valor={conferenciasVencendo7Dias} />
        <CardResumo label="Conferências atrasadas" valor={conferenciasAtrasadas} />
        <CardResumo label="Valor vendido" valor={fmt(valorVendido)} />
        <CardResumo label="Valor a receber" valor={fmt(valorAReceber)} />
        <CardResumo label="Valor da proprietária" valor={fmt(valorProprietaria)} />
        <CardResumo label="Valor da sócia (pendente de repasse)" valor={fmt(valorSociaPendente)} />
        <CardResumo label="Total de comissões" valor={fmt(totalComissoes)} />
      </div>

      <FaturamentoChart revendedoras={revendedorasTodas ?? []} />

      <div>
        <h2 className="mb-3 text-sm font-semibold text-neutral-900">Próximas conferências</h2>
        {proximasConferencias.length === 0 ? (
          <p className="text-sm text-neutral-500">Nenhuma entrega em aberto no momento.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-4 py-2">Revendedora</th>
                  <th className="px-4 py-2">Mostruário</th>
                  <th className="px-4 py-2">Entrega</th>
                  <th className="px-4 py-2">Prevista</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {proximasConferencias.map((e) => (
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
                    <td className="px-4 py-2 text-neutral-600">{formatarDataBR(e.data_conferencia_prevista)}</td>
                    <td className="px-4 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLOR[e.statusConf]}`}>
                        {e.statusConf}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
