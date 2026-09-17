"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { calcularConferencia, calcularSaldoPecas, calcularSaldoValor } from "@/lib/financeiro/calculo";
import { calcularProximaConferencia } from "@/lib/financeiro/datas";

export interface ConferenciaState {
  error?: string;
}

export async function registrarConferencia(
  _prevState: ConferenciaState | undefined,
  formData: FormData
): Promise<ConferenciaState> {
  const entregaId = String(formData.get("entrega_id") ?? "");
  const tipo = String(formData.get("tipo") ?? "");
  const dataRealizada = String(formData.get("data_realizada") ?? "");
  const pecasVendidas = Number(formData.get("pecas_vendidas") || 0);
  const pecasDevolvidas = Number(formData.get("pecas_devolvidas") || 0);
  const pecasRepostas = Number(formData.get("pecas_repostas") || 0);
  const valorVendido = Number(formData.get("valor_vendido") || 0);
  const descontos = Number(formData.get("descontos") || 0);
  const acrescimos = Number(formData.get("acrescimos") || 0);
  const valorReposicao = Number(formData.get("valor_reposicao") || 0);
  const observacoes = String(formData.get("observacoes") ?? "").trim() || null;

  if (!entregaId || (tipo !== "Parcial" && tipo !== "Final")) {
    return { error: "Dados inválidos." };
  }

  const supabase = await createClient();

  const { data: entrega, error: entregaError } = await supabase
    .from("entregas")
    .select("*")
    .eq("id", entregaId)
    .single();

  if (entregaError || !entrega) {
    return { error: "Entrega não encontrada." };
  }

  if (entrega.status === "Encerrada") {
    return { error: "Esta entrega já está encerrada." };
  }

  const { data: configuracoes, error: configError } = await supabase
    .from("configuracoes")
    .select("*")
    .eq("id", 1)
    .single();

  if (configError || !configuracoes) {
    return { error: "Não foi possível carregar as configurações de percentuais." };
  }

  const resultado = calcularConferencia(valorVendido, descontos, acrescimos, {
    percentualRevendedora: configuracoes.percentual_revendedora,
    percentualEmpresa: configuracoes.percentual_empresa,
    percentualProprietaria: configuracoes.percentual_proprietaria,
    percentualSocia: configuracoes.percentual_socia,
  });

  const quantidadePecasApos =
    tipo === "Final"
      ? 0
      : calcularSaldoPecas(entrega.quantidade_pecas_atual, pecasVendidas, pecasDevolvidas, pecasRepostas);

  const valorAtualApos =
    tipo === "Final"
      ? 0
      : calcularSaldoValor(
          entrega.valor_atual,
          entrega.quantidade_pecas_atual,
          pecasVendidas,
          pecasDevolvidas,
          valorReposicao
        );

  if (tipo === "Parcial" && quantidadePecasApos < 0) {
    return { error: "A soma de peças vendidas e devolvidas não pode ser maior que o saldo atual." };
  }

  const proximaConferenciaPrevista =
    tipo === "Parcial" ? calcularProximaConferencia(dataRealizada, entrega.prazo_dias_aplicado) : null;

  const { data: novaConferencia, error } = await supabase
    .from("conferencias")
    .insert({
      entrega_id: entregaId,
      tipo,
      data_realizada: dataRealizada,
      pecas_vendidas: pecasVendidas,
      pecas_devolvidas: pecasDevolvidas,
      pecas_repostas: tipo === "Parcial" ? pecasRepostas : 0,
      valor_vendido: valorVendido,
      descontos,
      acrescimos,
      valor_reposicao: tipo === "Parcial" ? valorReposicao : 0,
      quantidade_pecas_apos: quantidadePecasApos,
      valor_atual_apos: valorAtualApos,
      percentual_revendedora_aplicado: configuracoes.percentual_revendedora,
      percentual_empresa_aplicado: configuracoes.percentual_empresa,
      percentual_proprietaria_aplicado: configuracoes.percentual_proprietaria,
      percentual_socia_aplicado: configuracoes.percentual_socia,
      valor_comissao_revendedora: resultado.valorComissaoRevendedora,
      valor_empresa: resultado.valorEmpresa,
      valor_proprietaria: resultado.valorProprietaria,
      valor_socia: resultado.valorSocia,
      proxima_conferencia_prevista: proximaConferenciaPrevista,
      observacoes,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/entregas/${entregaId}`);
  revalidatePath("/entregas");
  revalidatePath("/mostruarios");
  redirect(`/conferencias/${novaConferencia.id}`);
}
