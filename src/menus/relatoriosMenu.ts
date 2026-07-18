import { Menu } from "./menu";
import {
  controllerLivrosDisponiveis,
  controllerLivrosEmprestados,
  controllerLivrosPorAutor,
  controllerEmprestimosPorLivro,
  controllerClientesComEmprestimosAtivos,
} from "../controllers/relatoriosController";

export class RelatoriosMenu extends Menu {
  protected title = "Relatórios";

  protected options = [
    {
      label: "Livros disponíveis",
      handler: async () => {
        console.clear();
        console.log("\n=== Livros Disponíveis ===\n");

        const resultado = await controllerLivrosDisponiveis();

        if (!resultado.sucesso) {
          console.log(resultado.mensagem);
        } else if (resultado.livros && resultado.livros.length > 0) {
          for (const l of resultado.livros) {
            console.log(
              `ID: ${l.id} | Título: ${l.titulo} | Autor: ${l.autor_nome} | Exemplares: ${l.quantidade} | Disponíveis: ${l.disponiveis}`
            );
          }
          console.log(`\n${resultado.mensagem}`);
        } else {
          console.log(resultado.mensagem);
        }

        await this.question("\nPressione Enter para voltar...");
      },
    },
    {
      label: "Livros emprestados",
      handler: async () => {
        console.clear();
        console.log("\n=== Livros Emprestados ===\n");

        const resultado = await controllerLivrosEmprestados();

        if (!resultado.sucesso) {
          console.log(resultado.mensagem);
        } else if (resultado.livros && resultado.livros.length > 0) {
          for (const l of resultado.livros) {
            console.log(
              `ID: ${l.id} | Título: ${l.titulo} | Autor: ${l.autor_nome} | Exemplares: ${l.quantidade} | Emprestados: ${l.emprestados}`
            );
          }
          console.log(`\n${resultado.mensagem}`);
        } else {
          console.log(resultado.mensagem);
        }

        await this.question("\nPressione Enter para voltar...");
      },
    },
    {
      label: "Livros cadastrados por autor",
      handler: async () => {
        console.clear();
        console.log("\n=== Livros por Autor ===\n");

        const resultado = await controllerLivrosPorAutor();

        if (!resultado.sucesso) {
          console.log(resultado.mensagem);
        } else if (resultado.autores && resultado.autores.length > 0) {
          for (const a of resultado.autores) {
            console.log(
              `Autor: ${a.autor_nome} | Total de livros: ${a.total_livros}`
            );
          }
          console.log(`\n${resultado.mensagem}`);
        } else {
          console.log(resultado.mensagem);
        }

        await this.question("\nPressione Enter para voltar...");
      },
    },
    {
      label: "Quantidade de empréstimos por livro",
      handler: async () => {
        console.clear();
        console.log("\n=== Empréstimos por Livro ===\n");

        const resultado = await controllerEmprestimosPorLivro();

        if (!resultado.sucesso) {
          console.log(resultado.mensagem);
        } else if (resultado.livros && resultado.livros.length > 0) {
          for (const l of resultado.livros) {
            console.log(
              `ID: ${l.id} | Título: ${l.titulo} | Autor: ${l.autor_nome} | Empréstimos: ${l.total_emprestimos}`
            );
          }
          console.log(`\n${resultado.mensagem}`);
        } else {
          console.log(resultado.mensagem);
        }

        await this.question("\nPressione Enter para voltar...");
      },
    },
    {
      label: "Clientes com empréstimos ativos",
      handler: async () => {
        console.clear();
        console.log("\n=== Clientes com Empréstimos Ativos ===\n");

        const resultado = await controllerClientesComEmprestimosAtivos();

        if (!resultado.sucesso) {
          console.log(resultado.mensagem);
        } else if (resultado.clientes && resultado.clientes.length > 0) {
          for (const c of resultado.clientes) {
            console.log(
              `ID: ${c.id} | Nome: ${c.nome} | Email: ${c.email} | Telefone: ${c.telefone ?? "-"} | Empréstimos ativos: ${c.emprestimos_ativos}`
            );
          }
          console.log(`\n${resultado.mensagem}`);
        } else {
          console.log(resultado.mensagem);
        }

        await this.question("\nPressione Enter para voltar...");
      },
    },
    {
      label: "Voltar",
      handler: async () => {},
    },
  ];
}
