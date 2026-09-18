"use client";

import { useActionState } from "react";
import type { Database } from "@/lib/types/database.types";

type Revendedora = Database["public"]["Tables"]["revendedoras"]["Row"];

interface FormState {
  error?: string;
  success?: boolean;
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
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
        required={required}
        defaultValue={defaultValue ?? ""}
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
      />
    </div>
  );
}

export function RevendedoraForm({
  revendedora,
  action,
  submitLabel,
}: {
  revendedora?: Revendedora;
  action: (prevState: FormState | undefined, formData: FormData) => Promise<FormState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <Field label="Nome completo" name="nome_completo" defaultValue={revendedora?.nome_completo} required />
      <div className="grid grid-cols-2 gap-4">
        <Field label="CPF" name="cpf" defaultValue={revendedora?.cpf} />
        <Field label="Telefone" name="telefone" defaultValue={revendedora?.telefone} />
        <Field label="WhatsApp" name="whatsapp" defaultValue={revendedora?.whatsapp} />
        <Field label="E-mail" name="email" type="email" defaultValue={revendedora?.email} />
      </div>
      <Field label="Endereço" name="endereco" defaultValue={revendedora?.endereco} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Cidade" name="cidade" defaultValue={revendedora?.cidade} />
        <Field label="Bairro" name="bairro" defaultValue={revendedora?.bairro} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="observacoes" className="text-sm font-medium text-neutral-700">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          defaultValue={revendedora?.observacoes ?? ""}
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
