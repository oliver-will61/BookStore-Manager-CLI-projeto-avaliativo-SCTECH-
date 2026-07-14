# BookStore Manager CLI

Sistema de gerenciamento de livraria via terminal (CLI) com PostgreSQL.

## Arquitetura

```
Usuário → Menu → Controller → Service → Repository → Operação Genérica → DB
```

Cada camada tem responsabilidade única, permitindo reuso máximo entre as entidades.

### Camadas

#### Menu (`src/menus/`)
Coleta inputs do usuário e exibe resultados. Não contém lógica de negócio nem chama o banco diretamente.

- Cada entidade tem seu próprio menu (`autoresMenu.ts`, `livrosMenu.ts`, etc.)
- Todos extendem a classe abstrata `Menu` que fornece o loop genérico, exibição de opções e o método `question()`

#### Controller (`src/controllers/`)
Orquestra a operação: chama o Service, captura erros, monta resposta padronizada.

- Retorno padrão: `{ sucesso: boolean, mensagem: string, dados?: T }`
- Um controller por entidade, uma função exportada por operação

#### Service (`src/services/`)
Valida dados e aplica regras de negócio. Não sabe que o banco existe.

- Um service por entidade
- Validações como "nome é obrigatório", "data deve estar no formato AAAA-MM-DD"

#### Repository (`src/repositories/`)
Mapeia dados da entidade (tipagem) e delega a execução para as classes genéricas. Não monta SQL.

- Define a interface da entidade (`AutorRow`, `ClienteRow`, etc.)
- Chama as classes genéricas (`Cadastrar.enviar()`, `Consultar.porId()`, etc.)

#### Operações Genéricas (`src/models/classes/BaseRepository.ts`)
Executam SQL sem repetição de código. Classe única com todos os métodos estáticos.

| Método | SQL gerado |
|---|---|
| `insert(tabela, dados)` | `INSERT INTO tabela (cols) VALUES ($1..$n) RETURNING *` |
| `findById(tabela, id)` | `SELECT * FROM tabela WHERE id = $1` |
| `findAll(tabela)` | `SELECT * FROM tabela ORDER BY id` |
| `update(tabela, id, dados)` | `UPDATE tabela SET col=$1 WHERE id=$n RETURNING *` |
| `delete(tabela, id)` | `DELETE FROM tabela WHERE id = $1` |

- Nomes de tabela validados contra whitelist
- Valores sempre parametrizados (proteção contra SQL injection)

### Fluxo exemplo — Cadastrar Autor

```
autoresMenu.ts            → Pergunta nome, nacionalidade, data
    ↓
autorController.ts        → Chama service, trata erro, retorna { sucesso, mensagem }
    ↓
autorService.ts           → Valida nome obrigatório e formato da data
    ↓
autorRepository.ts        → Chama BaseRepository.insert("autores", dados)
    ↓
BaseRepository.ts         → Monta INSERT e executa no banco
    ↓
DB

```

### Reuso entre entidades

O fluxo é idêntico para qualquer entidade. O que muda:

| O quê muda | Onde | Exemplo |
|---|---|---|
| Nome da tabela | Repository | `"autores"`, `"livros"`, `"clientes"`, `"emprestimos"` |
| Campos do formulário | Menu | Nome/nacionalidade vs Título/gênero |
| Validações específicas | Service | Nome obrigatório vs Email único |
| Interface da entidade | Repository | `AutorRow`, `LivroRow`, `ClienteRow` |

Nenhum SQL é repetido — as classes genéricas servem a todas as entidades.

## Funcionalidades — Autores

### Cadastrar autor
- Coleta nome, nacionalidade e data de nascimento
- Valida: nome obrigatório, data no formato `AAAA-MM-DD`, nome único (sem duplicidade)
- Retorna o ID do autor cadastrado

### Listar autores
- Exibe todos os autores com ID, nome, nacionalidade e data de nascimento
- Se não houver autores: `"Nenhum autor cadastrado."`

### Consultar autor por ID
- Solicita o ID e exibe todos os dados do autor
- Se ID não existir: `"Autor não encontrado."`
- Se ID inválido (zero/negativo): `"ID inválido."`

### Atualizar autor
- Solicita o ID, exibe os dados atuais e permite alterar cada campo
- Deixar em branco mantém o valor atual
- Validações: nome obrigatório, data no formato `AAAA-MM-DD`, nome único (excluindo o próprio ID)
- Se ID não existir: `"Autor não encontrado."`

### Remover autor
- Solicita o ID e remove o autor
- Se ID não existir: `"Autor não encontrado."`
- Se ID inválido: `"ID inválido."`

## Funcionalidades — Clientes

### Cadastrar cliente
- Coleta nome, email, telefone e endereço
- Valida: nome obrigatório, email obrigatório + formato válido, email único (sem duplicidade)
- Email é convertido para minúsculas antes de salvar
- Retorna o ID do cliente cadastrado

### Listar clientes
- Exibe todos os clientes com ID, nome, email, telefone e endereço
- Se não houver clientes: `"Nenhum cliente cadastrado."`

### Consultar cliente por ID
- Solicita o ID e exibe todos os dados do cliente
- Se ID não existir: `"Cliente não encontrado."`
- Se ID inválido (zero/negativo): `"ID inválido."`

### Atualizar cliente
- Solicita o ID, exibe os dados atuais e permite alterar cada campo
- Deixar em branco mantém o valor atual
- Validações: nome obrigatório, email obrigatório + formato válido, email único (excluindo o próprio ID)
- Se ID não existir: `"Cliente não encontrado."`

### Remover cliente
- Solicita o ID e remove o cliente
- Se ID não existir: `"Cliente não encontrado."`
- Se ID inválido: `"ID inválido."`

## Funcionalidades — Livros

### Cadastrar livro
- Coleta título, ano de publicação, gênero e ID do autor
- Exibe lista de autores disponíveis antes de solicitar o ID do autor
- Valida: título obrigatório, ano com 4 dígitos, título único (sem duplicidade), **autor deve existir no banco**
- Se não houver autores cadastrados: `"Nenhum autor cadastrado. Cadastre um autor primeiro."`
- Se autor não existir: `"Autor não encontrado. Cadastre o autor antes de vincular um livro."`
- Retorna o ID do livro cadastrado

### Listar livros
- Exibe todos os livros com ID, título, ano, gênero e ID do autor
- Se não houver livros: `"Nenhum livro cadastrado."`

### Consultar livro por ID
- Solicita o ID e exibe todos os dados do livro
- Se ID não existir: `"Livro não encontrado."`
- Se ID inválido (zero/negativo): `"ID inválido."`

### Atualizar livro
- Solicita o ID, exibe os dados atuais e permite alterar cada campo
- Deixar em branco mantém o valor atual
- Validações: título obrigatório, ano com 4 dígitos, título único (excluindo o próprio ID), autor deve existir
- Se ID não existir: `"Livro não encontrado."`

### Remover livro
- Solicita o ID e remove o livro
- Se ID não existir: `"Livro não encontrado."`
- Se ID inválido: `"ID inválido."`

## Banco de Dados

PostgreSQL com as tabelas:

- `autores` — id, nome, nacionalidade, data_nascimento
- `livros` — id, titulo, ano_publicacao, genero, autor_id (FK)
- `clientes` — id, nome, email, telefone, endereco
- `emprestimos` — id, cliente_id (FK), livro_id (FK), data_emprestimo, data_devolucao, status

Schema completo em `src/database/schema.sql`.

## Configuração

```bash
npm install
npm run build
npm start
```

Variáveis de ambiente (arquivo `.env`):

```
DB_HOST=localhost
PORT=5432
DB_NAME=bookstoredb
DB_USER=postgres
DB_PASSWORD=postgres
```
