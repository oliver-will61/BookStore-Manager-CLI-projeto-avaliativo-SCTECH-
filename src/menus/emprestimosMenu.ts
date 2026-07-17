import { Menu } from "./menu";
import {
  controllerCadastraEmprestimo,
  controllerListarEmprestimos,
  controllerConsultarEmprestimo,
  controllerDevolverLivro,
} from "../controllers/emprestimoController";
import { controllerListarClientes, controllerConsultarCliente } from "../controllers/clienteController";
import { controllerListarLivrosComDisponivel } from "../controllers/emprestimoController";
import { formatarData } from "../utils/formatDate";

export class EmprestimosMenu extends Menu {
  protected title = "Gerenciar Empréstimos";

  protected options = [
    {
      label: "Registrar empréstimo",
      handler: async () => {
        console.log("\n=== Registrar Empréstimo ===\n");

        const clientes = await controllerListarClientes();
        if (!clientes.sucesso || !clientes.clientes || clientes.clientes.length === 0) {
          console.log("Nenhum cliente cadastrado. Cadastre um cliente primeiro.\n");
          await this.question("Pressione Enter para voltar...");
          return;
        }

        console.log("Clientes disponíveis:");
        for (const c of clientes.clientes) {
          console.log(`  ID: ${c.id} | Nome: ${c.nome} | Email: ${c.email}`);
        }

        const clienteId = await this.question("\nID do cliente: ");

        const validacao = await controllerConsultarCliente(Number(clienteId));
        if (!validacao.sucesso || !validacao.cliente) {
          console.log(`\n${validacao.mensagem}`);
          await this.question("Pressione Enter para voltar...");
          return;
        }

        const livros = await controllerListarLivrosComDisponivel();
        if (!livros.sucesso || !livros.livros || livros.livros.length === 0) {
          console.log("Nenhum livro cadastrado. Cadastre um livro primeiro.\n");
          await this.question("Pressione Enter para voltar...");
          return;
        }

        console.log("\nLivros disponíveis:");
        for (const l of livros.livros) {
          console.log(`  ID: ${l.id} | Título: ${l.titulo} | Disponíveis: ${l.disponiveis}`);
        }

        const livroId = await this.question("\nID do livro: ");

        const resultado = await controllerCadastraEmprestimo(Number(clienteId), Number(livroId));
        console.log(`\n${resultado.mensagem}`);

        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Listar empréstimos",
      handler: async () => {
        console.log("\n=== Listar Empréstimos ===\n");

        const resultado = await controllerListarEmprestimos();

        if (!resultado.sucesso) {
          console.log(resultado.mensagem);
        } else if (resultado.emprestimos && resultado.emprestimos.length > 0) {
          for (const e of resultado.emprestimos) {
            const dataEmp = formatarData(e.data_emprestimo);
            const dataDev = formatarData(e.data_devolucao);
            console.log(
              `ID: ${e.id} | Cliente: ${e.cliente_nome} | Livro: ${e.livro_titulo} | Empréstimo: ${dataEmp} | Devolução: ${dataDev} | Status: ${e.status}`
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
      label: "Consultar empréstimo por ID",
      handler: async () => {
        console.log("\n=== Consultar Empréstimo por ID ===\n");

        const id = await this.question("ID do empréstimo: ");

        const resultado = await controllerConsultarEmprestimo(Number(id));

        if (!resultado.sucesso) {
          console.log(`\n${resultado.mensagem}`);
        } else if (resultado.emprestimo) {
          const dataEmp = formatarData(resultado.emprestimo.data_emprestimo);
          const dataDev = formatarData(resultado.emprestimo.data_devolucao);
          console.log(`\nID: ${resultado.emprestimo.id}`);
          console.log(`Cliente: ${resultado.emprestimo.cliente_nome}`);
          console.log(`Livro: ${resultado.emprestimo.livro_titulo}`);
          console.log(`Data de empréstimo: ${dataEmp}`);
          console.log(`Data de devolução: ${dataDev}`);
          console.log(`Status: ${resultado.emprestimo.status}`);
        } else {
          console.log(`\n${resultado.mensagem}`);
        }

        await this.question("\nPressione Enter para voltar...");
      },
    },
    {
      label: "Devolver livro",
      handler: async () => {
        console.log("\n=== Devolver Livro ===\n");

        const id = await this.question("ID do empréstimo: ");

        const resultado = await controllerDevolverLivro(Number(id));
        console.log(`\n${resultado.mensagem}`);

        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Voltar",
      handler: async () => {},
    },
  ];
}
