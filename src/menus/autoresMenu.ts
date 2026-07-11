import { question } from "../utils/prompt";

export async function autoresMenu(): Promise<void> {
  let running = true;

  while (running) {
    console.clear();
    console.log("=== Gerenciar Autores ===\n");
    console.log("1 - Cadastrar autores");
    console.log("2 - Listar autores");
    console.log("3 - Consultar um autor por identificador");
    console.log("4 - Atualizar autores");
    console.log("5 - Remover autores");
    console.log("6 - Voltar\n");

    const option = await question(" ");

    switch (option.trim()) {
      case "1":
        console.log("\nFuncionalidade: Cadastrar autores.\n");
        await question("Pressione Enter para voltar...");
        break;
      case "2":
        console.log("\nFuncionalidade: Listar autores.\n");
        await question("Pressione Enter para voltar...");
        break;
      case "3":
        console.log("\nFuncionalidade: Consultar autor por identificador.\n");
        await question("Pressione Enter para voltar...");
        break;
      case "4":
        console.log("\nFuncionalidade: Atualizar autores.\n");
        await question("Pressione Enter para voltar...");
        break;
      case "5":
        console.log("\nFuncionalidade: Remover autores.\n");
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
}
