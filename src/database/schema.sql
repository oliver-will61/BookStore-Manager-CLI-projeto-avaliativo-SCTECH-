CREATE TABLE autores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  nacionalidade VARCHAR(100),
  data_nascimento DATE
);

CREATE TABLE livros (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  ano_publicacao INTEGER,
  genero VARCHAR(100),
  autor_id INTEGER NOT NULL,
  CONSTRAINT fk_livros_autor FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE CASCADE
);

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  endereco TEXT
);

CREATE TABLE emprestimos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  livro_id INTEGER NOT NULL,
  data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
  data_devolucao DATE,
  status VARCHAR(20) NOT NULL,
  CONSTRAINT fk_emprestimos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  CONSTRAINT fk_emprestimos_livro FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);
