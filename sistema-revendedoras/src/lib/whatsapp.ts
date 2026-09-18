export function linkWhatsApp(numero: string | null | undefined, mensagem: string): string | null {
  if (!numero) return null;
  const digitos = numero.replace(/\D/g, "");
  if (!digitos) return null;
  const comCodigoPais = digitos.length <= 11 ? `55${digitos}` : digitos;
  return `https://wa.me/${comCodigoPais}?text=${encodeURIComponent(mensagem)}`;
}
