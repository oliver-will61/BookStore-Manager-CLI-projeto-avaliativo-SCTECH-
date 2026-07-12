// Importa o service que contém as regras de negócio para cadastrar autor
import { ServiceCadastraAutor } from "../services/autorService";
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
