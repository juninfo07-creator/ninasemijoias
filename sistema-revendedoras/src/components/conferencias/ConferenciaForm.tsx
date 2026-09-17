"use client";

import { useActionState, useMemo, useState } from "react";
import { registrarConferencia, type ConferenciaState } from "@/app/(app)/conferencias/actions";
import { calcularConferencia, calcularSaldoPecas, calcularSaldoValor, type Percentuais } from "@/lib/financeiro/calculo";
import { hojeBrasilia, calcularProximaConferencia } from "@/lib/financeiro/datas";

interface Entrega {
  id: string;
  quantidade_pecas_atual: number;
  valor_atual: number;
  prazo_dias_aplicado: number;
}

export function ConferenciaForm({
  entrega,
  percentuais,
}: {
  entrega: Entrega;
  percentuais: Percentuais;
}) {
  const [state, formAction, pending] = useActionState<ConferenciaState | undefined, FormData>(
    registrarConferencia,
    undefined
  );

  const hoje = useMemo(() => hojeBrasilia(), []);
  const [tipo, setTipo] = useState<"Parcial" | "Final">("Parcial");
  const [dataRealizada, setDataRealizada] = useState(hoje);
  const [pecasVendidas, setPecasVendidas] = useState(0);
  const [pecasDevolvidas, setPecasDevolvidas] = useState(0);
  const [pecasRepostas, setPecasRepostas] = useState(0);
  const [valorVendido, setValorVendido] = useState(0);
  const [descontos, setDescontos] = useState(0);
  const [acrescimos, setAcrescimos] = useState(0);
  const [valorReposicao, setValorReposicao] = useState(0);

  const resultado = calcularConferencia(valorVendido, descontos, acrescimos, percentuais);

  const quantidadePecasApos =
    tipo === "Final"
      ? 0
      : calcularSaldoPecas(entrega.quantidade_pecas_atual, pecasVendidas, pecasDevolvidas, pecasRepostas);

  const valorAtualApos =
    tipo === "Final"
      ? 0
      : calcularSaldoValor(
          entrega.valor_atual,
          entrega.quantidade_pecas_atual,
          pecasVendidas,
          pecasDevolvidas,
          valorReposicao
        );

  const proximaData = tipo === "Parcial" ? calcularProximaConferencia(dataRealizada, entrega.prazo_dias_aplicado) : null;

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <input type="hidden" name="entrega_id" value={entrega.id} />

      <div className="flex gap-2">
        {(["Parcial", "Final"] as const).map((opcao) => (
          <label
            key={opcao}
            className={`flex-1 cursor-pointer rounded-md border px-3 py-2 text-center text-sm font-medium ${
              tipo === opcao ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-700"
            }`}
          >
            <input
              type="radio"
              name="tipo"
              value={opcao}
              checked={tipo === opcao}
              onChange={() => setTipo(opcao)}
              className="sr-only"
            />
            {opcao}
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="data_realizada" className="text-sm font-medium text-neutral-700">
          Data da conferência
        </label>
        <input
          id="data_realizada"
          name="data_realizada"
          type="date"
          required
          value={dataRealizada}
          onChange={(e) => setDataRealizada(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="pecas_vendidas" className="text-sm font-medium text-neutral-700">
            Peças vendidas
          </label>
          <input
            id="pecas_vendidas"
            name="pecas_vendidas"
            type="number"
            min={0}
            value={pecasVendidas}
            onChange={(e) => setPecasVendidas(Number(e.target.value))}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="pecas_devolvidas" className="text-sm font-medium text-neutral-700">
            Peças devolvidas
          </label>
          <input
            id="pecas_devolvidas"
            name="pecas_devolvidas"
            type="number"
            min={0}
            value={pecasDevolvidas}
            onChange={(e) => setPecasDevolvidas(Number(e.target.value))}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {tipo === "Parcial" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="pecas_repostas" className="text-sm font-medium text-neutral-700">
              Peças repostas
            </label>
            <input
              id="pecas_repostas"
              name="pecas_repostas"
              type="number"
              min={0}
              value={pecasRepostas}
              onChange={(e) => setPecasRepostas(Number(e.target.value))}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="valor_reposicao" className="text-sm font-medium text-neutral-700">
              Valor de catálogo repost. (R$)
            </label>
            <input
              id="valor_reposicao"
              name="valor_reposicao"
              type="number"
              step="0.01"
              min={0}
              value={valorReposicao}
              onChange={(e) => setValorReposicao(Number(e.target.value))}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="valor_vendido" className="text-sm font-medium text-neutral-700">
            Valor vendido (R$)
          </label>
          <input
            id="valor_vendido"
            name="valor_vendido"
            type="number"
            step="0.01"
            min={0}
            value={valorVendido}
            onChange={(e) => setValorVendido(Number(e.target.value))}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="descontos" className="text-sm font-medium text-neutral-700">
            Descontos (R$)
          </label>
          <input
            id="descontos"
            name="descontos"
            type="number"
            step="0.01"
            min={0}
            value={descontos}
            onChange={(e) => setDescontos(Number(e.target.value))}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="acrescimos" className="text-sm font-medium text-neutral-700">
            Acréscimos (R$)
          </label>
          <input
            id="acrescimos"
            name="acrescimos"
            type="number"
            step="0.01"
            min={0}
            value={acrescimos}
            onChange={(e) => setAcrescimos(Number(e.target.value))}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="observacoes" className="text-sm font-medium text-neutral-700">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={2}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm">
        <h3 className="mb-2 font-semibold text-neutral-900">Resumo do cálculo</h3>
        <div className="grid grid-cols-2 gap-y-1">
          <span className="text-neutral-500">Comissão da revendedora</span>
          <span className="text-right">{fmt(resultado.valorComissaoRevendedora)}</span>
          <span className="text-neutral-500">A pagar à empresa</span>
          <span className="text-right font-medium">{fmt(resultado.valorEmpresa)}</span>
          <span className="text-neutral-500">Parte da proprietária</span>
          <span className="text-right">{fmt(resultado.valorProprietaria)}</span>
          <span className="text-neutral-500">Parte da sócia</span>
          <span className="text-right">{fmt(resultado.valorSocia)}</span>
          <span className="text-neutral-500">Saldo de peças após</span>
          <span className="text-right">{tipo === "Final" ? "0 (encerra)" : quantidadePecasApos}</span>
          <span className="text-neutral-500">Saldo em valor após</span>
          <span className="text-right">{tipo === "Final" ? fmt(0) : fmt(valorAtualApos)}</span>
          {proximaData && (
            <>
              <span className="text-neutral-500">Próxima conferência</span>
              <span className="text-right">{proximaData.split("-").reverse().join("/")}</span>
            </>
          )}
        </div>
        {tipo === "Final" && (
          <p className="mt-2 text-xs text-neutral-500">
            Conferência Final encerra a entrega e libera o mostruário para "Disponível".
          </p>
        )}
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Registrando..." : `Registrar conferência ${tipo}`}
      </button>
    </form>
  );
}
