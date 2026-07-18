export class Autor {
  constructor(
    public id: number,
    public nome: string,
    public nacionalidade: string | null,
    public data_nascimento: string | null
  ) {}
}
