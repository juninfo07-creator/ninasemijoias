"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export interface RevendedoraState {
  error?: string;
}

function fromFormData(formData: FormData) {
  const nomeCompleto = String(formData.get("nome_completo") ?? "").trim();
  return {
    nome_completo: nomeCompleto,
    cpf: String(formData.get("cpf") ?? "").trim() || null,
    telefone: String(formData.get("telefone") ?? "").trim() || null,
    whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    endereco: String(formData.get("endereco") ?? "").trim() || null,
    cidade: String(formData.get("cidade") ?? "").trim() || null,
    bairro: String(formData.get("bairro") ?? "").trim() || null,
    observacoes: String(formData.get("observacoes") ?? "").trim() || null,
  };
}

export async function criarRevendedora(
  _prevState: RevendedoraState | undefined,
  formData: FormData
): Promise<RevendedoraState> {
  const dados = fromFormData(formData);

  if (!dados.nome_completo) {
    return { error: "Nome é obrigatório." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("revendedoras").insert(dados).select("id").single();

  if (error) {
    return { error: error.message.includes("uq_revendedoras_cpf") ? "Já existe uma revendedora com esse CPF." : error.message };
  }

  revalidatePath("/revendedoras");
  redirect(`/revendedoras/${data.id}`);
}

export async function atualizarRevendedora(
  id: string,
  _prevState: RevendedoraState | undefined,
  formData: FormData
): Promise<RevendedoraState> {
  const dados = fromFormData(formData);

  if (!dados.nome_completo) {
    return { error: "Nome é obrigatório." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("revendedoras").update(dados).eq("id", id);

  if (error) {
    return { error: error.message.includes("uq_revendedoras_cpf") ? "Já existe uma revendedora com esse CPF." : error.message };
  }

  revalidatePath("/revendedoras");
  revalidatePath(`/revendedoras/${id}`);
  return {};
}

export async function alternarStatusRevendedora(id: string, statusAtual: string) {
  const novoStatus = statusAtual === "Ativa" ? "Inativa" : "Ativa";
  const supabase = await createClient();
  await supabase.from("revendedoras").update({ status: novoStatus }).eq("id", id);
  revalidatePath("/revendedoras");
  revalidatePath(`/revendedoras/${id}`);
}
