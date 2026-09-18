"use client";

import { useEffect, useState } from "react";

function formatarExibicao(valor: number): string {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function paraNumero(textoDigitado: string): number {
  const somenteDigitos = textoDigitado.replace(/\D/g, "");
  if (!somenteDigitos) return 0;
  return Number(somenteDigitos) / 100;
}

export function CampoMoeda({
  id,
  name,
  defaultValue,
  required,
  className,
  onValueChange,
}: {
  id: string;
  name: string;
  defaultValue?: number | null;
  required?: boolean;
  className?: string;
  onValueChange?: (valor: number) => void;
}) {
  const [valor, setValor] = useState(defaultValue ?? 0);
  const [texto, setTexto] = useState(formatarExibicao(defaultValue ?? 0));

  useEffect(() => {
    setValor(defaultValue ?? 0);
    setTexto(formatarExibicao(defaultValue ?? 0));
  }, [defaultValue]);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
        R$
      </span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        required={required}
        value={texto}
        onChange={(e) => {
          const novoValor = paraNumero(e.target.value);
          setValor(novoValor);
          setTexto(formatarExibicao(novoValor));
          onValueChange?.(novoValor);
        }}
        onFocus={(e) => e.target.select()}
        className={
          className ??
          "w-full rounded-md border border-neutral-300 py-2 pl-9 pr-3 text-sm focus:border-neutral-500 focus:outline-none"
        }
      />
      <input type="hidden" name={name} value={valor} />
    </div>
  );
}
