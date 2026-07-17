import { BaseRepository } from "../models/classes/BaseRepository";
import pool from "../database/connection";
import { EmprestimoRow, EmprestimoCompletoRow } from "../models/interfaces/EmprestimoInterface";

export async function repositoryCadastraEmprestimo(
  cliente_id: number,
  livro_id: number,
  status: string,
  data_emprestimo: string,
  data_devolucao: string
): Promise<EmprestimoRow> {
  return (await BaseRepository.insert("emprestimos", {
    cliente_id,
    livro_id,
    status,
    data_emprestimo,
    data_devolucao,
  })) as unknown as EmprestimoRow;
}

export async function repositoryListarEmprestimos(): Promise<EmprestimoCompletoRow[]> {
  const result = await pool.query(
    `SELECT e.id, e.cliente_id, e.livro_id, e.data_emprestimo, e.data_devolucao, e.status,
            c.nome AS cliente_nome, l.titulo AS livro_titulo
     FROM emprestimos e
     JOIN clientes c ON c.id = e.cliente_id
     JOIN livros l ON l.id = e.livro_id
     ORDER BY e.id`
  );

  return result.rows as unknown as EmprestimoCompletoRow[];
}

export async function repositoryBuscarEmprestimoPorId(
  id: number
): Promise<EmprestimoCompletoRow | null> {
  const result = await pool.query(
    `SELECT e.id, e.cliente_id, e.livro_id, e.data_emprestimo, e.data_devolucao, e.status,
            c.nome AS cliente_nome, l.titulo AS livro_titulo
     FROM emprestimos e
     JOIN clientes c ON c.id = e.cliente_id
     JOIN livros l ON l.id = e.livro_id
     WHERE e.id = $1`,
    [id]
  );

  return (result.rows[0] as unknown as EmprestimoCompletoRow) || null;
}

export async function repositoryListarLivrosComDisponivel(): Promise<{ id: number; titulo: string; disponiveis: number }[]> {
  const result = await pool.query(
    `SELECT l.id, l.titulo, l.quantidade - COALESCE(e.emprestados, 0) AS disponiveis
     FROM livros l
     LEFT JOIN (
       SELECT livro_id, COUNT(*)::int AS emprestados
       FROM emprestimos
       WHERE status = 'emprestado'
       GROUP BY livro_id
     ) e ON e.livro_id = l.id
     ORDER BY l.id`
  );

  return result.rows;
}

export async function repositoryContarEmprestimosAtivos(
  livro_id: number
): Promise<number> {
  return await BaseRepository.countByTwo("emprestimos", "livro_id", livro_id, "status", "emprestado");
}

export async function repositoryDevolverLivro(
  id: number,
  data_devolucao: string
): Promise<EmprestimoRow | null> {
  return (await BaseRepository.update("emprestimos", id, {
    status: "devolvido",
    data_devolucao,
  })) as unknown as EmprestimoRow | null;
}
