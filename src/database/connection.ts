import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "bookstore",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

// Previne que erros assíncronos de conexão (ex: banco cair após idle) derrubem a aplicação
pool.on("error", (err) => {
  console.error("\nErro inesperado na conexão com o banco de dados:", err.message);
});

export default pool;
