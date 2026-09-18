import Image from "next/image";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <Image
          src="/identidade/logo-preta.png"
          alt="Nina Semijoias"
          width={1672}
          height={941}
          priority
          className="mx-auto mb-4 h-14 w-auto"
        />
        <p className="mb-6 text-center text-sm text-neutral-500">Entre para acessar o sistema.</p>
        <LoginForm />
      </div>
    </main>
  );
}
