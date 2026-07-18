import { repositoryCadastraLivro, repositoryBuscarPorTitulo, repositoryListarLivros, repositoryBuscarPorId, repositoryAtualizarLivro, repositoryRemoverLivro } from "../repositories/livroRepository";
import { repositoryBuscarPorId as repositoryBuscarAutorPorId } from "../repositories/autorRepository";

import { Livro } from "../models/classes/Livro";
import { validarId } from "../utils/validators";

export async function ServiceCadastraLivro(
  titulo: string,
  ano_publicacao: string,
  genero: string,
  autor_id: number,
  quantidade: string
): Promise<Livro> {
  if (!titulo || titulo.trim().length === 0) {
    throw new Error("Título é obrigatório.");
  }

  validarId(autor_id, "ID do autor");

  const autorExistente = await repositoryBuscarAutorPorId(autor_id);
  if (!autorExistente) {
    throw new Error("Autor não encontrado. Cadastre o autor antes de vincular um livro.");
  }

  const tituloTratado = titulo.trim();
  const generoTratado = genero?.trim() || null;
  const anoTratado = ano_publicacao?.trim() || null;

  if (anoTratado && !/^\d{4}$/.test(anoTratado)) {
    throw new Error("Ano de publicação deve ter 4 dígitos.");
  }

  const quantidadeTratada = quantidade?.trim() || null;
  const qtd = Number(quantidadeTratada);
  if (!qtd || qtd < 1 || !Number.isInteger(qtd)) {
    throw new Error("Quantidade deve ser um número inteiro positivo.");
  }

  const livroExistente = await repositoryBuscarPorTitulo(tituloTratado);

  if (livroExistente) {
    throw new Error("Já existe um livro cadastrado com este título.");
  }

  const row = await repositoryCadastraLivro(tituloTratado, anoTratado ? Number(anoTratado) : null, generoTratado, autor_id, qtd);
  return new Livro(row.id, row.titulo, row.ano_publicacao, row.genero, row.autor_id, row.quantidade);
}

export async function ServiceListarLivros(): Promise<{
  livros: Livro[];
  vazio: boolean;
}> {
  const rows = await repositoryListarLivros();

  return {
    livros: rows.map(row => new Livro(row.id, row.titulo, row.ano_publicacao, row.genero, row.autor_id, row.quantidade)),
    vazio: rows.length === 0,
  };
}

export async function ServiceConsultarLivro(
  id: number
): Promise<Livro | null> {
  validarId(id);

  const row = await repositoryBuscarPorId(id);
  return row ? new Livro(row.id, row.titulo, row.ano_publicacao, row.genero, row.autor_id, row.quantidade) : null;
}

export async function ServiceAtualizarLivro(
  id: number,
  titulo: string,
  ano_publicacao: string,
  genero: string,
  autor_id: number,
  quantidade: string
): Promise<Livro> {
  validarId(id);

  const livroAtual = await repositoryBuscarPorId(id);
  if (!livroAtual) {
    throw new Error("Livro não encontrado.");
  }

  if (!titulo || titulo.trim().length === 0) {
    throw new Error("Título é obrigatório.");
  }

  validarId(autor_id, "ID do autor");

  const autorExistente = await repositoryBuscarAutorPorId(autor_id);
  if (!autorExistente) {
    throw new Error("Autor não encontrado.");
  }

  const tituloTratado = titulo.trim();
  const generoTratado = genero?.trim() || null;
  const anoTratado = ano_publicacao?.trim() || null;

  if (anoTratado && !/^\d{4}$/.test(anoTratado)) {
    throw new Error("Ano de publicação deve ter 4 dígitos.");
  }

  const quantidadeTratada = quantidade?.trim() || null;
  const qtd = Number(quantidadeTratada);
  if (!qtd || qtd < 1 || !Number.isInteger(qtd)) {
    throw new Error("Quantidade deve ser um número inteiro positivo.");
  }

  const livroExistente = await repositoryBuscarPorTitulo(tituloTratado);
  if (livroExistente && livroExistente.id !== id) {
    throw new Error("Já existe outro livro cadastrado com este título.");
  }

  const row = await repositoryAtualizarLivro(id, tituloTratado, anoTratado ? Number(anoTratado) : null, generoTratado, autor_id, qtd);

  if (!row) {
    throw new Error("Erro ao atualizar livro.");
  }

  return new Livro(row.id, row.titulo, row.ano_publicacao, row.genero, row.autor_id, row.quantidade);
}

export async function ServiceRemoverLivro(
  id: number
): Promise<void> {
  validarId(id);

  const livro = await repositoryBuscarPorId(id);
  if (!livro) {
    throw new Error("Livro não encontrado.");
  }

  const removido = await repositoryRemoverLivro(id);

  if (!removido) {
    throw new Error("Erro ao remover livro.");
  }
}
