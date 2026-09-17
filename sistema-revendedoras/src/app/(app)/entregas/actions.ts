"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface EntregaState {
  error?: string;
}

export async function criarEntrega(
  _prevState: EntregaState | undefined,
  formData: FormData
): Promise<EntregaState> {
  const revendedoraId = String(formData.get("revendedora_id") ?? "");
  const mostruarioId = String(formData.get("mostruario_id") ?? "");
  const dataEntrega = String(formData.get("data_entrega") ?? "");
  const dataConferenciaPrevista = String(formData.get("data_conferencia_prevista") ?? "");
  const prazoDiasAplicado = Number(formData.get("prazo_dias_aplicado"));
  const responsavel = String(formData.get("responsavel") ?? "").trim() || null;
  const observacoes = String(formData.get("observacoes") ?? "").trim() || null;
  const quantidadePecasEntrega = Number(formData.get("quantidade_pecas_entrega"));
  const valorTotalEntrega = Number(formData.get("valor_total_entrega"));
  const excecaoAutorizada = formData.get("excecao_autorizada") === "on";

  if (!revendedoraId || !mostruarioId) {
    return { error: "Selecione a revendedora e o mostruário." };
  }
  if (!dataEntrega || !dataConferenciaPrevista) {
    return { error: "Datas obrigatórias." };
  }

  const supabase = await createClient();
  // O trigger fn_check_nova_entrega valida disponibilidade do mostruário e pendências
  // da revendedora antes do insert, retornando erro se algo bloquear a entrega.
  const { data: nova, error } = await supabase
    .from("entregas")
    .insert({
      revendedora_id: revendedoraId,
      mostruario_id: mostruarioId,
      data_entrega: dataEntrega,
      data_conferencia_prevista: dataConferenciaPrevista,
      prazo_dias_aplicado: prazoDiasAplicado,
      responsavel,
      observacoes,
      quantidade_pecas_entrega: quantidadePecasEntrega,
      valor_total_entrega: valorTotalEntrega,
      quantidade_pecas_atual: quantidadePecasEntrega,
      valor_atual: valorTotalEntrega,
      excecao_autorizada: excecaoAutorizada,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/entregas");
  revalidatePath("/mostruarios");
  revalidatePath("/revendedoras");
  redirect(`/entregas/${nova.id}`);
}
