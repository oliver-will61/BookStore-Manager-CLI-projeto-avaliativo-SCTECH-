export interface clienteInterface {
    nome: string,
    email: string,
    telefone: string,
    endereco: string
}

export interface ClienteRow {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  endereco: string | null;
}
