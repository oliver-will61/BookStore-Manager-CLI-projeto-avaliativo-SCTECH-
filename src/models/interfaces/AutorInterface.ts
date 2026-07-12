export interface autorInterface {
    nome: string,
    nacionalidade: string,
    dataNascimento: Date
}

// Interface que define a estrutura dos dados de um autor vindos do banco
export interface AutorRow {
  id: number; 
  nome: string; 
  nacionalidade: string | null; 
  data_nascimento: string | null;
}