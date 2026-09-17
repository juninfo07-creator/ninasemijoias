export interface Percentuais {
  percentualRevendedora: number;
  percentualEmpresa: number;
  percentualProprietaria: number; // % da fatia empresa
  percentualSocia: number; // % da fatia empresa
}

export interface ResultadoCalculoConferencia {
  baseCalculo: number;
  valorComissaoRevendedora: number;
  valorEmpresa: number;
  valorProprietaria: number;
  valorSocia: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calcularConferencia(
  valorVendido: number,
  descontos: number,
  acrescimos: number,
  percentuais: Percentuais
): ResultadoCalculoConferencia {
  const baseCalculo = round2(valorVendido - descontos + acrescimos);
  const valorComissaoRevendedora = round2((baseCalculo * percentuais.percentualRevendedora) / 100);
  const valorEmpresa = round2((baseCalculo * percentuais.percentualEmpresa) / 100);
  const valorProprietaria = round2((valorEmpresa * percentuais.percentualProprietaria) / 100);
  const valorSocia = round2(valorEmpresa - valorProprietaria);

  return { baseCalculo, valorComissaoRevendedora, valorEmpresa, valorProprietaria, valorSocia };
}

export function calcularSaldoPecas(
  quantidadeAtual: number,
  pecasVendidas: number,
  pecasDevolvidas: number,
  pecasRepostas: number
): number {
  return quantidadeAtual - pecasVendidas - pecasDevolvidas + pecasRepostas;
}

export function calcularSaldoValor(
  valorAtual: number,
  quantidadeAtual: number,
  pecasVendidas: number,
  pecasDevolvidas: number,
  valorReposicao: number
): number {
  if (quantidadeAtual <= 0) return round2(valorReposicao);
  const valorMedioPeca = valorAtual / quantidadeAtual;
  return round2(valorAtual - valorMedioPeca * (pecasVendidas + pecasDevolvidas) + valorReposicao);
}
