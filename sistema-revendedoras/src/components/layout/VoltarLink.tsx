import Link from "next/link";

export function VoltarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 hover:underline">
      ← {label}
    </Link>
  );
}
