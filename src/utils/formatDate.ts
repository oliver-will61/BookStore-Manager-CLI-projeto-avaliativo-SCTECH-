// Função utilitária para formatar datas no padrão AAAA-MM-DD
// Aceita tanto string quanto objeto Date, retornando string formatada ou "-" se inválido
export function formatarData(data: unknown): string {
  // Se não houver data (null, undefined, string vazia), retorna hífen
  if (!data) return "-";

  // Converte o valor recebido para objeto Date (funciona com string ou Date)
  const date = new Date(data as string | Date);

  // Verifica se a data é válida; se não for, retorna hífen
  if (isNaN(date.getTime())) return "-";

  // Converte para ISO (ex: "2001-08-24T00:00:00.000Z")
  // split("T")[0] extrai apenas a parte da data ("2001-08-24")
  return date.toISOString().split("T")[0];
}
