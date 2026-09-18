import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [revendedoras, mostruarios, entregas, conferencias, pagamentos, repasses, configuracoes] =
    await Promise.all([
      supabase.from("revendedoras").select("*"),
      supabase.from("mostruarios").select("*"),
      supabase.from("entregas").select("*"),
      supabase.from("conferencias").select("*"),
      supabase.from("pagamentos").select("*"),
      supabase.from("repasses").select("*"),
      supabase.from("configuracoes").select("*"),
    ]);

  const backup = {
    geradoEm: new Date().toISOString(),
    revendedoras: revendedoras.data ?? [],
    mostruarios: mostruarios.data ?? [],
    entregas: entregas.data ?? [],
    conferencias: conferencias.data ?? [],
    pagamentos: pagamentos.data ?? [],
    repasses: repasses.data ?? [],
    configuracoes: configuracoes.data ?? [],
  };

  const dataAtual = new Date().toISOString().slice(0, 10);

  return new Response(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="backup-nina-semijoias-${dataAtual}.json"`,
    },
  });
}
