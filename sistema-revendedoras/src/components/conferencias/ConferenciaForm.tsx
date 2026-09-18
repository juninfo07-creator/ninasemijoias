"use client";

import { useActionState, useMemo, useState } from "react";
import { registrarConferencia, type ConferenciaState } from "@/app/(app)/conferencias/actions";
import { calcularConferencia, type FaixaComissao } from "@/lib/financeiro/calculo";
import { hojeBrasilia } from "@/lib/financeiro/datas";
import { CampoMoeda } from "@/components/ui/CampoMoeda";

interface Entrega {
  id: string;
}

export function ConferenciaForm({
  entrega,
  faixas,
}: {
  entrega: Entrega;
  faixas: FaixaComissao;
}) {
  const [state, formAction, pending] = useActionState<ConferenciaState | undefined, FormData>(
    registrarConferencia,
    undefined
  );

  const hoje = useMemo(() => hojeBrasilia(), []);
  const [dataRealizada, setDataRealizada] = useState(hoje);
  const [valorVendido, setValorVendido] = useState(0);
  const [descontos, setDescontos] = useState(0);
  const [acrescimos, setAcrescimos] = useState(0);
  const [valorDevolvido, setValorDevolvido] = useState(0);

  const resultado = calcularConferencia(valorVendido, descontos, acrescimos, faixas);

  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <input type="hidden" name="entrega_id" value={entrega.id} />

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

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="valor_vendido" className="text-sm font-medium text-neutral-700">
            Valor vendido
          </label>
          <CampoMoeda id="valor_vendido" name="valor_vendido" defaultValue={0} onValueChange={setValorVendido} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="descontos" className="text-sm font-medium text-neutral-700">
            Descontos
          </label>
          <CampoMoeda id="descontos" name="descontos" defaultValue={0} onValueChange={setDescontos} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="acrescimos" className="text-sm font-medium text-neutral-700">
            Acréscimos
          </label>
          <CampoMoeda id="acrescimos" name="acrescimos" defaultValue={0} onValueChange={setAcrescimos} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="valor_devolvido" className="text-sm font-medium text-neutral-700">
          Valor devolvido, sem vender
        </label>
        <CampoMoeda id="valor_devolvido" name="valor_devolvido" defaultValue={0} onValueChange={setValorDevolvido} />
        <p className="text-xs text-neutral-500">Só pra registro — não entra no cálculo da comissão.</p>
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
          <span className="text-neutral-500">Faixa de comissão aplicada</span>
          <span className="text-right">{resultado.percentualRevendedoraAplicado}%</span>
          <span className="text-neutral-500">Comissão da revendedora</span>
          <span className="text-right">{fmt(resultado.valorComissaoRevendedora)}</span>
          <span className="text-neutral-500">A pagar à empresa</span>
          <span className="text-right font-medium">{fmt(resultado.valorEmpresa)}</span>
          <span className="text-neutral-500">Parte da proprietária</span>
          <span className="text-right">{fmt(resultado.valorProprietaria)}</span>
          <span className="text-neutral-500">Parte da sócia</span>
          <span className="text-right">{fmt(resultado.valorSocia)}</span>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Vendas abaixo de {fmt(faixas.limiteFaixaComissao)} pagam {faixas.percentualRevendedoraAbaixo}% de
          comissão; a partir disso, {faixas.percentualRevendedoraAcima}%.
        </p>
        <p className="mt-2 text-xs text-neutral-500">
          Registrar essa conferência encerra a entrega e libera o mostruário para "Disponível".
        </p>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Registrando..." : "Registrar conferência"}
      </button>
    </form>
  );
}
