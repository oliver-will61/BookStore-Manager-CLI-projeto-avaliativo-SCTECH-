import pool from "../../database/connection";

// Lista de tabelas permitidas para operações (previne SQL injection em nomes de tabela)
const TABELAS = ["autores", "livros", "clientes", "emprestimos"];

// Valida se a tabela informada está na whitelist de tabelas permitidas
function validarTabela(tabela: string): void {
  if (!TABELAS.includes(tabela)) {
    throw new Error(`Tabela "${tabela}" não permitida.`);
  }
}

// Classe genérica responsável por operações CRUD no banco, sem repetição de SQL
export class BaseRepository {
  // Insere um registro na tabela e retorna o registro salvo (com id gerado)
  static async insert(
    tabela: string, // Nome da tabela (validado contra whitelist)
    dados: Record<string, unknown> // Objeto com colunas e valores a inserir
  ): Promise<Record<string, unknown>> {
    validarTabela(tabela);

    const colunas = Object.keys(dados); // Extrai os nomes das colunas do objeto
    const valores = Object.values(dados); // Extrai os valores correspondentes
    const placeholders = colunas.map((_, i) => `$${i + 1}`).join(", "); // Gera $1, $2, $3...

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

  // Busca um registro pelo ID e retorna o objeto ou null se não encontrado
  static async findById(
    tabela: string, // Nome da tabela
    id: number // ID do registro a buscar
  ): Promise<Record<string, unknown> | null> {
    validarTabela(tabela);

    const result = await pool.query(
      `SELECT * FROM ${tabela} WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null; // Retorna o registro ou null se não existir
  }

  // Busca um registro por qualquer coluna e retorna o objeto ou null
  static async findBy(
    tabela: string, // Nome da tabela
    coluna: string, // Nome da coluna para filtrar (ex: "nome", "email")
    valor: unknown // Valor a buscar na coluna
  ): Promise<Record<string, unknown> | null> {
    validarTabela(tabela);

    const result = await pool.query(
      `SELECT * FROM ${tabela} WHERE ${coluna} = $1`,
      [valor]
    );

    return result.rows[0] || null; // Retorna o primeiro registro encontrado ou null
  }

  // Retorna todos os registros da tabela ordenados por ID
  static async findAll(
    tabela: string // Nome da tabela
  ): Promise<Record<string, unknown>[]> {
    validarTabela(tabela);

    const result = await pool.query(
      `SELECT * FROM ${tabela} ORDER BY id`
    );

    return result.rows; // Retorna array com todos os registros
  }

  // Atualiza um registro pelo ID e retorna o registro atualizado ou null
  static async update(
    tabela: string, // Nome da tabela
    id: number, // ID do registro a atualizar
    dados: Record<string, unknown> // Objeto com as colunas e novos valores
  ): Promise<Record<string, unknown> | null> {
    validarTabela(tabela);

    const colunas = Object.keys(dados); // Nomes das colunas a atualizar
    const valores = Object.values(dados); // Novos valores
    const sets = colunas.map((col, i) => `${col} = $${i + 1}`).join(", "); // Gera "col1 = $1, col2 = $2..."

    const result = await pool.query(
      `UPDATE ${tabela} SET ${sets} WHERE id = $${colunas.length + 1} RETURNING *`,
      [...valores, id] // Valores + ID (último placeholder)
    );

    return result.rows[0] || null; // Retorna o registro atualizado ou null
  }

  // Remove um registro pelo ID e retorna true se foi removido, false caso contrário
  static async delete(
    tabela: string, // Nome da tabela
    id: number // ID do registro a remover
  ): Promise<boolean> {
    validarTabela(tabela);

    const result = await pool.query(
      `DELETE FROM ${tabela} WHERE id = $1`,
      [id]
    );

    // rowCount indica quantas linhas foram afetadas; retorna true se > 0
    return (result.rowCount ?? 0) > 0;
  }
}
