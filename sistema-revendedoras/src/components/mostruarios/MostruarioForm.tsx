"use client";

import { useActionState } from "react";
import type { Database } from "@/lib/types/database.types";
import { CampoMoeda } from "@/components/ui/CampoMoeda";

type Mostruario = Database["public"]["Tables"]["mostruarios"]["Row"];

interface FormState {
  error?: string;
  success?: boolean;
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  step?: string;
  required?: boolean;
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
        required={required}
        defaultValue={defaultValue ?? ""}
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
      />
    </div>
  );
}

export function MostruarioForm({
  mostruario,
  action,
  submitLabel,
}: {
  mostruario?: Mostruario;
  action: (prevState: FormState | undefined, formData: FormData) => Promise<FormState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {mostruario && (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-neutral-700">Código</span>
          <span className="text-sm text-neutral-500">{mostruario.codigo}</span>
        </div>
      )}
      <Field label="Nome/identificação" name="nome" defaultValue={mostruario?.nome} required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Tamanho" name="tamanho" defaultValue={mostruario?.tamanho} />
        <div className="flex flex-col gap-1">
          <label htmlFor="valor_total" className="text-sm font-medium text-neutral-700">
            Valor total
          </label>
          <CampoMoeda id="valor_total" name="valor_total" defaultValue={mostruario?.valor_total} required />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="observacoes" className="text-sm font-medium text-neutral-700">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          defaultValue={mostruario?.observacoes ?? ""}
          rows={3}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">Salvo com sucesso.</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}
