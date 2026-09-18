export interface FaixaComissao {
  limiteFaixaComissao: number;
  percentualRevendedoraAbaixo: number;
  percentualRevendedoraAcima: number;
  percentualProprietaria: number; // % da fatia empresa
  percentualSocia: number; // % da fatia empresa
}

export interface ResultadoCalculoConferencia {
  baseCalculo: number;
  percentualRevendedoraAplicado: number;
  percentualEmpresaAplicado: number;
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
  faixas: FaixaComissao
): ResultadoCalculoConferencia {
  const percentualRevendedoraAplicado =
    valorVendido < faixas.limiteFaixaComissao
      ? faixas.percentualRevendedoraAbaixo
      : faixas.percentualRevendedoraAcima;
  const percentualEmpresaAplicado = 100 - percentualRevendedoraAplicado;

  const baseCalculo = round2(valorVendido - descontos + acrescimos);
  const valorComissaoRevendedora = round2((baseCalculo * percentualRevendedoraAplicado) / 100);
  const valorEmpresa = round2((baseCalculo * percentualEmpresaAplicado) / 100);
  const valorProprietaria = round2((valorEmpresa * faixas.percentualProprietaria) / 100);
  const valorSocia = round2(valorEmpresa - valorProprietaria);

  return {
    baseCalculo,
    percentualRevendedoraAplicado,
    percentualEmpresaAplicado,
    valorComissaoRevendedora,
    valorEmpresa,
    valorProprietaria,
    valorSocia,
  };
}

export function calcularSaldoValor(
  valorAtual: number,
  valorVendido: number,
  valorDevolvido: number,
  valorReposicao: number
): number {
  return round2(valorAtual - valorVendido - valorDevolvido + valorReposicao);
}
