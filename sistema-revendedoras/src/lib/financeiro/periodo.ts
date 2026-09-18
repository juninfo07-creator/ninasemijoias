import { hojeBrasilia } from "./datas";

export type PresetMeses = 3 | 6 | 12;
export type PresetPeriodo = "este-mes" | "mes-passado" | PresetMeses | "personalizado";

export const PRESETS_RAPIDOS: { label: string; valor: PresetPeriodo }[] = [
  { label: "Este mês", valor: "este-mes" },
  { label: "Mês passado", valor: "mes-passado" },
  { label: "3 meses", valor: 3 },
  { label: "6 meses", valor: 6 },
  { label: "12 meses", valor: 12 },
];

export function inicioHaMeses(meses: number): string {
  const [ano, mes] = hojeBrasilia().split("-").map(Number);
  const data = new Date(Date.UTC(ano, mes - 1 - (meses - 1), 1));
  return data.toISOString().slice(0, 10);
}

function primeiroDiaMesAtual(): string {
  const [ano, mes] = hojeBrasilia().split("-").map(Number);
  return new Date(Date.UTC(ano, mes - 1, 1)).toISOString().slice(0, 10);
}

function limitesMesPassado(): { inicio: string; fim: string } {
  const [ano, mes] = hojeBrasilia().split("-").map(Number);
  const inicio = new Date(Date.UTC(ano, mes - 2, 1));
  const fim = new Date(Date.UTC(ano, mes - 1, 0));
  return { inicio: inicio.toISOString().slice(0, 10), fim: fim.toISOString().slice(0, 10) };
}

export function calcularIntervalo(
  preset: PresetPeriodo,
  inicioCustom: string,
  fimCustom: string
): { inicio: string; fim: string } {
  if (preset === "personalizado") return { inicio: inicioCustom, fim: fimCustom };
  if (preset === "este-mes") return { inicio: primeiroDiaMesAtual(), fim: hojeBrasilia() };
  if (preset === "mes-passado") return limitesMesPassado();
  return { inicio: inicioHaMeses(preset), fim: hojeBrasilia() };
}
