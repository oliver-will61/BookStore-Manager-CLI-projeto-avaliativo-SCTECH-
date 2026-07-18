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
import { validarId } from "../utils/validators";

export async function ServiceCadastraEmprestimo(
  cliente_id: number,
  livro_id: number
): Promise<Emprestimo> {
  validarId(cliente_id, "ID do cliente");
  validarId(livro_id, "ID do livro");

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
  return Emprestimo.fromRow(row);
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
  validarId(id);

  return await repositoryBuscarEmprestimoPorId(id);
}

export async function ServiceListarLivrosComDisponivel(): Promise<{ id: number; titulo: string; disponiveis: number }[]> {
  return await repositoryListarLivrosComDisponivel();
}

export async function ServiceDevolverLivro(
  id: number
): Promise<Emprestimo> {
  validarId(id);

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

  return Emprestimo.fromRow(row);
}
