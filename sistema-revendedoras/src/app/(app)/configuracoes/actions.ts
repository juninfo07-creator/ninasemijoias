"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export interface ConfiguracoesState {
  error?: string;
  success?: boolean;
}

export async function atualizarConfiguracoes(
  _prevState: ConfiguracoesState | undefined,
  formData: FormData
): Promise<ConfiguracoesState> {
  const percentualRevendedora = Number(formData.get("percentual_revendedora"));
  const percentualEmpresa = Number(formData.get("percentual_empresa"));
  const percentualProprietaria = Number(formData.get("percentual_proprietaria"));
  const percentualSocia = Number(formData.get("percentual_socia"));
  const prazoPadraoDias = Number(formData.get("prazo_padrao_dias"));
  const nomeEmpresa = String(formData.get("nome_empresa") ?? "").trim() || null;
  const cnpjEmpresa = String(formData.get("cnpj_empresa") ?? "").trim() || null;
  const telefoneEmpresa = String(formData.get("telefone_empresa") ?? "").trim() || null;
  const enderecoEmpresa = String(formData.get("endereco_empresa") ?? "").trim() || null;

  if (Math.round((percentualRevendedora + percentualEmpresa) * 100) !== 10000) {
    return { error: "Revendedora + Empresa precisa somar 100%." };
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
      percentual_revendedora: percentualRevendedora,
      percentual_empresa: percentualEmpresa,
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
