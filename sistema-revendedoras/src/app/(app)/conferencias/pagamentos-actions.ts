"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface PagamentoState {
  error?: string;
}

const FORMAS_VALIDAS = ["PIX", "Dinheiro", "Transferência", "Cartão", "Outro"];

export async function registrarPagamento(
  conferenciaId: string,
  _prevState: PagamentoState | undefined,
  formData: FormData
): Promise<PagamentoState> {
  const valorPago = Number(formData.get("valor_pago"));
  const data = String(formData.get("data") ?? "");
  const formaPagamento = String(formData.get("forma_pagamento") ?? "");
  const observacao = String(formData.get("observacao") ?? "").trim() || null;

  if (!Number.isFinite(valorPago) || valorPago <= 0) {
    return { error: "Valor pago precisa ser maior que zero." };
  }
  if (!data) {
    return { error: "Data é obrigatória." };
  }
  if (!FORMAS_VALIDAS.includes(formaPagamento)) {
    return { error: "Forma de pagamento inválida." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("pagamentos").insert({
    conferencia_id: conferenciaId,
    valor_pago: valorPago,
    data,
    forma_pagamento: formaPagamento,
    observacao,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/conferencias/${conferenciaId}`);
  return {};
}

export async function cancelarPagamento(pagamentoId: string, conferenciaId: string) {
  const supabase = await createClient();
  await supabase.from("pagamentos").update({ status: "Cancelado" }).eq("id", pagamentoId);
  revalidatePath(`/conferencias/${conferenciaId}`);
}
