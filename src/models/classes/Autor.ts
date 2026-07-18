import { AutorRow } from "../interfaces/AutorInterface";

export class Autor {
  constructor(
    public id: number,
    public nome: string,
    public nacionalidade: string | null,
    public data_nascimento: string | null
  ) {}

  // Converte uma linha do banco (AutorRow) em uma instância da classe Autor
  static fromRow(row: AutorRow): Autor {
    return new Autor(row.id, row.nome, row.nacionalidade, row.data_nascimento);
  }
}
