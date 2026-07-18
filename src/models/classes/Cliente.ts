import { ClienteRow } from "../interfaces/ClienteInterface";

export class Cliente {
  constructor(
    public id: number,
    public nome: string,
    public email: string,
    public telefone: string | null,
    public endereco: string | null
  ) {}

  // Converte uma linha do banco (ClienteRow) em uma instância da classe Cliente
  static fromRow(row: ClienteRow): Cliente {
    return new Cliente(row.id, row.nome, row.email, row.telefone, row.endereco);
  }
}
