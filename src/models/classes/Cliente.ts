export class Cliente {
  constructor(
    public id: number,
    public nome: string,
    public email: string,
    public telefone: string | null,
    public endereco: string | null
  ) {}
}
