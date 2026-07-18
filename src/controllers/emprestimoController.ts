import {
  ServiceCadastraEmprestimo,
  ServiceListarEmprestimos,
  ServiceConsultarEmprestimo,
  ServiceDevolverLivro,
  ServiceListarLivrosComDisponivel,
} from "../services/emprestimoService";
import { Emprestimo } from "../models/classes/Emprestimo";
import { EmprestimoCompletoRow } from "../models/interfaces/EmprestimoInterface";
import { extrairMensagemErro } from "../utils/validators";

export async function controllerCadastraEmprestimo(
  cliente_id: number,
  livro_id: number
): Promise<{ sucesso: boolean; mensagem: string; emprestimo?: Emprestimo }> {
  try {
    const emprestimo = await ServiceCadastraEmprestimo(cliente_id, livro_id);
    return {
      sucesso: true,
      mensagem: `Empréstimo registrado com sucesso! ID: ${emprestimo.id}`,
      emprestimo,
    };
  } catch (error) {
    const mensagem = extrairMensagemErro(error, "Erro inesperado ao registrar empréstimo.");
    return { sucesso: false, mensagem };
  }
}

export async function controllerListarEmprestimos(): Promise<{
  sucesso: boolean;
  mensagem: string;
  emprestimos?: EmprestimoCompletoRow[];
}> {
  try {
    const { emprestimos, vazio } = await ServiceListarEmprestimos();

    if (vazio) {
      return {
        sucesso: true,
        mensagem: "Nenhum empréstimo registrado.",
        emprestimos,
      };
    }

    return {
      sucesso: true,
      mensagem: `${emprestimos.length} empréstimo(s) encontrado(s).`,
      emprestimos,
    };
  } catch (error) {
    const mensagem = extrairMensagemErro(error, "Erro inesperado ao listar empréstimos.");
    return { sucesso: false, mensagem };
  }
}

export async function controllerConsultarEmprestimo(
  id: number
): Promise<{ sucesso: boolean; mensagem: string; emprestimo?: EmprestimoCompletoRow }> {
  try {
    const emprestimo = await ServiceConsultarEmprestimo(id);

    if (!emprestimo) {
      return {
        sucesso: true,
        mensagem: "Empréstimo não encontrado.",
      };
    }

    return {
      sucesso: true,
      mensagem: "Empréstimo encontrado.",
      emprestimo,
    };
  } catch (error) {
    const mensagem = extrairMensagemErro(error, "Erro inesperado ao consultar empréstimo.");
    return { sucesso: false, mensagem };
  }
}

export async function controllerListarLivrosComDisponivel(): Promise<{
  sucesso: boolean;
  mensagem: string;
  livros?: { id: number; titulo: string; disponiveis: number }[];
}> {
  try {
    const livros = await ServiceListarLivrosComDisponivel();

    if (livros.length === 0) {
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
    const mensagem = extrairMensagemErro(error, "Erro inesperado ao listar livros.");
    return { sucesso: false, mensagem };
  }
}

export async function controllerDevolverLivro(
  id: number
): Promise<{ sucesso: boolean; mensagem: string; emprestimo?: Emprestimo }> {
  try {
    const emprestimo = await ServiceDevolverLivro(id);
    return {
      sucesso: true,
      mensagem: `Livro devolvido com sucesso! ID: ${emprestimo.id}`,
      emprestimo,
    };
  } catch (error) {
    const mensagem = extrairMensagemErro(error, "Erro inesperado ao registrar devolução.");
    return { sucesso: false, mensagem };
  }
}
