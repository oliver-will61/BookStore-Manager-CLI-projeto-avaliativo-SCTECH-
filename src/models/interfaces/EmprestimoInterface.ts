export interface emprestimoInterface {
    cliente_id: number,
    livro_id: number,
    data_emprestimo: Date,
    data_devolucao: Date | null,
    status: string
}

export interface EmprestimoRow {
  id: number;
  cliente_id: number;
  livro_id: number;
  data_emprestimo: string;
  data_devolucao: string | null;
  status: string;
}

export interface EmprestimoCompletoRow extends EmprestimoRow {
  cliente_nome: string;
  livro_titulo: string;
}
