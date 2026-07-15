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
  quantidade INTEGER NOT NULL DEFAULT 1 
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
  data_emprestimo DATE NOT NULL DEFAULT,
  data_devolucao DATE,
  status VARCHAR(20) NOT NULL,
  CONSTRAINT fk_emprestimos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  CONSTRAINT fk_emprestimos_livro FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE
);

-- ============================================================
-- SEEDS
-- ============================================================

INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES
  ('Machado de Assis',       'Brasileira',         '1839-06-21'),
  ('Clarice Lispector',      'Ucraniana-Brasileira','1920-12-10'),
  ('Guimarães Rosa',         'Brasileira',         '1908-06-27'),
  ('Carlos Drummond de Andrade', 'Brasileira',     '1902-10-31'),
  ('Jorge Amado',            'Brasileira',         '1912-08-10'),
  ('Graciliano Ramos',       'Brasileira',         '1892-10-27'),
  ('Cecília Meireles',       'Brasileira',         '1901-11-07');

INSERT INTO livros (titulo, ano_publicacao, genero, autor_id) VALUES
  ('Dom Casmurro',              1899, 'Romance',  1),
  ('Memórias Póstumas de Brás Cubas', 1881, 'Romance', 1),
  ('A Hora da Estrela',         1977, 'Romance', 2),
  ('Grande Sertão: Veredas',    1956, 'Romance', 3),
  ('Vidas Secas',               1938, 'Romance', 6),
  ('Capitães da Areia',         1937, 'Romance', 5),
  ('O Quinze',                  1930, 'Romance', 6);

INSERT INTO clientes (nome, email, telefone, endereco) VALUES
  ('João Silva',      'joao.silva@email.com',    '11999990001', 'Rua A, 123, São Paulo-SP'),
  ('Maria Santos',    'maria.santos@email.com',  '21999990002', 'Rua B, 456, Rio de Janeiro-RJ'),
  ('Pedro Oliveira',  'pedro.oliveira@email.com','31999990003', 'Rua C, 789, Belo Horizonte-MG'),
  ('Ana Costa',       'ana.costa@email.com',     '41999990004', 'Rua D, 321, Curitiba-PR'),
  ('Lucas Pereira',   'lucas.pereira@email.com', '51999990005', 'Rua E, 654, Porto Alegre-RS'),
  ('Fernanda Lima',   'fernanda.lima@email.com', '61999990006', 'Rua F, 987, Brasília-DF');

INSERT INTO emprestimos (cliente_id, livro_id, data_emprestimo, data_devolucao, status) VALUES
  (1, 1, '2026-07-07', NULL,          'emprestado'),
  (2, 2, '2026-06-14', '2026-06-24',  'devolvido'),
  (3, 3, '2026-07-11', NULL,          'emprestado'),
  (1, 4, '2026-06-29', '2026-07-04',  'devolvido'),
  (4, 5, '2026-07-13', NULL,          'emprestado'),
  (5, 6, '2026-05-15', '2026-05-25',  'devolvido'),
  (2, 1, '2026-05-30', '2026-06-09',  'devolvido');
