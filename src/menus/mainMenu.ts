import { Menu } from "./menu";
import { AutoresMenu } from "./autoresMenu";
import { ClientesMenu } from "./clientesMenu";
import { LivrosMenu } from "./livrosMenu";

export class MainMenu extends Menu {
  protected title = "BookStore Manager CLI";

  protected options = [
    {
      label: "Autores",
      handler: async () => {
        await new AutoresMenu().start();
      },
    },
    {
      label: "Livros",
      handler: async () => {
        await new LivrosMenu().start();
      },
    },
    {
      label: "Clientes",
      handler: async () => {
        await new ClientesMenu().start();
      },
    },
    {
      label: "Empréstimos",
      handler: async () => {
        console.log("\nFuncionalidade: Empréstimos.\n");
        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Relatórios",
      handler: async () => {
        console.log("\nFuncionalidade: Relatórios.\n");
        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Encerrar aplicação",
      handler: async () => {},
    },
  ];
}
