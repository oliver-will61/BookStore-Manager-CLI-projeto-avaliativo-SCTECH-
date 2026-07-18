// Importa o módulo nativo readline para capturar entrada do usuário no terminal
import * as readline from "readline";

// Interface que define a estrutura de uma opção do menu
export interface MenuOption {
  label: string; // Texto exibido para o usuário
  handler: () => Promise<void>; // Função assíncrona executada ao selecionar a opção
}

// Classe abstrata que serve como base para todos os menus do sistema
export abstract class Menu {
  // Instância estática e compartilhada do readline (singleton), evitando conflitos entre menus
  private static rl = readline.createInterface({
    input: process.stdin,  // Lê da entrada padrão (teclado)
    output: process.stdout, // Escreve na saída padrão (terminal)
  });

  // Título do menu — cada subclasse deve fornecer o seu
  protected abstract title: string;
  // Lista de opções — cada subclasse deve fornecer as suas
  protected abstract options: MenuOption[];

  // Método protegido que exibe uma pergunta e aguarda a resposta do usuário
  protected async question(prompt: string): Promise<string> {
    // Retorna uma Promise que resolve com o texto digitado pelo usuário
    return new Promise((resolve) => Menu.rl.question(prompt, resolve));
  }

  // Exibe o título e as opções numeradas no terminal
  private async showMenu(): Promise<void> {
    console.log(`\n=== ${this.title} ===\n`); // Exibe o título centralizado
    this.options.forEach((opt, index) => {
      console.log(`${index + 1} - ${opt.label}`); // Mostra número + label de cada opção
    });
    console.log(); // Linha em branco antes do prompt
  }

  // Método principal que inicia o loop do menu
  async start(): Promise<void> {
    let running = true; // Controla a execução do loop

    while (running) {
      console.clear();
      await this.showMenu(); // Exibe as opções
      const input = await this.question("Escolha uma opção: "); // Captura a escolha do usuário
      const index = parseInt(input.trim()) - 1; // Converte para índice base 0

      if (index >= 0 && index < this.options.length - 1) {
        // Se for uma opção válida (exceto a última), executa o handler correspondente
        
        await this.options[index].handler();
      } else if (index === this.options.length - 1) {
        // Se for a última opção (Voltar / Encerrar), sai do loop
        running = false;
      } else {
        // Se o número digitado não corresponder a nenhuma opção
        console.log("\nOpção inválida!\n");
        await this.question("Pressione Enter para continuar..."); // Aguarda o usuário antes de reexibir
      }
    }
  }

  // Método estático para fechar a interface readline ao encerrar a aplicação
  static close(): void {
    Menu.rl.close();
  }
}
