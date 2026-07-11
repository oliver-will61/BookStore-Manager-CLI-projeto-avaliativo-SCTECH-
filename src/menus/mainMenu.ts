import { question, close } from "../utils/prompt";
import { autoresMenu } from "./autoresMenu";

function showOptions(): void {
  console.clear();
  console.log("=== BookStore Manager CLI ===\n");
  console.log("1 - Autores");
  console.log("2 - Livros");
  console.log("3 - Clientes");
  console.log("4 - Empréstimos");
  console.log("5 - Relatórios");
  console.log("6 - Encerrar aplicação\n");
}

export async function mainMenu(): Promise<void> {
  let running = true;

  while (running) {
    showOptions();
    const option = await question("Escolha uma opção: ");

    switch (option.trim()) {
      case "1":
        await autoresMenu();
        break;
      case "2":
        console.log("\nFuncionalidade: Livros.\n");
        await question("Pressione Enter para voltar...");
        break;
      case "3":
        console.log("\nFuncionalidade: Clientes.\n");
        await question("Pressione Enter para voltar...");
        break;
      case "4":
        console.log("\nFuncionalidade: Empréstimos.\n");
        await question("Pressione Enter para voltar...");
        break;
      case "5":
        console.log("\nFuncionalidade: Relatórios.\n");
        await question("Pressione Enter para voltar...");
        break;
      case "6":
        running = false;
        break;
      default:
        console.log("\nOpção inválida!\n");
        await question("Pressione Enter para continuar...");
    }
  }

  close();
}
