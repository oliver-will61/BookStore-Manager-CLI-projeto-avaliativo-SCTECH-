import { EmprestimoRow } from "../interfaces/EmprestimoInterface";

export class Emprestimo {
  constructor(
    public id: number,
    public cliente_id: number,
    public livro_id: number,
    public data_emprestimo: string,
    public data_devolucao: string | null,
    public status: string
  ) {}

  // Converte uma linha do banco (EmprestimoRow) em uma instância da classe Emprestimo
  static fromRow(row: EmprestimoRow): Emprestimo {
    return new Emprestimo(row.id, row.cliente_id, row.livro_id, row.data_emprestimo, row.data_devolucao, row.status);
  }
}
