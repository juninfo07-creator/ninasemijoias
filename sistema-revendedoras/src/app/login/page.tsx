import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-lg font-semibold text-neutral-900">Nina Semijoias</h1>
        <p className="mb-6 text-sm text-neutral-500">Entre para acessar o sistema.</p>
        <LoginForm />
      </div>
    </main>
  );
}
