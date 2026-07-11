import { Menu } from "./menu";
import { AutoresMenu } from "./autoresMenu";

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
        console.log("\nFuncionalidade: Livros.\n");
        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Clientes",
      handler: async () => {
        console.log("\nFuncionalidade: Clientes.\n");
        await this.question("Pressione Enter para voltar...");
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
