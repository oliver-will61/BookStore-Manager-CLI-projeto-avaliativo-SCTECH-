import pool from "../database/connection";
import {
  LivroDisponivelRow,
  LivroEmprestadoRow,
  LivrosPorAutorRow,
  EmprestimosPorLivroRow,
  ClienteEmprestimoAtivoRow,
} from "../models/interfaces/RelatorioInterface";

export async function repositoryLivrosDisponiveis(): Promise<LivroDisponivelRow[]> {
  const result = await pool.query(
    `SELECT l.id, l.titulo, a.nome AS autor_nome, l.quantidade,
            l.quantidade - COALESCE(e.emprestados, 0) AS disponiveis
     FROM livros l
     JOIN autores a ON a.id = l.autor_id
     LEFT JOIN (
       SELECT livro_id, COUNT(*)::int AS emprestados
       FROM emprestimos WHERE status = 'emprestado'
       GROUP BY livro_id
     ) e ON e.livro_id = l.id
     WHERE l.quantidade - COALESCE(e.emprestados, 0) > 0
     ORDER BY l.titulo`
  );

  return result.rows;
}

export async function repositoryLivrosEmprestados(): Promise<LivroEmprestadoRow[]> {
  const result = await pool.query(
    `SELECT l.id, l.titulo, a.nome AS autor_nome, l.quantidade,
            e.emprestados
     FROM livros l
     JOIN autores a ON a.id = l.autor_id
     JOIN (
       SELECT livro_id, COUNT(*)::int AS emprestados
       FROM emprestimos WHERE status = 'emprestado'
       GROUP BY livro_id
     ) e ON e.livro_id = l.id
     ORDER BY e.emprestados DESC, l.titulo`
  );

  return result.rows;
}

export async function repositoryLivrosPorAutor(): Promise<LivrosPorAutorRow[]> {
  const result = await pool.query(
    `SELECT a.id AS autor_id, a.nome AS autor_nome,
            COUNT(l.id)::int AS total_livros
     FROM autores a
     LEFT JOIN livros l ON l.autor_id = a.id
     GROUP BY a.id, a.nome
     ORDER BY a.nome`
  );

  return result.rows;
}

export async function repositoryEmprestimosPorLivro(): Promise<EmprestimosPorLivroRow[]> {
  const result = await pool.query(
    `SELECT l.id, l.titulo, a.nome AS autor_nome,
            COUNT(e.id)::int AS total_emprestimos
     FROM livros l
     JOIN autores a ON a.id = l.autor_id
     LEFT JOIN emprestimos e ON e.livro_id = l.id
     GROUP BY l.id, l.titulo, a.nome
     ORDER BY total_emprestimos DESC, l.titulo`
  );

  return result.rows;
}

export async function repositoryClientesComEmprestimosAtivos(): Promise<ClienteEmprestimoAtivoRow[]> {
  const result = await pool.query(
    `SELECT c.id, c.nome, c.email, c.telefone,
            COUNT(e.id)::int AS emprestimos_ativos
     FROM clientes c
     JOIN emprestimos e ON e.cliente_id = c.id AND e.status = 'emprestado'
     GROUP BY c.id, c.nome, c.email, c.telefone
     ORDER BY emprestimos_ativos DESC, c.nome`
  );

  return result.rows;
}
