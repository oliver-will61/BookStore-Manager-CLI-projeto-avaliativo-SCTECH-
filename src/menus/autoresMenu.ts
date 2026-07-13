import { Menu } from "./menu";
import { controllerCadastraAutor, controllerListarAutores, controllerConsultarAutor } from "../controllers/autorController";

export class AutoresMenu extends Menu {
  protected title = "Gerenciar Autores";

  protected options = [
    {
      label: "Cadastrar autores",
      handler: async () => {
        console.log("\n=== Cadastrar Autor ===\n");

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
        console.log("\n=== Listar Autores ===\n");

        // Chama o controller que busca todos os autores
        const resultado = await controllerListarAutores();

        if (!resultado.sucesso) {
          // Se houve erro, exibe a mensagem de erro
          console.log(resultado.mensagem);
        } else if (resultado.autores && resultado.autores.length > 0) {
          // Se há autores, exibe cada um com ID, nome, nacionalidade e data
          for (const autor of resultado.autores) {
            console.log(
              `ID: ${autor.id} | Nome: ${autor.nome} | Nacionalidade: ${autor.nacionalidade ?? "-"} | Nascimento: ${autor.data_nascimento ?? "-"}`
            );
          }
          console.log(`\n${resultado.mensagem}`);
        } else {
          // Se a lista está vazia, exibe mensagem
          console.log(resultado.mensagem);
        }

        await this.question("\nPressione Enter para voltar...");
      },
    },
    {
      label: "Consultar um autor por identificador",
      handler: async () => {
        console.log("\n=== Consultar Autor por ID ===\n");

        // Solicita o ID ao usuário
        const id = await this.question("ID do autor: ");

        // Chama o controller que busca o autor pelo ID
        const resultado = await controllerConsultarAutor(Number(id));

        if (!resultado.sucesso) {
          // Se houve erro, exibe a mensagem de erro
          console.log(`\n${resultado.mensagem}`);
        } else if (resultado.autor) {
          // Se encontrou, exibe todos os dados do autor
          console.log(`\nID: ${resultado.autor.id}`);
          console.log(`Nome: ${resultado.autor.nome}`);
          console.log(`Nacionalidade: ${resultado.autor.nacionalidade ?? "-"}`);
          console.log(`Data de nascimento: ${resultado.autor.data_nascimento ?? "-"}`);
        } else {
          // Se não encontrou, exibe mensagem
          console.log(`\n${resultado.mensagem}`);
        }

        await this.question("\nPressione Enter para voltar...");
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
