"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export interface RedefinirSenhaState {
  error?: string;
}

export async function redefinirSenha(
  _prevState: RedefinirSenhaState | undefined,
  formData: FormData
): Promise<RedefinirSenhaState> {
  const senha = String(formData.get("senha") ?? "");
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (senha.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }
  if (senha !== confirmacao) {
    return { error: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: senha });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
