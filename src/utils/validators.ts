// Função utilitária para validar IDs numéricos
// Lança erro se o ID for inválido (nulo, zero ou negativo)
// nomeCampo é opcional; se não informado, usa "ID" como nome padrão
export function validarId(id: number, nomeCampo?: string): void {
  if (!id || id <= 0) {
    throw new Error(`${nomeCampo || "ID"} inválido.`);
  }
}
