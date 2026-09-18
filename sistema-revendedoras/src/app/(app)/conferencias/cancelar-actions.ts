"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface CancelarConferenciaState {
  error?: string;
}

export async function cancelarConferencia(
  conferenciaId: string,
  _prevState: CancelarConferenciaState | undefined
): Promise<CancelarConferenciaState> {
  const supabase = await createClient();

  const { data: conferencia, error: confError } = await supabase
    .from("conferencias")
    .select("id, entrega_id, entregas(mostruario_id)")
    .eq("id", conferenciaId)
    .single();

  if (confError || !conferencia) {
    return { error: "Conferência não encontrada." };
  }

  const { data: pagamentosAtivos } = await supabase
    .from("pagamentos")
    .select("id")
    .eq("conferencia_id", conferenciaId)
    .eq("status", "Ativo")
    .limit(1);

  if (pagamentosAtivos && pagamentosAtivos.length > 0) {
    return { error: "Cancele os pagamentos dessa conferência antes de cancelá-la." };
  }

  const mostruarioId = conferencia.entregas?.mostruario_id;
  const { data: mostruario } = await supabase
    .from("mostruarios")
    .select("status")
    .eq("id", mostruarioId)
    .single();

  if (mostruario?.status !== "Disponível") {
    return {
      error: "Não é possível cancelar: o mostruário já foi usado em outra entrega desde então.",
    };
  }

  const { error: cancelError } = await supabase
    .from("conferencias")
    .update({ status: "Cancelada" })
    .eq("id", conferenciaId);
  if (cancelError) return { error: cancelError.message };

  await supabase
    .from("entregas")
    .update({ status: "Aberta", data_encerramento: null })
    .eq("id", conferencia.entrega_id);

  await supabase.from("mostruarios").update({ status: "Com revendedora" }).eq("id", mostruarioId);

  revalidatePath(`/entregas/${conferencia.entrega_id}`);
  revalidatePath("/entregas");
  revalidatePath("/mostruarios");
  revalidatePath("/conferencias");
  revalidatePath("/dashboard");
  redirect(`/entregas/${conferencia.entrega_id}`);
}
