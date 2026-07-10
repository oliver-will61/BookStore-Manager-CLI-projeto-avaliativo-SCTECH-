import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

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
        console.log("\nOpção Autores selecionada.\n");
        await question("Pressione Enter para voltar ao menu...");
        break;
      case "2":
        console.log("\nOpção Livros selecionada.\n");
        await question("Pressione Enter para voltar ao menu...");
        break;
      case "3":
        console.log("\nOpção Clientes selecionada.\n");
        await question("Pressione Enter para voltar ao menu...");
        break;
      case "4":
        console.log("\nOpção Empréstimos selecionada.\n");
        await question("Pressione Enter para voltar ao menu...");
        break;
      case "5":
        console.log("\nOpção Relatórios selecionada.\n");
        await question("Pressione Enter para voltar ao menu...");
        break;
      case "6":
        running = false;
        break;
      default:
        console.log("\nOpção inválida! Tente novamente.\n");
        await question("Pressione Enter para continuar...");
    }
  }

  rl.close();
}
