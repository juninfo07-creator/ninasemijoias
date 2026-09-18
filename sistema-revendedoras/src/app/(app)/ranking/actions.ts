"use server";

import { createClient } from "@/utils/supabase/server";

export interface RevendedoraRanking {
  revendedoraId: string;
  nome: string;
  totalVendido: number;
  numeroVendas: number;
}

export async function buscarRanking({
  inicio,
  fim,
}: {
  inicio: string;
  fim: string;
}): Promise<RevendedoraRanking[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("conferencias")
    .select("valor_vendido, entregas!inner(revendedora_id, revendedoras(nome_completo))")
    .eq("status", "Ativa")
    .gte("data_realizada", inicio)
    .lte("data_realizada", fim);

  const porRevendedora = new Map<string, RevendedoraRanking>();
  for (const c of data ?? []) {
    const revendedoraId = c.entregas?.revendedora_id;
    const nome = c.entregas?.revendedoras?.nome_completo;
    if (!revendedoraId || !nome) continue;

    const atual = porRevendedora.get(revendedoraId) ?? {
      revendedoraId,
      nome,
      totalVendido: 0,
      numeroVendas: 0,
    };
    atual.totalVendido += c.valor_vendido;
    atual.numeroVendas += 1;
    porRevendedora.set(revendedoraId, atual);
  }

  return Array.from(porRevendedora.values()).sort((a, b) => b.totalVendido - a.totalVendido);
}
