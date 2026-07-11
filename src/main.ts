import { MainMenu } from "./menus/mainMenu";
import { Menu } from "./menus/menu";

// Função principal assíncrona que inicializa a aplicação
async function main(): Promise<void> {
  // Cria uma instância do MainMenu e inicia o loop do menu principal
  await new MainMenu().start();
  // Após o usuário encerrar a aplicação, fecha a interface readline
  Menu.close();
}

// Chama a função principal para executar o programa
main();
