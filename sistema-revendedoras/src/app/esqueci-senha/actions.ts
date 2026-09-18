"use server";

import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export interface EsqueciSenhaState {
  error?: string;
  success?: boolean;
}

export async function solicitarRedefinicao(
  _prevState: EsqueciSenhaState | undefined,
  formData: FormData
): Promise<EsqueciSenhaState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Informe seu e-mail." };
  }

  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocolo = host.startsWith("localhost") ? "http" : "https";
  const origem = `${protocolo}://${host}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origem}/auth/callback?next=/redefinir-senha`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
