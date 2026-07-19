import { MainMenu } from "./menus/mainMenu";
import { Menu } from "./menus/menu";

// Função principal assíncrona que inicializa a aplicação
async function main(): Promise<void> {
  // Cria uma instância do MainMenu e inicia o loop do menu principal
  await new MainMenu().start();
  // Após o usuário encerrar a aplicação, fecha a interface readline
  Menu.close();
}

// Captura erros não tratados que escaparem dos try/catch dos controllers
// Exibe a mensagem, fecha a interface readline e encerra o processo
main().catch((err) => {
  console.error("\nErro fatal:", err instanceof Error ? err.message : err);
  Menu.close();
  process.exit(1);
});
