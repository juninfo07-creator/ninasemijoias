import Link from "next/link";
import { signOut } from "@/app/(app)/actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/revendedoras", label: "Revendedoras" },
  { href: "/mostruarios", label: "Mostruários" },
  { href: "/entregas", label: "Entregas" },
  { href: "/conferencias", label: "Conferências" },
  { href: "/configuracoes", label: "Configurações" },
] as const;

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
      <span className="text-sm font-semibold text-neutral-900">Nina Semijoias</span>
      <nav className="hidden gap-4 text-sm text-neutral-600 sm:flex">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-neutral-900">
            {item.label}
          </Link>
        ))}
      </nav>
      <form action={signOut}>
        <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-900">
          Sair
        </button>
      </form>
    </header>
  );
}
