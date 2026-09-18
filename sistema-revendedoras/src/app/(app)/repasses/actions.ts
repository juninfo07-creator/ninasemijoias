"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface RepasseState {
  error?: string;
}

const FORMAS_VALIDAS = ["PIX", "Dinheiro", "Transferência", "Cartão", "Outro"];

export async function registrarRepasse(
  _prevState: RepasseState | undefined,
  formData: FormData
): Promise<RepasseState> {
  const valor = Number(formData.get("valor"));
  const data = String(formData.get("data") ?? "");
  const formaPagamento = String(formData.get("forma_pagamento") ?? "");
  const observacao = String(formData.get("observacao") ?? "").trim() || null;

  if (!Number.isFinite(valor) || valor <= 0) {
    return { error: "Valor precisa ser maior que zero." };
  }
  if (!data) {
    return { error: "Data é obrigatória." };
  }
  if (!FORMAS_VALIDAS.includes(formaPagamento)) {
    return { error: "Forma de pagamento inválida." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("repasses").insert({
    valor,
    data,
    forma_pagamento: formaPagamento,
    observacao,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/repasses");
  revalidatePath("/dashboard");
  return {};
}

export async function cancelarRepasse(repasseId: string) {
  const supabase = await createClient();
  await supabase.from("repasses").update({ status: "Cancelado" }).eq("id", repasseId);
  revalidatePath("/repasses");
  revalidatePath("/dashboard");
}
