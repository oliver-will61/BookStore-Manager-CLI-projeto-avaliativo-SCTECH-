// Importa as funções do repository para cadastrar e buscar autor
import { repositoryCadastraAutor, repositoryBuscarPorNome } from "../repositories/autorRepository";

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
