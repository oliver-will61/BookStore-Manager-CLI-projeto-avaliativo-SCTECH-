import { BaseRepository } from "../models/classes/BaseRepository";
import { LivroRow } from "../models/interfaces/LivroInterface";

export async function repositoryRemoverLivro(
  id: number
): Promise<boolean> {
  return await BaseRepository.delete("livros", id);
}

export async function repositoryBuscarPorTitulo(
  titulo: string
): Promise<LivroRow | null> {
  return (await BaseRepository.findBy("livros", "titulo", titulo)) as unknown as LivroRow | null;
}

export async function repositoryBuscarPorId(
  id: number
): Promise<LivroRow | null> {
  return (await BaseRepository.findById("livros", id)) as unknown as LivroRow | null;
}

export async function repositoryListarLivros(): Promise<LivroRow[]> {
  return (await BaseRepository.findAll("livros")) as unknown as LivroRow[];
}

export async function repositoryAtualizarLivro(
  id: number,
  titulo: string,
  ano_publicacao: number | null,
  genero: string | null,
  autor_id: number,
  quantidade: number
): Promise<LivroRow | null> {
  return (await BaseRepository.update("livros", id, {
    titulo,
    ano_publicacao,
    genero,
    autor_id,
    quantidade,
  })) as unknown as LivroRow | null;
}

export async function repositoryCadastraLivro(
  titulo: string,
  ano_publicacao: number | null,
  genero: string | null,
  autor_id: number,
  quantidade: number
): Promise<LivroRow> {
  return (await BaseRepository.insert("livros", {
    titulo,
    ano_publicacao,
    genero,
    autor_id,
    quantidade,
  })) as unknown as LivroRow;
}
