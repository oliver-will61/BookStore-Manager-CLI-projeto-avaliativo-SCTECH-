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
