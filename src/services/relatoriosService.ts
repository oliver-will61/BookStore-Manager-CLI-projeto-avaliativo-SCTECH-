import {
  repositoryLivrosDisponiveis,
  repositoryLivrosEmprestados,
  repositoryLivrosPorAutor,
  repositoryEmprestimosPorLivro,
  repositoryClientesComEmprestimosAtivos,
} from "../repositories/relatoriosRepository";
import {
  LivroDisponivelRow,
  LivroEmprestadoRow,
  LivrosPorAutorRow,
  EmprestimosPorLivroRow,
  ClienteEmprestimoAtivoRow,
} from "../models/interfaces/RelatorioInterface";

export async function ServiceLivrosDisponiveis(): Promise<{ livros: LivroDisponivelRow[]; vazio: boolean }> {
  const livros = await repositoryLivrosDisponiveis();
  return { livros, vazio: livros.length === 0 };
}

export async function ServiceLivrosEmprestados(): Promise<{ livros: LivroEmprestadoRow[]; vazio: boolean }> {
  const livros = await repositoryLivrosEmprestados();
  return { livros, vazio: livros.length === 0 };
}

export async function ServiceLivrosPorAutor(): Promise<{ autores: LivrosPorAutorRow[]; vazio: boolean }> {
  const autores = await repositoryLivrosPorAutor();
  return { autores, vazio: autores.length === 0 };
}

export async function ServiceEmprestimosPorLivro(): Promise<{ livros: EmprestimosPorLivroRow[]; vazio: boolean }> {
  const livros = await repositoryEmprestimosPorLivro();
  return { livros, vazio: livros.length === 0 };
}

export async function ServiceClientesComEmprestimosAtivos(): Promise<{ clientes: ClienteEmprestimoAtivoRow[]; vazio: boolean }> {
  const clientes = await repositoryClientesComEmprestimosAtivos();
  return { clientes, vazio: clientes.length === 0 };
}
