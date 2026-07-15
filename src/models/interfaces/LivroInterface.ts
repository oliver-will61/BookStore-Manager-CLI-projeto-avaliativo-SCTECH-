export interface livroInterface {
    titulo: string,
    ano_publicacao: number,
    genero: string,
    autor_id: number,
    quantidade: number
}

export interface LivroRow {
  id: number;
  titulo: string;
  ano_publicacao: number | null;
  genero: string | null;
  autor_id: number;
  quantidade: number;
}
