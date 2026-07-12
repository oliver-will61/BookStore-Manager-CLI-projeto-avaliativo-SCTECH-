import { Menu } from "./menu";
import { controllerCadastraAutor } from "../controllers/autorController";

export class AutoresMenu extends Menu {
  protected title = "Gerenciar Autores";

  protected options = [
    {
      label: "Cadastrar autores",
      handler: async () => {
        console.clear();
        console.log("=== Cadastrar Autor ===\n");

        //input nome
        const nome = await this.question("Nome: "); 

        //input nacionalidade
        const nacionalidade = await this.question("Nacionalidade: ");  
        
        //input data de nascimento
        const dataNascimento = await this.question("Data de nascimento (AAAA-MM-DD): "); 

        //chama controller
        const resultado = await controllerCadastraAutor(nome, nacionalidade, dataNascimento);
        console.log(`\n${resultado.mensagem}`); //exibe a mensagem do resultado

        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Listar autores",
      handler: async () => {
        console.log("\nFuncionalidade: Listar autores.\n");
        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Consultar um autor por identificador",
      handler: async () => {
        console.log("\nFuncionalidade: Consultar autor por identificador.\n");
        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Atualizar autores",
      handler: async () => {
        console.log("\nFuncionalidade: Atualizar autores.\n");
        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Remover autores",
      handler: async () => {
        console.log("\nFuncionalidade: Remover autores.\n");
        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Voltar",
      handler: async () => {},
    },
  ];
}
