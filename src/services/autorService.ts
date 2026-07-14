// Importa as funções do repository para cadastrar e buscar autor
import { repositoryCadastraAutor, repositoryBuscarPorNome, repositoryListarAutores, repositoryBuscarPorId, repositoryAtualizarAutor, repositoryRemoverAutor } from "../repositories/autorRepository";

import {AutorRow} from "../models/interfaces/AutorInterface"

// Função que contém as regras de negócio para cadastrar um autor
export async function ServiceCadastraAutor(
  nome: string,
  nacionalidade: string, 
  dataNascimento: string 
): Promise<AutorRow> {
  // Valida se o nome foi preenchido (remove espaços antes de verificar)
  if (!nome || nome.trim().length === 0) {
    throw new Error("Nome é obrigatório."); // Lança erro se nome estiver vazio
  }

  // Se nacionalidade foi informada, remove espaços extras; senão, define como null
  const nacionalidadeTratada = nacionalidade?.trim() || null;

  // Se data foi informada, remove espaços extras; senão, define como null
  const dataTratada = dataNascimento?.trim() || null;

  // Valida o formato da data (apenas se foi informada)
  if (dataTratada && !/^\d{4}-\d{2}-\d{2}$/.test(dataTratada)) {
    // A regex exige exatamente: 4 dígitos, hífen, 2 dígitos, hífen, 2 dígitos
    throw new Error("Data deve estar no formato AAAA-MM-DD.");
  }

  // Verifica se já existe um autor com o mesmo nome no banco
  const autorExistente = await repositoryBuscarPorNome(nome.trim());

  if (autorExistente) {
    // Se encontrou um autor com o mesmo nome, lança erro para evitar duplicidade
    throw new Error("Já existe um autor cadastrado com este nome.");
  }

  // Após validações, chama o repository para persistir no banco e retorna o autor criado
  // O nome é enviado sem espaços nas bordas (trim)
  return await repositoryCadastraAutor(nome.trim(), nacionalidadeTratada, dataTratada);
}

// Função que contém as regras de negócio para listar autores
export async function ServiceListarAutores(): Promise<{
  autores: AutorRow[];
  vazio: boolean;
}> {
  // Busca todos os autores no banco
  const autores = await repositoryListarAutores();

  // Retorna a lista e um indicador se está vazia
  return {
    autores,
    vazio: autores.length === 0, //valida está vázio, se estiver vazio retorna true
  };
}

// Função que contém as regras de negócio para consultar um autor por ID
export async function ServiceConsultarAutor(
  id: number // ID do autor a consultar
): Promise<AutorRow | null> {
  // Valida se o ID é um número positivo
  if (!id || id <= 0) {
    throw new Error("ID inválido.");
  }

  // Busca o autor pelo ID no banco
  return await repositoryBuscarPorId(id);
}

// Função que contém as regras de negócio para atualizar um autor
export async function ServiceAtualizarAutor(
  id: number,
  nome: string,
  nacionalidade: string,
  dataNascimento: string
): Promise<AutorRow> {
  // Valida se o ID é um número positivo
  if (!id || id <= 0) {
    throw new Error("ID inválido.");
  }

  // Verifica se o autor existe antes de atualizar
  const autorAtual = await repositoryBuscarPorId(id);
  if (!autorAtual) {
    throw new Error("Autor não encontrado.");
  }

  // Valida se o nome foi preenchido
  if (!nome || nome.trim().length === 0) {
    throw new Error("Nome é obrigatório.");
  }

  const nomeTratado = nome.trim();
  const nacionalidadeTratada = nacionalidade?.trim() || null;
  const dataTratada = dataNascimento?.trim() || null;

  // Valida o formato da data
  if (dataTratada && !/^\d{4}-\d{2}-\d{2}$/.test(dataTratada)) {
    throw new Error("Data deve estar no formato AAAA-MM-DD.");
  }

  // Verifica se já existe outro autor com o mesmo nome (excluindo o próprio)
  const autorExistente = await repositoryBuscarPorNome(nomeTratado);
  if (autorExistente && autorExistente.id !== id) {
    throw new Error("Já existe outro autor cadastrado com este nome.");
  }

  // Chama o repository para atualizar os dados
  const autorAtualizado = await repositoryAtualizarAutor(
    id,
    nomeTratado,
    nacionalidadeTratada,
    dataTratada
  );

  if (!autorAtualizado) {
    throw new Error("Erro ao atualizar autor.");
  }

  return autorAtualizado;
}

// Função que contém as regras de negócio para remover um autor
export async function ServiceRemoverAutor(
  id: number // ID do autor a remover
): Promise<void> {
  // Valida se o ID é um número positivo
  if (!id || id <= 0) {
    throw new Error("ID inválido.");
  }

  // Verifica se o autor existe antes de remover
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
