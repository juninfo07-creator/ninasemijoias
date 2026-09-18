"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/(app)/actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/revendedoras", label: "Revendedoras" },
  { href: "/mostruarios", label: "Mostruários" },
  { href: "/entregas", label: "Entregas" },
  { href: "/conferencias", label: "Conferências" },
  { href: "/ranking", label: "Ranking" },
  { href: "/repasses", label: "Repasses" },
  { href: "/configuracoes", label: "Configurações" },
] as const;

function Logo() {
  return (
    <Image
      src="/identidade/logo-preta.png"
      alt="Nina Semijoias"
      width={1672}
      height={941}
      priority
      className="h-8 w-auto"
    />
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`rounded-md border-l-[3px] px-3 py-2 text-sm ${
              active
                ? "border-[#A6790A] bg-neutral-900 text-white"
                : "border-transparent text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      {/* Barra superior mobile */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 sm:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-label="Abrir menu"
          className="rounded-md p-1 text-neutral-700 hover:bg-neutral-100"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Overlay mobile */}
      {aberto && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setAberto(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col gap-4 bg-white p-4 shadow-lg">
            <Logo />
            <NavLinks onNavigate={() => setAberto(false)} />
            <form action={signOut} className="mt-auto">
              <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-900">
                Sair
              </button>
            </form>
          </aside>
        </div>
      )}

      {/* Sidebar fixa desktop */}
      <aside className="hidden w-56 shrink-0 flex-col gap-4 border-r border-neutral-200 bg-white p-4 sm:flex">
        <Logo />
        <NavLinks />
        <form action={signOut} className="mt-auto">
          <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-900">
            Sair
          </button>
        </form>
      </aside>
    </>
  );
}
