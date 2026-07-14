import { repositoryCadastraLivro, repositoryBuscarPorTitulo, repositoryListarLivros, repositoryBuscarPorId, repositoryAtualizarLivro, repositoryRemoverLivro } from "../repositories/livroRepository";
import { repositoryBuscarPorId as repositoryBuscarAutorPorId } from "../repositories/autorRepository";

import { LivroRow } from "../models/interfaces/LivroInterface";

export async function ServiceCadastraLivro(
  titulo: string,
  ano_publicacao: string,
  genero: string,
  autor_id: number
): Promise<LivroRow> {
  if (!titulo || titulo.trim().length === 0) {
    throw new Error("Título é obrigatório.");
  }

  if (!autor_id || autor_id <= 0) {
    throw new Error("ID do autor inválido.");
  }

  const autorExistente = await repositoryBuscarAutorPorId(autor_id);
  if (!autorExistente) {
    throw new Error("Autor não encontrado. Cadastre o autor antes de vincular um livro.");
  }

  const tituloTratado = titulo.trim();
  const generoTratado = genero?.trim() || null;
  const anoTradado = ano_publicacao?.trim() || null;

  if (anoTradado && !/^\d{4}$/.test(anoTradado)) {
    throw new Error("Ano de publicação deve ter 4 dígitos.");
  }

  const livroExistente = await repositoryBuscarPorTitulo(tituloTratado);

  if (livroExistente) {
    throw new Error("Já existe um livro cadastrado com este título.");
  }

  return await repositoryCadastraLivro(
    tituloTratado,
    anoTradado ? Number(anoTradado) : null,
    generoTratado,
    autor_id
  );
}

export async function ServiceListarLivros(): Promise<{
  livros: LivroRow[];
  vazio: boolean;
}> {
  const livros = await repositoryListarLivros();

  return {
    livros,
    vazio: livros.length === 0,
  };
}

export async function ServiceConsultarLivro(
  id: number
): Promise<LivroRow | null> {
  if (!id || id <= 0) {
    throw new Error("ID inválido.");
  }

  return await repositoryBuscarPorId(id);
}

export async function ServiceAtualizarLivro(
  id: number,
  titulo: string,
  ano_publicacao: string,
  genero: string,
  autor_id: number
): Promise<LivroRow> {
  if (!id || id <= 0) {
    throw new Error("ID inválido.");
  }

  const livroAtual = await repositoryBuscarPorId(id);
  if (!livroAtual) {
    throw new Error("Livro não encontrado.");
  }

  if (!titulo || titulo.trim().length === 0) {
    throw new Error("Título é obrigatório.");
  }

  if (!autor_id || autor_id <= 0) {
    throw new Error("ID do autor inválido.");
  }

  const autorExistente = await repositoryBuscarAutorPorId(autor_id);
  if (!autorExistente) {
    throw new Error("Autor não encontrado.");
  }

  const tituloTratado = titulo.trim();
  const generoTratado = genero?.trim() || null;
  const anoTradado = ano_publicacao?.trim() || null;

  if (anoTradado && !/^\d{4}$/.test(anoTradado)) {
    throw new Error("Ano de publicação deve ter 4 dígitos.");
  }

  const livroExistente = await repositoryBuscarPorTitulo(tituloTratado);
  if (livroExistente && livroExistente.id !== id) {
    throw new Error("Já existe outro livro cadastrado com este título.");
  }

  const livroAtualizado = await repositoryAtualizarLivro(
    id,
    tituloTratado,
    anoTradado ? Number(anoTradado) : null,
    generoTratado,
    autor_id
  );

  if (!livroAtualizado) {
    throw new Error("Erro ao atualizar livro.");
  }

  return livroAtualizado;
}

export async function ServiceRemoverLivro(
  id: number
): Promise<void> {
  if (!id || id <= 0) {
    throw new Error("ID inválido.");
  }

  const livro = await repositoryBuscarPorId(id);
  if (!livro) {
    throw new Error("Livro não encontrado.");
  }

  const removido = await repositoryRemoverLivro(id);

  if (!removido) {
    throw new Error("Erro ao remover livro.");
  }
}
