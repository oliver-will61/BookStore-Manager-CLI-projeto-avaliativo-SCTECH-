// Função utilitária para validar IDs numéricos
// Lança erro se o ID for inválido (nulo, zero ou negativo)
// nomeCampo é opcional; se não informado, usa "ID" como nome padrão
export function validarId(id: number, nomeCampo?: string): void {
  if (!id || id <= 0) {
    throw new Error(`${nomeCampo || "ID"} inválido.`);
  }
}

// Extrai a mensagem de um erro capturado em try/catch
// Retorna error.message se for instância de Error, senão retorna o fallback ou "Erro inesperado."
export function extrairMensagemErro(error: unknown, fallback?: string): string {
  if (error instanceof Error) return error.message;
  return fallback || "Erro inesperado.";
}
