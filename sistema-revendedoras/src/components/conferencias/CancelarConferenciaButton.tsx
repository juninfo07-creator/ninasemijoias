"use client";

import { useState, useTransition } from "react";
import { cancelarConferencia } from "@/app/(app)/conferencias/cancelar-actions";

export function CancelarConferenciaButton({ conferenciaId }: { conferenciaId: string }) {
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const confirmado = window.confirm(
      "Cancelar essa conferência? A entrega volta a ficar aberta e o mostruário volta pra \"Com revendedora\"."
    );
    if (!confirmado) return;

    startTransition(async () => {
      const result = await cancelarConferencia(conferenciaId, undefined);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="text-xs text-red-600 hover:underline disabled:opacity-50"
      >
        {pending ? "Cancelando..." : "Cancelar conferência"}
      </button>
      {error && <p className="max-w-xs text-right text-xs text-red-600">{error}</p>}
    </div>
  );
}
