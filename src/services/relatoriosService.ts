import {
  repositoryLivrosDisponiveis,
  repositoryLivrosEmprestados,
  repositoryLivrosPorAutor,
  repositoryEmprestimosPorLivro,
  repositoryClientesComEmprestimosAtivos,
} from "../repositories/relatoriosRepository";

export async function ServiceLivrosDisponiveis() {
  const livros = await repositoryLivrosDisponiveis();
  return { livros, vazio: livros.length === 0 };
}

export async function ServiceLivrosEmprestados() {
  const livros = await repositoryLivrosEmprestados();
  return { livros, vazio: livros.length === 0 };
}

export async function ServiceLivrosPorAutor() {
  const autores = await repositoryLivrosPorAutor();
  return { autores, vazio: autores.length === 0 };
}

export async function ServiceEmprestimosPorLivro() {
  const livros = await repositoryEmprestimosPorLivro();
  return { livros, vazio: livros.length === 0 };
}

export async function ServiceClientesComEmprestimosAtivos() {
  const clientes = await repositoryClientesComEmprestimosAtivos();
  return { clientes, vazio: clientes.length === 0 };
}
