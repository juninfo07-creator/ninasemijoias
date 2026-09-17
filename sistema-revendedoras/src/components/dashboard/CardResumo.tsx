export function CardResumo({ label, valor }: { label: string; valor: string | number }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-neutral-900">{valor}</p>
    </div>
  );
}
