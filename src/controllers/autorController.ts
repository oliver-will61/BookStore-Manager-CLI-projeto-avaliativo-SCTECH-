// Importa os services que contém as regras de negócio para cadastrar e listar autores
import { ServiceCadastraAutor, ServiceListarAutores, ServiceConsultarAutor, ServiceAtualizarAutor } from "../services/autorService";
// Importa a interface AutorRow para tipar o retorno opcional
import {AutorRow} from "../models/interfaces/AutorInterface"


// Função que orquestra o cadastro de um autor, chamada pelo menu
export async function controllerCadastraAutor(
  nome: string, // Nome recebido do formulário no menu
  nacionalidade: string, // Nacionalidade recebida do formulário
  dataNascimento: string // Data de nascimento recebida do formulário
): Promise<{ sucesso: boolean; mensagem: string; autor?: AutorRow }> {
  // Tenta executar o fluxo de cadastro
  try {
    // Chama o service que valida os dados e persiste no banco
    const autor = await ServiceCadastraAutor(nome, nacionalidade, dataNascimento);
    // Se chegou aqui, o cadastro foi bem-sucedido — retorna sucesso com dados do autor
    return {
      sucesso: true,
      mensagem: `Autor cadastrado com sucesso! ID: ${autor.id}`, // Mensagem exibida no menu
      autor, // Objeto completo do autor cadastrado (inclui o id gerado)
    };
  } catch (error) { // Captura qualquer erro lançado pelo service (validação ou banco)
    const mensagem = // Define a mensagem de erro
      error instanceof Error // Verifica se o erro é uma instância da classe Error
        ? error.message // Se for, extrai a mensagem do objeto Error
        : "Erro inesperado ao cadastrar autor."; // Se não for, usa mensagem genérica
    return { sucesso: false, mensagem }; // Retorna objeto com sucesso false e a mensagem de erro para o menu
  }
}

// Função que orquestra a listagem de autores, chamada pelo menu
export async function controllerListarAutores(): Promise<{
  sucesso: boolean;
  mensagem: string;
  autores?: AutorRow[];
}> {
  // Tenta executar o fluxo de listagem
  try {
    // Chama o service que busca os autores no banco
    const { autores, vazio } = await ServiceListarAutores();

    if (vazio) {
      // Se não há autores cadastrados, retorna mensagem específica
      return {
        sucesso: true,
        mensagem: "Nenhum autor cadastrado.",
        autores,
      };
    }

    // Se encontrou autores, retorna sucesso com a lista
    return {
      sucesso: true,
      mensagem: `${autores.length} autor(es) encontrado(s).`,
      autores,
    };
  } catch (error) { // Captura qualquer erro lançado pelo service
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao listar autores.";
    return { sucesso: false, mensagem };
  }
}

// Função que orquestra a consulta de um autor por ID, chamada pelo menu
export async function controllerConsultarAutor(
  id: number // ID do autor informado no menu
): Promise<{ sucesso: boolean; mensagem: string; autor?: AutorRow }> {
  // Tenta executar o fluxo de consulta
  try {
    // Chama o service que valida o ID e busca o autor no banco
    const autor = await ServiceConsultarAutor(id);

    if (!autor) {
      // Se não encontrou o autor, retorna mensagem específica
      return {
        sucesso: true,
        mensagem: "Autor não encontrado.",
      };
    }

    // Se encontrou, retorna sucesso com os dados completos do autor
    return {
      sucesso: true,
      mensagem: "Autor encontrado.",
      autor,
    };
  } catch (error) { // Captura qualquer erro lançado pelo service (validação ou banco)
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao consultar autor.";
    return { sucesso: false, mensagem };
  }
}

// Função que orquestra a atualização de um autor, chamada pelo menu
export async function controllerAtualizarAutor(
  id: number,
  nome: string,
  nacionalidade: string,
  dataNascimento: string
): Promise<{ sucesso: boolean; mensagem: string; autor?: AutorRow }> {
  try {
    const autor = await ServiceAtualizarAutor(id, nome, nacionalidade, dataNascimento);
    return {
      sucesso: true,
      mensagem: `Autor atualizado com sucesso! ID: ${autor.id}`,
      autor,
    };
  } catch (error) {
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao atualizar autor.";
    return { sucesso: false, mensagem };
  }
}
