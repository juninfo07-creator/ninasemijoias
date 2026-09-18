import { createClient } from "@/utils/supabase/server";
import { formatarDataBR } from "@/lib/financeiro/datas";
import { RepasseForm } from "@/components/repasses/RepasseForm";
import { cancelarRepasse } from "./actions";

export default async function RepassesPage() {
  const supabase = await createClient();

  const [{ data: conferencias }, { data: repasses }] = await Promise.all([
    supabase.from("conferencias").select("valor_socia").eq("status", "Ativa"),
    supabase.from("repasses").select("*").order("data", { ascending: false }),
  ]);

  const totalSocia = (conferencias ?? []).reduce((s, c) => s + c.valor_socia, 0);
  const totalRepassado = (repasses ?? [])
    .filter((r) => r.status === "Ativo")
    .reduce((s, r) => s + r.valor, 0);
  const saldoPendente = Math.max(0, totalSocia - totalRepassado);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-neutral-900">Repasses pra sócia</h1>

      <div className="grid grid-cols-3 gap-4 rounded-md border border-neutral-200 p-4 text-sm">
        <div>
          <span className="text-neutral-500">Total da parte da sócia</span>
          <p className="font-medium">{fmt(totalSocia)}</p>
        </div>
        <div>
          <span className="text-neutral-500">Já repassado</span>
          <p className="font-medium">{fmt(totalRepassado)}</p>
        </div>
        <div>
          <span className="text-neutral-500">Saldo pendente</span>
          <p className="font-medium text-neutral-900">{fmt(saldoPendente)}</p>
        </div>
      </div>

      <RepasseForm valorSugerido={saldoPendente} />

      <div>
        <h2 className="mb-2 text-sm font-semibold text-neutral-900">Histórico</h2>
        {!repasses || repasses.length === 0 ? (
          <p className="text-sm text-neutral-500">Nenhum repasse registrado ainda.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {repasses.map((r) => {
              const cancelar = cancelarRepasse.bind(null, r.id);
              return (
                <div
                  key={r.id}
                  className={`flex items-center justify-between rounded-md border border-neutral-200 p-3 text-sm ${
                    r.status === "Cancelado" ? "opacity-50" : ""
                  }`}
                >
                  <div>
                    <span className="font-medium">{fmt(r.valor)}</span>
                    <span className="ml-2 text-neutral-500">
                      {formatarDataBR(r.data)} · {r.forma_pagamento}
                      {r.status === "Cancelado" && " · Cancelado"}
                    </span>
                    {r.observacao && <p className="text-neutral-500">{r.observacao}</p>}
                  </div>
                  {r.status === "Ativo" && (
                    <form action={cancelar}>
                      <button type="submit" className="text-xs text-red-600 hover:underline">
                        Cancelar
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
