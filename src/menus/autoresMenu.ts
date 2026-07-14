import { Menu } from "./menu";
import { controllerCadastraAutor, controllerListarAutores, controllerConsultarAutor, controllerAtualizarAutor, controllerRemoverAutor } from "../controllers/autorController";
import { formatarData } from "../utils/formatDate";

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
        const dataNascimento = await this.question("Data de nascimento (AAAA-MM-DD): "); //formato aceito pelo postgreSQL
        
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
            const data = formatarData(autor.data_nascimento);
            console.log(
              `ID: ${autor.id} | Nome: ${autor.nome} | Nacionalidade: ${autor.nacionalidade ?? "-"} | Nascimento: ${data}`
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
          const data = formatarData(resultado.autor.data_nascimento);
          console.log(`\nID: ${resultado.autor.id}`);
          console.log(`Nome: ${resultado.autor.nome}`);
          console.log(`Nacionalidade: ${resultado.autor.nacionalidade ?? "-"}`);
          console.log(`Data de nascimento: ${data}`);
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
        console.log("\n=== Atualizar Autor ===\n");

        const id = await this.question("ID do autor: ");

        // Busca o autor atual para exibir os dados
        const consulta = await controllerConsultarAutor(Number(id));

        if (!consulta.sucesso || !consulta.autor) {
          console.log(`\n${consulta.mensagem}`);
          await this.question("Pressione Enter para voltar...");
          return;
        }

        const autor = consulta.autor;
        const dataNascimentoFormatada = formatarData(autor.data_nascimento);

        // Exibe os dados atuais e solicita novos valores
        console.log("\nDeixe em branco para manter o valor atual.");

        console.log(`Nome (${autor.nome}):`);
        const nome = await this.question("");

        console.log(`Nacionalidade (${autor.nacionalidade ?? "-"}):`);
        const nacionalidade = await this.question("");

        console.log(`Data de nascimento (${dataNascimentoFormatada}) (AAAA-MM-DD):`);
        const dataNascimento = await this.question("");

        // dataFallback converte "-" para "" (vazio), e o service trata "" como null.
        const dataFallback = dataNascimentoFormatada !== "-" ? dataNascimentoFormatada : ""; // Se dataNascimentoFormatada for válida usa como fallback, senão envia vazio
        
        const resultado = await controllerAtualizarAutor(
          Number(id), // ID do autor a ser atualizado
          nome || autor.nome, // Se nome foi preenchido usa o novo, senão mantém o atual
          nacionalidade || (autor.nacionalidade ?? ""), // Se nacionalidade foi preenchida usa a nova, senão mantém a atual
          dataNascimento || dataFallback // Se data foi preenchida usa a nova, senão mantém a atual
        );

        console.log(`\n${resultado.mensagem}`);

        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Remover autores",
      handler: async () => {
        console.log("\n=== Remover Autor ===\n");

        const id = await this.question("ID do autor: ");

        const resultado = await controllerRemoverAutor(Number(id));
        console.log(`\n${resultado.mensagem}`);

        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Voltar",
      handler: async () => {},
    },
  ];
}
