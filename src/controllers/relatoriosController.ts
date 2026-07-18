import {
  ServiceLivrosDisponiveis,
  ServiceLivrosEmprestados,
  ServiceLivrosPorAutor,
  ServiceEmprestimosPorLivro,
  ServiceClientesComEmprestimosAtivos,
} from "../services/relatoriosService";

export async function controllerLivrosDisponiveis() {
  try {
    const { livros, vazio } = await ServiceLivrosDisponiveis();

    if (vazio) {
      return { sucesso: true, mensagem: "Nenhum livro disponível no momento.", livros };
    }

    return { sucesso: true, mensagem: `${livros.length} livro(s) disponível(is).`, livros };
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro inesperado.";
    return { sucesso: false, mensagem };
  }
}

export async function controllerLivrosEmprestados() {
  try {
    const { livros, vazio } = await ServiceLivrosEmprestados();

    if (vazio) {
      return { sucesso: true, mensagem: "Nenhum livro emprestado no momento.", livros };
    }

    return { sucesso: true, mensagem: `${livros.length} livro(s) com empréstimos ativos.`, livros };
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro inesperado.";
    return { sucesso: false, mensagem };
  }
}

export async function controllerLivrosPorAutor() {
  try {
    const { autores, vazio } = await ServiceLivrosPorAutor();

    if (vazio) {
      return { sucesso: true, mensagem: "Nenhum autor cadastrado.", autores };
    }

    return { sucesso: true, mensagem: `${autores.length} autor(es) encontrado(s).`, autores };
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro inesperado.";
    return { sucesso: false, mensagem };
  }
}

export async function controllerEmprestimosPorLivro() {
  try {
    const { livros, vazio } = await ServiceEmprestimosPorLivro();

    if (vazio) {
      return { sucesso: true, mensagem: "Nenhum livro cadastrado.", livros };
    }

    return { sucesso: true, mensagem: `${livros.length} livro(s) encontrado(s).`, livros };
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro inesperado.";
    return { sucesso: false, mensagem };
  }
}

export async function controllerClientesComEmprestimosAtivos() {
  try {
    const { clientes, vazio } = await ServiceClientesComEmprestimosAtivos();

    if (vazio) {
      return { sucesso: true, mensagem: "Nenhum cliente com empréstimos ativos.", clientes };
    }

    return { sucesso: true, mensagem: `${clientes.length} cliente(s) com empréstimos ativos.`, clientes };
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Erro inesperado.";
    return { sucesso: false, mensagem };
  }
}
