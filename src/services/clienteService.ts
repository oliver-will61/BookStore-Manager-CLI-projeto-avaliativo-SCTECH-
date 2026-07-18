import { repositoryCadastraCliente, repositoryBuscarPorEmail, repositoryListarClientes, repositoryBuscarPorId, repositoryAtualizarCliente, repositoryRemoverCliente } from "../repositories/clienteRepository";

import { Cliente } from "../models/classes/Cliente";

export async function ServiceCadastraCliente(
  nome: string,
  email: string,
  telefone: string,
  endereco: string
): Promise<Cliente> {
  if (!nome || nome.trim().length === 0) {
    throw new Error("Nome é obrigatório.");
  }

  if (!email || email.trim().length === 0) {
    throw new Error("Email é obrigatório.");
  }

  const emailTratado = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTratado)) {
    throw new Error("Email inválido.");
  }

  const telefoneTratado = telefone?.trim() || null;
  const enderecoTratado = endereco?.trim() || null;

  const clienteExistente = await repositoryBuscarPorEmail(emailTratado);

  if (clienteExistente) {
    throw new Error("Já existe um cliente cadastrado com este email.");
  }

  const row = await repositoryCadastraCliente(nome.trim(), emailTratado, telefoneTratado, enderecoTratado);
  return new Cliente(row.id, row.nome, row.email, row.telefone, row.endereco);
}

export async function ServiceListarClientes(): Promise<{
  clientes: Cliente[];
  vazio: boolean;
}> {
  const rows = await repositoryListarClientes();

  return {
    clientes: rows.map(row => new Cliente(row.id, row.nome, row.email, row.telefone, row.endereco)),
    vazio: rows.length === 0,
  };
}

export async function ServiceConsultarCliente(
  id: number
): Promise<Cliente | null> {
  if (!id || id <= 0) {
    throw new Error("ID inválido.");
  }

  const row = await repositoryBuscarPorId(id);
  return row ? new Cliente(row.id, row.nome, row.email, row.telefone, row.endereco) : null;
}

export async function ServiceAtualizarCliente(
  id: number,
  nome: string,
  email: string,
  telefone: string,
  endereco: string
): Promise<Cliente> {
  if (!id || id <= 0) {
    throw new Error("ID inválido.");
  }

  const clienteAtual = await repositoryBuscarPorId(id);
  if (!clienteAtual) {
    throw new Error("Cliente não encontrado.");
  }

  if (!nome || nome.trim().length === 0) {
    throw new Error("Nome é obrigatório.");
  }

  if (!email || email.trim().length === 0) {
    throw new Error("Email é obrigatório.");
  }

  const emailTratado = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTratado)) {
    throw new Error("Email inválido.");
  }

  const nomeTratado = nome.trim();
  const telefoneTratado = telefone?.trim() || null;
  const enderecoTratado = endereco?.trim() || null;

  const clienteExistente = await repositoryBuscarPorEmail(emailTratado);
  if (clienteExistente && clienteExistente.id !== id) {
    throw new Error("Já existe outro cliente cadastrado com este email.");
  }

  const row = await repositoryAtualizarCliente(id, nomeTratado, emailTratado, telefoneTratado, enderecoTratado);

  if (!row) {
    throw new Error("Erro ao atualizar cliente.");
  }

  return new Cliente(row.id, row.nome, row.email, row.telefone, row.endereco);
}

export async function ServiceRemoverCliente(
  id: number
): Promise<void> {
  if (!id || id <= 0) {
    throw new Error("ID inválido.");
  }

  const cliente = await repositoryBuscarPorId(id);
  if (!cliente) {
    throw new Error("Cliente não encontrado.");
  }

  const removido = await repositoryRemoverCliente(id);

  if (!removido) {
    throw new Error("Erro ao remover cliente.");
  }
}
