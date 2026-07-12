// Importa a classe genérica BaseRepository, responsável por executar SQL no banco
import { BaseRepository } from "../models/classes/BaseRepository";
import {AutorRow} from "../models/interfaces/AutorInterface"

// Função responsável por inserir um autor no banco, chamada pelo service
export async function repositoryCadastraAutor(
  nome: string, //nome tratado
  nacionalidade: string | null,  //nacionalidade tratada
  dataNascimento: string | null  //dataNascimento tratada
): Promise<AutorRow> {
  // Chama o método genérico insert do BaseRepository, passando a tabela "autores" e os dados
  // O retorno é um Record<string, unknown>, então fazemos cast duplo (as unknown as AutorRow)
  // para que o TypeScript reconheça o tipo correto sem reclamar
  return (await BaseRepository.insert("autores", {
    nome, // Coluna "nome" no banco recebe o valor do parâmetro
    nacionalidade, // Coluna "nacionalidade" no banco
    data_nascimento: dataNascimento, // Coluna "data_nascimento" no banco
  })) as unknown as AutorRow;
}
