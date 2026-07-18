import { ServiceCadastraCliente, ServiceListarClientes, ServiceConsultarCliente, ServiceAtualizarCliente, ServiceRemoverCliente } from "../services/clienteService";
import { Cliente } from "../models/classes/Cliente";

export async function controllerCadastraCliente(
  nome: string,
  email: string,
  telefone: string,
  endereco: string
): Promise<{ sucesso: boolean; mensagem: string; cliente?: Cliente }> {
  try {
    const cliente = await ServiceCadastraCliente(nome, email, telefone, endereco);
    return {
      sucesso: true,
      mensagem: `Cliente cadastrado com sucesso! ID: ${cliente.id}`,
      cliente,
    };
  } catch (error) {
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao cadastrar cliente.";
    return { sucesso: false, mensagem };
  }
}

export async function controllerListarClientes(): Promise<{
  sucesso: boolean;
  mensagem: string;
  clientes?: Cliente[];
}> {
  try {
    const { clientes, vazio } = await ServiceListarClientes();

    if (vazio) {
      return {
        sucesso: true,
        mensagem: "Nenhum cliente cadastrado.",
        clientes,
      };
    }

    return {
      sucesso: true,
      mensagem: `${clientes.length} cliente(s) encontrado(s).`,
      clientes,
    };
  } catch (error) {
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao listar clientes.";
    return { sucesso: false, mensagem };
  }
}

export async function controllerConsultarCliente(
  id: number
): Promise<{ sucesso: boolean; mensagem: string; cliente?: Cliente }> {
  try {
    const cliente = await ServiceConsultarCliente(id);

    if (!cliente) {
      return {
        sucesso: true,
        mensagem: "Cliente não encontrado.",
      };
    }

    return {
      sucesso: true,
      mensagem: "Cliente encontrado.",
      cliente,
    };
  } catch (error) {
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao consultar cliente.";
    return { sucesso: false, mensagem };
  }
}

export async function controllerAtualizarCliente(
  id: number,
  nome: string,
  email: string,
  telefone: string,
  endereco: string
): Promise<{ sucesso: boolean; mensagem: string; cliente?: Cliente }> {
  try {
    const cliente = await ServiceAtualizarCliente(id, nome, email, telefone, endereco);
    return {
      sucesso: true,
      mensagem: `Cliente atualizado com sucesso! ID: ${cliente.id}`,
      cliente,
    };
  } catch (error) {
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao atualizar cliente.";
    return { sucesso: false, mensagem };
  }
}

export async function controllerRemoverCliente(
  id: number
): Promise<{ sucesso: boolean; mensagem: string }> {
  try {
    await ServiceRemoverCliente(id);
    return {
      sucesso: true,
      mensagem: "Cliente removido com sucesso!",
    };
  } catch (error) {
    const mensagem =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao remover cliente.";
    return { sucesso: false, mensagem };
  }
}
