// Cria (ou atualiza a senha de) o usuário de login do sistema via Supabase Auth Admin API.
// Uso: node scripts/create-user.mjs --email teste@exemplo.com --password minhasenha123
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

function getArg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

const email = getArg("email");
const password = getArg("password");

if (!email || !password) {
  console.error("Uso: node scripts/create-user.mjs --email <email> --password <senha>");
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !secretKey) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SECRET_KEY no .env.local");
  process.exit(1);
}

const admin = createClient(supabaseUrl, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: existing } = await admin.auth.admin.listUsers();
const found = existing?.users?.find((u) => u.email === email);

if (found) {
  const { error } = await admin.auth.admin.updateUserById(found.id, { password });
  if (error) {
    console.error("Erro ao atualizar senha:", error.message);
    process.exit(1);
  }
  console.log(`Senha atualizada para o usuário existente: ${email}`);
} else {
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("Erro ao criar usuário:", error.message);
    process.exit(1);
  }
  console.log(`Usuário criado: ${email}`);
}
