import { Menu } from "./menu";
import { controllerCadastraCliente, controllerListarClientes, controllerConsultarCliente, controllerAtualizarCliente, controllerRemoverCliente } from "../controllers/clienteController";

export class ClientesMenu extends Menu {
  protected title = "Gerenciar Clientes";

  protected options = [
    {
      label: "Cadastrar clientes",
      handler: async () => {
        console.log("\n=== Cadastrar Cliente ===\n");

        const nome = await this.question("Nome: ");
        const email = await this.question("Email: ");
        const telefone = await this.question("Telefone: ");
        const endereco = await this.question("Endereço: ");

        const resultado = await controllerCadastraCliente(nome, email, telefone, endereco);
        console.log(`\n${resultado.mensagem}`);

        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Listar clientes",
      handler: async () => {
        console.log("\n=== Listar Clientes ===\n");

        const resultado = await controllerListarClientes();

        if (!resultado.sucesso) {
          console.log(resultado.mensagem);
        } else if (resultado.clientes && resultado.clientes.length > 0) {
          for (const cliente of resultado.clientes) {
            console.log(
              `ID: ${cliente.id} | Nome: ${cliente.nome} | Email: ${cliente.email} | Telefone: ${cliente.telefone ?? "-"} | Endereço: ${cliente.endereco ?? "-"}`
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
      label: "Consultar um cliente por identificador",
      handler: async () => {
        console.log("\n=== Consultar Cliente por ID ===\n");

        const id = await this.question("ID do cliente: ");

        const resultado = await controllerConsultarCliente(Number(id));

        if (!resultado.sucesso) {
          console.log(`\n${resultado.mensagem}`);
        } else if (resultado.cliente) {
          console.log(`\nID: ${resultado.cliente.id}`);
          console.log(`Nome: ${resultado.cliente.nome}`);
          console.log(`Email: ${resultado.cliente.email}`);
          console.log(`Telefone: ${resultado.cliente.telefone ?? "-"}`);
          console.log(`Endereço: ${resultado.cliente.endereco ?? "-"}`);
        } else {
          console.log(`\n${resultado.mensagem}`);
        }

        await this.question("\nPressione Enter para voltar...");
      },
    },
    {
      label: "Atualizar clientes",
      handler: async () => {
        console.log("\n=== Atualizar Cliente ===\n");

        const id = await this.question("ID do cliente: ");

        const consulta = await controllerConsultarCliente(Number(id));

        if (!consulta.sucesso || !consulta.cliente) {
          console.log(`\n${consulta.mensagem}`);
          await this.question("Pressione Enter para voltar...");
          return;
        }

        const cliente = consulta.cliente;

        console.log("\nDeixe em branco para manter o valor atual.");

        console.log(`Nome (${cliente.nome}):`);
        const nome = await this.question("");

        console.log(`Email (${cliente.email}):`);
        const email = await this.question("");

        console.log(`Telefone (${cliente.telefone ?? "-"}):`);
        const telefone = await this.question("");

        console.log(`Endereço (${cliente.endereco ?? "-"}):`);
        const endereco = await this.question("");

        const resultado = await controllerAtualizarCliente(
          Number(id),
          nome || cliente.nome,
          email || cliente.email,
          telefone || (cliente.telefone ?? ""),
          endereco || (cliente.endereco ?? "")
        );

        console.log(`\n${resultado.mensagem}`);

        await this.question("Pressione Enter para voltar...");
      },
    },
    {
      label: "Remover clientes",
      handler: async () => {
        console.log("\n=== Remover Cliente ===\n");

        const id = await this.question("ID do cliente: ");

        const resultado = await controllerRemoverCliente(Number(id));
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
