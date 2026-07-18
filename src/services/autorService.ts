// Importa as funções do repository para cadastrar e buscar autor
import { repositoryCadastraAutor, repositoryBuscarPorNome, repositoryListarAutores, repositoryBuscarPorId, repositoryAtualizarAutor, repositoryRemoverAutor } from "../repositories/autorRepository";

import { Autor } from "../models/classes/Autor";
import { validarId } from "../utils/validators";

// Função que contém as regras de negócio para cadastrar um autor
export async function ServiceCadastraAutor(
  nome: string,
  nacionalidade: string, 
  dataNascimento: string 
): Promise<Autor> {
  if (!nome || nome.trim().length === 0) {
    throw new Error("Nome é obrigatório.");
  }

  const nacionalidadeTratada = nacionalidade?.trim() || null;
  const dataTratada = dataNascimento?.trim() || null;

  if (dataTratada && !/^\d{4}-\d{2}-\d{2}$/.test(dataTratada)) {
    throw new Error("Data deve estar no formato AAAA-MM-DD.");
  }

  const autorExistente = await repositoryBuscarPorNome(nome.trim());

  if (autorExistente) {
    throw new Error("Já existe um autor cadastrado com este nome.");
  }

  const row = await repositoryCadastraAutor(nome.trim(), nacionalidadeTratada, dataTratada);
  return Autor.fromRow(row);
}

// Função que contém as regras de negócio para listar autores
export async function ServiceListarAutores(): Promise<{
  autores: Autor[];
  vazio: boolean;
}> {
  const rows = await repositoryListarAutores();

  return {
    autores: rows.map(row => Autor.fromRow(row)),
    vazio: rows.length === 0,
  };
}

// Função que contém as regras de negócio para consultar um autor por ID
export async function ServiceConsultarAutor(
  id: number // ID do autor a consultar
): Promise<Autor | null> {
  validarId(id);

  const row = await repositoryBuscarPorId(id);
  return row ? Autor.fromRow(row) : null;
}

export async function ServiceAtualizarAutor(
  id: number,
  nome: string,
  nacionalidade: string,
  dataNascimento: string
): Promise<Autor> {
  validarId(id);

  const autorAtual = await repositoryBuscarPorId(id);
  if (!autorAtual) {
    throw new Error("Autor não encontrado.");
  }

  if (!nome || nome.trim().length === 0) {
    throw new Error("Nome é obrigatório.");
  }

  const nomeTratado = nome.trim();
  const nacionalidadeTratada = nacionalidade?.trim() || null;
  const dataTratada = dataNascimento?.trim() || null;

  if (dataTratada && !/^\d{4}-\d{2}-\d{2}$/.test(dataTratada)) {
    throw new Error("Data deve estar no formato AAAA-MM-DD.");
  }

  const autorExistente = await repositoryBuscarPorNome(nomeTratado);
  if (autorExistente && autorExistente.id !== id) {
    throw new Error("Já existe outro autor cadastrado com este nome.");
  }

  const row = await repositoryAtualizarAutor(id, nomeTratado, nacionalidadeTratada, dataTratada);

  if (!row) {
    throw new Error("Erro ao atualizar autor.");
  }

  return Autor.fromRow(row);
}

// Função que contém as regras de negócio para remover um autor
export async function ServiceRemoverAutor(
  id: number // ID do autor a remover
): Promise<void> {
  // Valida se o ID é um número positivo
  validarId(id);

  const autor = await repositoryBuscarPorId(id);
  if (!autor) {
    throw new Error("Autor não encontrado.");
  }

  // Chama o repository para remover o autor
  const removido = await repositoryRemoverAutor(id);

  if (!removido) {
    throw new Error("Erro ao remover autor.");
  }
}
