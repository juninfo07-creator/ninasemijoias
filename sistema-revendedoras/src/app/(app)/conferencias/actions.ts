"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { calcularConferencia, calcularSaldoValor } from "@/lib/financeiro/calculo";
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
  const valorVendido = Number(formData.get("valor_vendido") || 0);
  const descontos = Number(formData.get("descontos") || 0);
  const acrescimos = Number(formData.get("acrescimos") || 0);
  const valorDevolvido = Number(formData.get("valor_devolvido") || 0);
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
    limiteFaixaComissao: configuracoes.limite_faixa_comissao,
    percentualRevendedoraAbaixo: configuracoes.percentual_revendedora_abaixo,
    percentualRevendedoraAcima: configuracoes.percentual_revendedora_acima,
    percentualProprietaria: configuracoes.percentual_proprietaria,
    percentualSocia: configuracoes.percentual_socia,
  });

  const valorAtualApos =
    tipo === "Final"
      ? 0
      : calcularSaldoValor(entrega.valor_atual, valorVendido, valorDevolvido, valorReposicao);

  if (tipo === "Parcial" && valorAtualApos < 0) {
    return { error: "O valor vendido + devolvido não pode ser maior que o saldo atual com a revendedora." };
  }

  const proximaConferenciaPrevista =
    tipo === "Parcial" ? calcularProximaConferencia(dataRealizada, entrega.prazo_dias_aplicado) : null;

  const { data: novaConferencia, error } = await supabase
    .from("conferencias")
    .insert({
      entrega_id: entregaId,
      tipo,
      data_realizada: dataRealizada,
      valor_vendido: valorVendido,
      descontos,
      acrescimos,
      valor_devolvido: tipo === "Parcial" ? valorDevolvido : 0,
      valor_reposicao: tipo === "Parcial" ? valorReposicao : 0,
      valor_atual_apos: valorAtualApos,
      percentual_revendedora_aplicado: resultado.percentualRevendedoraAplicado,
      percentual_empresa_aplicado: resultado.percentualEmpresaAplicado,
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
  revalidatePath("/conferencias");
  redirect(`/conferencias/${novaConferencia.id}`);
}
