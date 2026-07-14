import { BaseRepository } from "../models/classes/BaseRepository";
import { ClienteRow } from "../models/interfaces/ClienteInterface";

export async function repositoryRemoverCliente(
  id: number
): Promise<boolean> {
  return await BaseRepository.delete("clientes", id);
}

export async function repositoryBuscarPorEmail(
  email: string
): Promise<ClienteRow | null> {
  return (await BaseRepository.findBy("clientes", "email", email)) as unknown as ClienteRow | null;
}

export async function repositoryBuscarPorId(
  id: number
): Promise<ClienteRow | null> {
  return (await BaseRepository.findById("clientes", id)) as unknown as ClienteRow | null;
}

export async function repositoryListarClientes(): Promise<ClienteRow[]> {
  return (await BaseRepository.findAll("clientes")) as unknown as ClienteRow[];
}

export async function repositoryAtualizarCliente(
  id: number,
  nome: string,
  email: string,
  telefone: string | null,
  endereco: string | null
): Promise<ClienteRow | null> {
  return (await BaseRepository.update("clientes", id, {
    nome,
    email,
    telefone,
    endereco,
  })) as unknown as ClienteRow | null;
}

export async function repositoryCadastraCliente(
  nome: string,
  email: string,
  telefone: string | null,
  endereco: string | null
): Promise<ClienteRow> {
  return (await BaseRepository.insert("clientes", {
    nome,
    email,
    telefone,
    endereco,
  })) as unknown as ClienteRow;
}
