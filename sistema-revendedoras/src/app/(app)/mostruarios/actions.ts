"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export interface MostruarioState {
  error?: string;
  success?: boolean;
}

function fromFormData(formData: FormData) {
  return {
    nome: String(formData.get("nome") ?? "").trim(),
    tamanho: String(formData.get("tamanho") ?? "").trim() || null,
    valor_total: Number(formData.get("valor_total")),
    observacoes: String(formData.get("observacoes") ?? "").trim() || null,
  };
}

export async function criarMostruario(
  _prevState: MostruarioState | undefined,
  formData: FormData
): Promise<MostruarioState> {
  const dados = fromFormData(formData);

  if (!dados.nome) {
    return { error: "Nome é obrigatório." };
  }
  if (!Number.isFinite(dados.valor_total) || dados.valor_total < 0) {
    return { error: "Valor total inválido." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("mostruarios").insert(dados).select("id").single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/mostruarios");
  redirect(`/mostruarios/${data.id}`);
}

export async function atualizarMostruario(
  id: string,
  _prevState: MostruarioState | undefined,
  formData: FormData
): Promise<MostruarioState> {
  const dados = fromFormData(formData);

  if (!dados.nome) {
    return { error: "Nome é obrigatório." };
  }
  if (!Number.isFinite(dados.valor_total) || dados.valor_total < 0) {
    return { error: "Valor total inválido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("mostruarios").update(dados).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/mostruarios");
  revalidatePath(`/mostruarios/${id}`);
  return { success: true };
}

export async function marcarManutencao(id: string, statusAtual: string) {
  const novoStatus = statusAtual === "Em manutenção/perda" ? "Disponível" : "Em manutenção/perda";
  const supabase = await createClient();
  await supabase.from("mostruarios").update({ status: novoStatus }).eq("id", id);
  revalidatePath("/mostruarios");
  revalidatePath(`/mostruarios/${id}`);
}

export async function alterarStatusEmMassa(ids: string[], novoStatus: "Disponível" | "Em manutenção/perda") {
  if (ids.length === 0) return;
  const supabase = await createClient();
  // Só afeta mostruários que já estão livres — nunca mexe num que está "Com revendedora".
  await supabase
    .from("mostruarios")
    .update({ status: novoStatus })
    .in("id", ids)
    .in("status", ["Disponível", "Em manutenção/perda"]);
  revalidatePath("/mostruarios");
}
