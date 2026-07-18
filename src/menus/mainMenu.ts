import { Menu } from "./menu";
import { AutoresMenu } from "./autoresMenu";
import { ClientesMenu } from "./clientesMenu";
import { LivrosMenu } from "./livrosMenu";
import { EmprestimosMenu } from "./emprestimosMenu";
import { RelatoriosMenu } from "./relatoriosMenu";

export class MainMenu extends Menu {
  protected title = "BookStore Manager CLI";

  protected options = [
    {
      label: "Autores",
      handler: async () => {
        console.clear()
        await new AutoresMenu().start();
      },
    },
    {
      label: "Livros",
      handler: async () => {
        console.clear()
        await new LivrosMenu().start();
      },
    },
    {
      label: "Clientes",
      handler: async () => {
        console.clear()
        await new ClientesMenu().start();
      },
    },
    {
      label: "Empréstimos",
      handler: async () => {
        console.clear()
        await new EmprestimosMenu().start();
      },
    },
    {
      label: "Relatórios",
      handler: async () => {
        console.clear()
        await new RelatoriosMenu().start();
      },
    },
    {
      label: "Encerrar aplicação",
      handler: async () => {},
    },
  ];
}
