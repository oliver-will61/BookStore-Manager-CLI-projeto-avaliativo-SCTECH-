import {
  ServiceLivrosDisponiveis,
  ServiceLivrosEmprestados,
  ServiceLivrosPorAutor,
  ServiceEmprestimosPorLivro,
  ServiceClientesComEmprestimosAtivos,
} from "../services/relatoriosService";
import { extrairMensagemErro } from "../utils/validators";
import {
  LivroDisponivelRow,
  LivroEmprestadoRow,
  LivrosPorAutorRow,
  EmprestimosPorLivroRow,
  ClienteEmprestimoAtivoRow,
} from "../models/interfaces/RelatorioInterface";

export async function controllerLivrosDisponiveis(): Promise<{ sucesso: boolean; mensagem: string; livros?: LivroDisponivelRow[] }> {
  try {
    const { livros, vazio } = await ServiceLivrosDisponiveis();

    if (vazio) {
      return { sucesso: true, mensagem: "Nenhum livro disponível no momento.", livros };
    }

    return { sucesso: true, mensagem: `${livros.length} livro(s) disponível(is).`, livros };
  } catch (error) {
    const mensagem = extrairMensagemErro(error);
    return { sucesso: false, mensagem };
  }
}

export async function controllerLivrosEmprestados(): Promise<{ sucesso: boolean; mensagem: string; livros?: LivroEmprestadoRow[] }> {
  try {
    const { livros, vazio } = await ServiceLivrosEmprestados();

    if (vazio) {
      return { sucesso: true, mensagem: "Nenhum livro emprestado no momento.", livros };
    }

    return { sucesso: true, mensagem: `${livros.length} livro(s) com empréstimos ativos.`, livros };
  } catch (error) {
    const mensagem = extrairMensagemErro(error);
    return { sucesso: false, mensagem };
  }
}

export async function controllerLivrosPorAutor(): Promise<{ sucesso: boolean; mensagem: string; autores?: LivrosPorAutorRow[] }> {
  try {
    const { autores, vazio } = await ServiceLivrosPorAutor();

    if (vazio) {
      return { sucesso: true, mensagem: "Nenhum autor cadastrado.", autores };
    }

    return { sucesso: true, mensagem: `${autores.length} autor(es) encontrado(s).`, autores };
  } catch (error) {
    const mensagem = extrairMensagemErro(error);
    return { sucesso: false, mensagem };
  }
}

export async function controllerEmprestimosPorLivro(): Promise<{ sucesso: boolean; mensagem: string; livros?: EmprestimosPorLivroRow[] }> {
  try {
    const { livros, vazio } = await ServiceEmprestimosPorLivro();

    if (vazio) {
      return { sucesso: true, mensagem: "Nenhum livro cadastrado.", livros };
    }

    return { sucesso: true, mensagem: `${livros.length} livro(s) encontrado(s).`, livros };
  } catch (error) {
    const mensagem = extrairMensagemErro(error);
    return { sucesso: false, mensagem };
  }
}

export async function controllerClientesComEmprestimosAtivos(): Promise<{ sucesso: boolean; mensagem: string; clientes?: ClienteEmprestimoAtivoRow[] }> {
  try {
    const { clientes, vazio } = await ServiceClientesComEmprestimosAtivos();

    if (vazio) {
      return { sucesso: true, mensagem: "Nenhum cliente com empréstimos ativos.", clientes };
    }

    return { sucesso: true, mensagem: `${clientes.length} cliente(s) com empréstimos ativos.`, clientes };
  } catch (error) {
    const mensagem = extrairMensagemErro(error);
    return { sucesso: false, mensagem };
  }
}
