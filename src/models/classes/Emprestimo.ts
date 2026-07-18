export class Emprestimo {
  constructor(
    public id: number,
    public cliente_id: number,
    public livro_id: number,
    public data_emprestimo: string,
    public data_devolucao: string | null,
    public status: string
  ) {}
}
