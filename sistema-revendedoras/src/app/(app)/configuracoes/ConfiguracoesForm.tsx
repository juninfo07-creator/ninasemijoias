"use client";

import { useActionState } from "react";
import { atualizarConfiguracoes, type ConfiguracoesState } from "./actions";
import type { Database } from "@/lib/types/database.types";

type Configuracoes = Database["public"]["Tables"]["configuracoes"]["Row"];

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
}: {
  label: string;
  name: string;
  defaultValue: string | number | null;
  type?: string;
  step?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue ?? ""}
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
      />
    </div>
  );
}

export function ConfiguracoesForm({ configuracoes }: { configuracoes: Configuracoes }) {
  const initialState: ConfiguracoesState = {};
  const [state, formAction, pending] = useActionState(atualizarConfiguracoes, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-neutral-900">Percentuais</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Revendedora (%)"
            name="percentual_revendedora"
            type="number"
            step="0.01"
            defaultValue={configuracoes.percentual_revendedora}
          />
          <Field
            label="Empresa (%)"
            name="percentual_empresa"
            type="number"
            step="0.01"
            defaultValue={configuracoes.percentual_empresa}
          />
          <Field
            label="Proprietária, dentro da empresa (%)"
            name="percentual_proprietaria"
            type="number"
            step="0.01"
            defaultValue={configuracoes.percentual_proprietaria}
          />
          <Field
            label="Sócia, dentro da empresa (%)"
            name="percentual_socia"
            type="number"
            step="0.01"
            defaultValue={configuracoes.percentual_socia}
          />
        </div>
        <p className="text-xs text-neutral-500">
          Revendedora + Empresa deve somar 100%. Proprietária + Sócia (dentro da fatia da
          empresa) também deve somar 100%.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-neutral-900">Prazo</h2>
        <Field
          label="Prazo padrão do mostruário (dias)"
          name="prazo_padrao_dias"
          type="number"
          defaultValue={configuracoes.prazo_padrao_dias}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-neutral-900">Dados da empresa</h2>
        <Field label="Nome" name="nome_empresa" defaultValue={configuracoes.nome_empresa} />
        <Field label="CNPJ" name="cnpj_empresa" defaultValue={configuracoes.cnpj_empresa} />
        <Field
          label="Telefone"
          name="telefone_empresa"
          defaultValue={configuracoes.telefone_empresa}
        />
        <Field
          label="Endereço"
          name="endereco_empresa"
          defaultValue={configuracoes.endereco_empresa}
        />
      </section>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">Salvo com sucesso.</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
