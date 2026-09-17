import { DateTime } from "luxon";

const TZ = "America/Sao_Paulo";

export function hojeBrasilia(): string {
  return DateTime.now().setZone(TZ).toISODate()!;
}

export function somarDias(dataISO: string, dias: number): string {
  return DateTime.fromISO(dataISO, { zone: TZ }).plus({ days: dias }).toISODate()!;
}

export function calcularProximaConferencia(dataRealizadaISO: string, prazoDiasAplicado: number): string {
  return somarDias(dataRealizadaISO, prazoDiasAplicado);
}

export type StatusConferencia = "Em dia" | "Próximo do vencimento" | "Vencido";

export function classificarStatusConferencia(dataPrevistaISO: string): StatusConferencia {
  const hoje = DateTime.fromISO(hojeBrasilia());
  const prevista = DateTime.fromISO(dataPrevistaISO);
  const diasRestantes = prevista.diff(hoje, "days").days;
  if (diasRestantes < 0) return "Vencido";
  if (diasRestantes <= 7) return "Próximo do vencimento";
  return "Em dia";
}

export function formatarDataBR(dataISO: string): string {
  return DateTime.fromISO(dataISO, { zone: TZ }).toFormat("dd/MM/yyyy");
}
