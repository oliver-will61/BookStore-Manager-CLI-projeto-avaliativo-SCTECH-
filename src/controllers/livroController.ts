import { ServiceCadastraLivro, ServiceListarLivros, ServiceConsultarLivro, ServiceAtualizarLivro, ServiceRemoverLivro } from "../services/livroService";
import { LivroRow } from "../models/interfaces/LivroInterface";

export async function controllerCadastraLivro(
  titulo: string,
  ano_publicacao: string,
  genero: string,
  autor_id: number,
  quantidade: string
): Promise<{ sucesso: boolean; mensagem: string; livro?: LivroRow }> {
  try {
    const livro = await ServiceCadastraLivro(titulo, ano_publicacao, genero, autor_id, quantidade);
    return {
      sucesso: true,
      mensagem: `Livro cadastrado com sucesso! ID: ${livro.id}`,
      livro,
    };
  } catch (error) {
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao cadastrar livro.";
    return { sucesso: false, mensagem };
  }
}

export async function controllerListarLivros(): Promise<{
  sucesso: boolean;
  mensagem: string;
  livros?: LivroRow[];
}> {
  try {
    const { livros, vazio } = await ServiceListarLivros();

    if (vazio) {
      return {
        sucesso: true,
        mensagem: "Nenhum livro cadastrado.",
        livros,
      };
    }

    return {
      sucesso: true,
      mensagem: `${livros.length} livro(s) encontrado(s).`,
      livros,
    };
  } catch (error) {
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao listar livros.";
    return { sucesso: false, mensagem };
  }
}

export async function controllerConsultarLivro(
  id: number
): Promise<{ sucesso: boolean; mensagem: string; livro?: LivroRow }> {
  try {
    const livro = await ServiceConsultarLivro(id);

    if (!livro) {
      return {
        sucesso: true,
        mensagem: "Livro não encontrado.",
      };
    }

    return {
      sucesso: true,
      mensagem: "Livro encontrado.",
      livro,
    };
  } catch (error) {
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao consultar livro.";
    return { sucesso: false, mensagem };
  }
}

export async function controllerAtualizarLivro(
  id: number,
  titulo: string,
  ano_publicacao: string,
  genero: string,
  autor_id: number,
  quantidade: string
): Promise<{ sucesso: boolean; mensagem: string; livro?: LivroRow }> {
  try {
    const livro = await ServiceAtualizarLivro(id, titulo, ano_publicacao, genero, autor_id, quantidade);
    return {
      sucesso: true,
      mensagem: `Livro atualizado com sucesso! ID: ${livro.id}`,
      livro,
    };
  } catch (error) {
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao atualizar livro.";
    return { sucesso: false, mensagem };
  }
}

export async function controllerRemoverLivro(
  id: number
): Promise<{ sucesso: boolean; mensagem: string }> {
  try {
    await ServiceRemoverLivro(id);
    return {
      sucesso: true,
      mensagem: "Livro removido com sucesso!",
    };
  } catch (error) {
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao remover livro.";
    return { sucesso: false, mensagem };
  }
}
