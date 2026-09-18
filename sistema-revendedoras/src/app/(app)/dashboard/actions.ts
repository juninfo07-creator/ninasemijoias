"use server";

import { createClient } from "@/utils/supabase/server";

export interface PontoFaturamento {
  mes: string; // "YYYY-MM"
  valor: number;
}

export async function buscarFaturamento({
  inicio,
  fim,
  revendedoraId,
}: {
  inicio: string;
  fim: string;
  revendedoraId?: string;
}): Promise<PontoFaturamento[]> {
  const supabase = await createClient();

  let query = supabase
    .from("conferencias")
    .select("valor_vendido, data_realizada, entregas!inner(revendedora_id)")
    .eq("status", "Ativa")
    .gte("data_realizada", inicio)
    .lte("data_realizada", fim);

  if (revendedoraId) {
    query = query.eq("entregas.revendedora_id", revendedoraId);
  }

  const { data } = await query;

  const porMes = new Map<string, number>();
  for (const c of data ?? []) {
    const mes = c.data_realizada.slice(0, 7);
    porMes.set(mes, (porMes.get(mes) ?? 0) + c.valor_vendido);
  }

  return Array.from(porMes.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, valor]) => ({ mes, valor }));
}
