import Link from "next/link";
import { EsqueciSenhaForm } from "./EsqueciSenhaForm";

export default function EsqueciSenhaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-lg font-semibold text-neutral-900">Esqueci minha senha</h1>
        <p className="mb-6 text-sm text-neutral-500">
          Informe o e-mail cadastrado pra receber um link de redefinição.
        </p>
        <EsqueciSenhaForm />
        <Link href="/login" className="mt-4 block text-center text-sm text-neutral-500 hover:underline">
          Voltar pro login
        </Link>
      </div>
    </main>
  );
}
