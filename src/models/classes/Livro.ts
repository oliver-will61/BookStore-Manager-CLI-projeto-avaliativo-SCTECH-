import { LivroRow } from "../interfaces/LivroInterface";

export class Livro {
  constructor(
    public id: number,
    public titulo: string,
    public ano_publicacao: number | null,
    public genero: string | null,
    public autor_id: number,
    public quantidade: number
  ) {}

  // Converte uma linha do banco (LivroRow) em uma instância da classe Livro
  static fromRow(row: LivroRow): Livro {
    return new Livro(row.id, row.titulo, row.ano_publicacao, row.genero, row.autor_id, row.quantidade);
  }
}
