import pool from "../../database/connection";

const TABELAS = ["autores", "livros", "clientes", "emprestimos"];

function validarTabela(tabela: string): void {
  if (!TABELAS.includes(tabela)) {
    throw new Error(`Tabela "${tabela}" não permitida.`);
  }
}

export class BaseRepository {
  static async insert(
    tabela: string,
    dados: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    validarTabela(tabela);

    const colunas = Object.keys(dados);
    const valores = Object.values(dados);
    const placeholders = colunas.map((_, i) => `$${i + 1}`).join(", ");

    // Executa o INSERT no banco com os valores parametrizados (proteção contra SQL injection)
    // RETURNING * faz o PostgreSQL devolver o registro exatamente como foi salvo,
    const result = await pool.query(
      `INSERT INTO ${tabela} (${colunas.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      valores
    );

    // result.rows é um array com as linhas retornadas (sempre 1 linha com RETURNING *)
    // Exemplo de retorno: { id: 1, nome: "Machado de Assis", nacionalidade: "Brasileira", ... }
    return result.rows[0];
  }

  static async findById(
    tabela: string,
    id: number
  ): Promise<Record<string, unknown> | null> {
    validarTabela(tabela);

    const result = await pool.query(
      `SELECT * FROM ${tabela} WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  static async findBy(
    tabela: string,
    coluna: string,
    valor: unknown
  ): Promise<Record<string, unknown> | null> {
    validarTabela(tabela);

    const result = await pool.query(
      `SELECT * FROM ${tabela} WHERE ${coluna} = $1`,
      [valor]
    );

    return result.rows[0] || null;
  }

  static async findAll(
    tabela: string
  ): Promise<Record<string, unknown>[]> {
    validarTabela(tabela);

    const result = await pool.query(
      `SELECT * FROM ${tabela} ORDER BY id`
    );

    return result.rows;
  }

  static async update(
    tabela: string,
    id: number,
    dados: Record<string, unknown>
  ): Promise<Record<string, unknown> | null> {
    validarTabela(tabela);

    const colunas = Object.keys(dados);
    const valores = Object.values(dados);
    const sets = colunas.map((col, i) => `${col} = $${i + 1}`).join(", ");

    const result = await pool.query(
      `UPDATE ${tabela} SET ${sets} WHERE id = $${colunas.length + 1} RETURNING *`,
      [...valores, id]
    );

    return result.rows[0] || null;
  }

  static async delete(
    tabela: string,
    id: number
  ): Promise<boolean> {
    validarTabela(tabela);

    const result = await pool.query(
      `DELETE FROM ${tabela} WHERE id = $1`,
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }
}
