export interface LivroDisponivelRow {
  id: number;
  titulo: string;
  autor_nome: string;
  quantidade: number;
  disponiveis: number;
}

export interface LivroEmprestadoRow {
  id: number;
  titulo: string;
  autor_nome: string;
  quantidade: number;
  emprestados: number;
}

export interface LivrosPorAutorRow {
  autor_id: number;
  autor_nome: string;
  total_livros: number;
}

export interface EmprestimosPorLivroRow {
  id: number;
  titulo: string;
  autor_nome: string;
  total_emprestimos: number;
}

export interface ClienteEmprestimoAtivoRow {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  emprestimos_ativos: number;
}
