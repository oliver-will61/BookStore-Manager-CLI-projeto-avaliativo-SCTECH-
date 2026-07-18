import { Menu } from "./menu";
import { controllerCadastraLivro, controllerListarLivros, controllerConsultarLivro, controllerAtualizarLivro, controllerRemoverLivro } from "../controllers/livroController";
import { controllerListarAutores } from "../controllers/autorController";

export class LivrosMenu extends Menu {
  protected title = "Gerenciar Livros";

  protected options = [
    {
      label: "Cadastrar livros",
      handler: async () => {
        console.clear();
        console.log("\n=== Cadastrar Livro ===\n");

        const autores = await controllerListarAutores();
        if (!autores.sucesso || !autores.autores || autores.autores.length === 0) {
          console.log("Nenhum autor cadastrado. Cadastre um autor primeiro.\n");
          await this.question("Pressione Enter para voltar...");
          return;
        }

        const autorId = await this.question("\nID do autor: ");
        const titulo = await this.question("Título: ");
        const anoPublicacao = await this.question("Ano de publicação: ");
        const genero = await this.question("Gênero: ");
        const quantidade = await this.question("Quantidade de exemplares: ");

        const resultado = await controllerCadastraLivro(titulo, anoPublicacao, genero, Number(autorId), quantidade);
        console.log(`\n${resultado.mensagem}`);

        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Listar livros",
      handler: async () => {
        console.clear();
        console.log("\n=== Listar Livros ===\n");

        const resultado = await controllerListarLivros();

        if (!resultado.sucesso) {
          console.log(resultado.mensagem);
        } else if (resultado.livros && resultado.livros.length > 0) {
          for (const livro of resultado.livros) {
            console.log(
              `ID: ${livro.id} | Título: ${livro.titulo} | Ano: ${livro.ano_publicacao ?? "-"} | Gênero: ${livro.genero ?? "-"} | Exemplares: ${livro.quantidade} | Autor ID: ${livro.autor_id}`
            );
          }
          console.log(`\n${resultado.mensagem}`);
        } else {
          console.log(resultado.mensagem);
        }

        await this.question("\nPressione Enter para voltar...");
      },
    },
    {
      label: "Consultar um livro por identificador",
      handler: async () => {
        console.clear();
        console.log("\n=== Consultar Livro por ID ===\n");

        const id = await this.question("ID do livro: ");

        const resultado = await controllerConsultarLivro(Number(id));

        if (!resultado.sucesso) {
          console.log(`\n${resultado.mensagem}`);
        } else if (resultado.livro) {
          console.log(`\nID: ${resultado.livro.id}`);
          console.log(`Título: ${resultado.livro.titulo}`);
          console.log(`Ano de publicação: ${resultado.livro.ano_publicacao ?? "-"}`);
          console.log(`Gênero: ${resultado.livro.genero ?? "-"}`);
          console.log(`Exemplares: ${resultado.livro.quantidade}`);
          console.log(`Autor ID: ${resultado.livro.autor_id}`);
        } else {
          console.log(`\n${resultado.mensagem}`);
        }

        await this.question("\nPressione Enter para voltar...");
      },
    },
    {
      label: "Atualizar livros",
      handler: async () => {
        console.clear();
        console.log("\n=== Atualizar Livro ===\n");

        const id = await this.question("ID do livro: ");

        const consulta = await controllerConsultarLivro(Number(id));

        if (!consulta.sucesso || !consulta.livro) {
          console.log(`\n${consulta.mensagem}`);
          await this.question("Pressione Enter para voltar...");
          return;
        }

        const livro = consulta.livro;

        console.log("\nDeixe em branco para manter o valor atual.");

        console.log(`Título (${livro.titulo}):`);
        const titulo = await this.question("");

        console.log(`Ano de publicação (${livro.ano_publicacao ?? "-"}):`);
        const anoPublicacao = await this.question("");

        console.log(`Gênero (${livro.genero ?? "-"}):`);
        const genero = await this.question("");

        console.log(`Exemplares (${livro.quantidade}):`);
        const quantidade = await this.question("");

        console.log(`Autor ID (${livro.autor_id}):`);
        const autorId = await this.question("");

        const resultado = await controllerAtualizarLivro(
          Number(id),
          titulo || livro.titulo,
          anoPublicacao || (livro.ano_publicacao !== null ? String(livro.ano_publicacao) : ""),
          genero || (livro.genero ?? ""),
          autorId ? Number(autorId) : livro.autor_id,
          quantidade || String(livro.quantidade)
        );

        console.log(`\n${resultado.mensagem}`);

        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Remover livros",
      handler: async () => {
        console.clear();
        console.log("\n=== Remover Livro ===\n");

        const id = await this.question("ID do livro: ");

        const resultado = await controllerRemoverLivro(Number(id));
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
