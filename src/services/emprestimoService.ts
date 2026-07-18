import {
  repositoryCadastraEmprestimo,
  repositoryListarEmprestimos,
  repositoryBuscarEmprestimoPorId,
  repositoryContarEmprestimosAtivos,
  repositoryDevolverLivro,
  repositoryListarLivrosComDisponivel,
} from "../repositories/emprestimoRepository";
import { repositoryBuscarPorId as repositoryBuscarLivroPorId } from "../repositories/livroRepository";
import { repositoryBuscarPorId as repositoryBuscarClientePorId } from "../repositories/clienteRepository";
import { EmprestimoRow, EmprestimoCompletoRow } from "../models/interfaces/EmprestimoInterface";
import { Emprestimo } from "../models/classes/Emprestimo";

export async function ServiceCadastraEmprestimo(
  cliente_id: number,
  livro_id: number
): Promise<Emprestimo> {
  if (!cliente_id || cliente_id <= 0) {
    throw new Error("ID do cliente inválido.");
  }

  if (!livro_id || livro_id <= 0) {
    throw new Error("ID do livro inválido.");
  }

  const cliente = await repositoryBuscarClientePorId(cliente_id);
  if (!cliente) {
    throw new Error("Cliente não encontrado.");
  }

  const livro = await repositoryBuscarLivroPorId(livro_id);
  if (!livro) {
    throw new Error("Livro não encontrado.");
  }

  const emprestimosAtivos = await repositoryContarEmprestimosAtivos(livro_id);
  const disponiveis = livro.quantidade - emprestimosAtivos;

  if (disponiveis <= 0) {
    throw new Error(`Livro "${livro.titulo}" não possui exemplares disponíveis no momento.`);
  }

  const hoje = new Date().toISOString().split("T")[0];
  const dataDevolucao = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const row = await repositoryCadastraEmprestimo(cliente_id, livro_id, "emprestado", hoje, dataDevolucao);
  return new Emprestimo(row.id, row.cliente_id, row.livro_id, row.data_emprestimo, row.data_devolucao, row.status);
}

export async function ServiceListarEmprestimos(): Promise<{
  emprestimos: EmprestimoCompletoRow[];
  vazio: boolean;
}> {
  const emprestimos = await repositoryListarEmprestimos();

  return {
    emprestimos,
    vazio: emprestimos.length === 0,
  };
}

export async function ServiceConsultarEmprestimo(
  id: number
): Promise<EmprestimoCompletoRow | null> {
  if (!id || id <= 0) {
    throw new Error("ID inválido.");
  }

  return await repositoryBuscarEmprestimoPorId(id);
}

export async function ServiceListarLivrosComDisponivel(): Promise<{ id: number; titulo: string; disponiveis: number }[]> {
  return await repositoryListarLivrosComDisponivel();
}

export async function ServiceDevolverLivro(
  id: number
): Promise<Emprestimo> {
  if (!id || id <= 0) {
    throw new Error("ID inválido.");
  }

  const emprestimo = await repositoryBuscarEmprestimoPorId(id);
  if (!emprestimo) {
    throw new Error("Empréstimo não encontrado.");
  }

  if (emprestimo.status === "devolvido") {
    throw new Error("Este livro já foi devolvido.");
  }

  const hoje = new Date().toISOString().split("T")[0];
  const row = await repositoryDevolverLivro(id, hoje);

  if (!row) {
    throw new Error("Erro ao registrar devolução.");
  }

  return new Emprestimo(row.id, row.cliente_id, row.livro_id, row.data_emprestimo, row.data_devolucao, row.status);
}
