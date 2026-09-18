"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export interface ConfiguracoesState {
  error?: string;
  success?: boolean;
}

export async function atualizarConfiguracoes(
  _prevState: ConfiguracoesState | undefined,
  formData: FormData
): Promise<ConfiguracoesState> {
  const limiteFaixaComissao = Number(formData.get("limite_faixa_comissao"));
  const percentualRevendedoraAbaixo = Number(formData.get("percentual_revendedora_abaixo"));
  const percentualRevendedoraAcima = Number(formData.get("percentual_revendedora_acima"));
  const percentualProprietaria = Number(formData.get("percentual_proprietaria"));
  const percentualSocia = Number(formData.get("percentual_socia"));
  const prazoPadraoDias = Number(formData.get("prazo_padrao_dias"));
  const nomeEmpresa = String(formData.get("nome_empresa") ?? "").trim() || null;
  const cnpjEmpresa = String(formData.get("cnpj_empresa") ?? "").trim() || null;
  const telefoneEmpresa = String(formData.get("telefone_empresa") ?? "").trim() || null;
  const enderecoEmpresa = String(formData.get("endereco_empresa") ?? "").trim() || null;

  if (!Number.isFinite(limiteFaixaComissao) || limiteFaixaComissao < 0) {
    return { error: "Limite da faixa precisa ser um valor válido." };
  }

  if (
    !Number.isFinite(percentualRevendedoraAbaixo) ||
    percentualRevendedoraAbaixo < 0 ||
    percentualRevendedoraAbaixo > 100 ||
    !Number.isFinite(percentualRevendedoraAcima) ||
    percentualRevendedoraAcima < 0 ||
    percentualRevendedoraAcima > 100
  ) {
    return { error: "Percentuais de comissão precisam estar entre 0 e 100." };
  }

  if (Math.round((percentualProprietaria + percentualSocia) * 100) !== 10000) {
    return { error: "Proprietária + Sócia precisa somar 100%." };
  }

  if (!Number.isFinite(prazoPadraoDias) || prazoPadraoDias <= 0) {
    return { error: "Prazo padrão precisa ser maior que zero." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("configuracoes")
    .update({
      limite_faixa_comissao: limiteFaixaComissao,
      percentual_revendedora_abaixo: percentualRevendedoraAbaixo,
      percentual_revendedora_acima: percentualRevendedoraAcima,
      percentual_proprietaria: percentualProprietaria,
      percentual_socia: percentualSocia,
      prazo_padrao_dias: prazoPadraoDias,
      nome_empresa: nomeEmpresa,
      cnpj_empresa: cnpjEmpresa,
      telefone_empresa: telefoneEmpresa,
      endereco_empresa: enderecoEmpresa,
    })
    .eq("id", 1);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/configuracoes");
  return { success: true };
}

export interface ResetState {
  error?: string;
}

export async function resetarDadosOperacionais(
  _prevState: ResetState | undefined,
  formData: FormData
): Promise<ResetState> {
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (confirmacao !== "APAGAR TUDO") {
    return { error: 'Digite exatamente "APAGAR TUDO" para confirmar.' };
  }

  const supabase = await createClient();

  // Ordem segura por FK: filhos antes dos pais.
  const { error: errPagamentos } = await supabase
    .from("pagamentos")
    .delete()
    .not("id", "is", null);
  if (errPagamentos) return { error: errPagamentos.message };

  const { error: errConferencias } = await supabase
    .from("conferencias")
    .delete()
    .not("id", "is", null);
  if (errConferencias) return { error: errConferencias.message };

  const { error: errEntregas } = await supabase.from("entregas").delete().not("id", "is", null);
  if (errEntregas) return { error: errEntregas.message };

  const { error: errMostruarios } = await supabase.from("mostruarios").delete().not("id", "is", null);
  if (errMostruarios) return { error: errMostruarios.message };

  const { error: errRevendedoras } = await supabase.from("revendedoras").delete().not("id", "is", null);
  if (errRevendedoras) return { error: errRevendedoras.message };

  const { error: errRepasses } = await supabase.from("repasses").delete().not("id", "is", null);
  if (errRepasses) return { error: errRepasses.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
