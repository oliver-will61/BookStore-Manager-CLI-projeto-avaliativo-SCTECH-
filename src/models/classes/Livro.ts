export class Livro {
  constructor(
    public id: number,
    public titulo: string,
    public ano_publicacao: number | null,
    public genero: string | null,
    public autor_id: number,
    public quantidade: number
  ) {}
}
