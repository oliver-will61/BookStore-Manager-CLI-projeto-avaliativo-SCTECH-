# BookStore Manager CLI

Sistema de gerenciamento de livraria via terminal (CLI) com PostgreSQL e TypeScript.

---

## Descrição do Projeto

Aplicação CLI para gerenciamento de uma livraria, permitindo cadastrar autores, livros, clientes e empréstimos, além de gerar relatórios. O sistema segue arquitetura em camadas (Menu → Controller → Service → Repository → BaseRepository → DB) e utiliza PostgreSQL como banco de dados relacional.

---

## Objetivo

Oferecer uma interface de terminal para operações CRUD completas sobre as entidades de uma livraria, com validações de negócio, controle de disponibilidade de exemplares e relatórios com consultas SQL utilizando JOINs, agregações e ordenação.

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|--- |
| `Node.js` | ≥ 18 | Runtime |
| `TypeScript` | ≥ 5 | Linguagem e tipagem |
| `PostgreSQL` | ≥ 14 | Banco de dados relacional |
| `pg` | ^8.22.0 | Driver PostgreSQL para Node.js |
| `dotenv` | ^17.4.2 | Gerenciamento de variáveis de ambiente |
| `readline` | nativo | Interface de terminal (CLI) |

---

## Requisitos para Execução

- Node.js 18 ou superior
- PostgreSQL 14 ou superior
- npm (acompanha o Node.js)
- Um banco de dados PostgreSQL criado (ver seção abaixo)

---

## Configuração do Banco de Dados

### 1. Criar o banco de dados

Acesse o PostgreSQL e crie o banco:

```sql
CREATE DATABASE bookstoredb;
CREATE USER bookstoresctechuser WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE bookstoredb TO bookstoresctechuser;
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookstoredb
DB_USER=bookstoresctechuser
DB_PASSWORD=sua_senha
```

### 3. Executar o schema

Execute o script SQL para criar as tabelas e popular com dados iniciais:

```bash
psql -U bookstoresctechuser -d bookstoredb -f src/database/schema.sql
```

### Estrutura das tabelas

```sql
autores (id SERIAL PK, nome VARCHAR NOT NULL UNIQUE, nacionalidade VARCHAR, data_nascimento DATE)

livros (id SERIAL PK, titulo VARCHAR NOT NULL UNIQUE, ano_publicacao INTEGER, genero VARCHAR, autor_id INTEGER FK → autores.id, quantidade INTEGER NOT NULL DEFAULT 1)

clientes (id SERIAL PK, nome VARCHAR NOT NULL, email VARCHAR NOT NULL UNIQUE, telefone VARCHAR, endereco VARCHAR)

emprestimos (id SERIAL PK, cliente_id INTEGER FK → clientes.id, livro_id INTEGER FK → livros.id, data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE, data_devolucao DATE, status VARCHAR NOT NULL DEFAULT 'emprestado')
```

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/oliver-will61/BookStore-Manager-CLI-projeto-avaliativo-SCTECH-/tree/main
cd bookstore-manager-cli

# Instale as dependências
npm install
```

---

## Execução

```bash
# Compilar TypeScript para JavaScript
npm run build

# Iniciar a aplicação
npm start
```

O menu principal será exibido no terminal:

```
=== BookStore Manager CLI ===

1 - Autores
2 - Livros
3 - Clientes
4 - Empréstimos
5 - Relatórios
6 - Encerrar aplicação

Escolha uma opção:
```

---

## Arquitetura do Projeto

```
Usuário → Menu → Controller → Service → Repository → BaseRepository → DB
```

### Camadas

| Camada | Responsabilidade | Não faz |
|---|---|---|
| **Menu** | I/O com usuário (perguntas, exibição) | Lógica de negócio, acesso a banco |
| **Controller** | Orquestração, try/catch, resposta padronizada | Regras de negócio |
| **Service** | Validações e regras de negócio | SQL, acesso a banco |
| **Repository** | Mapeamento de tipos, delega ao BaseRepository | Montagem de SQL |
| **BaseRepository** | CRUD genérico com SQL parametrizado | Conhecimento das entidades |
| **DB** | Pool de conexão PostgreSQL | — |

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

### Padrão de resposta dos Controllers

Todas as funções de controller retornam um objeto padronizado:

```typescript
{ sucesso: boolean; mensagem: string; ...dadosDaEntidade }
```

Se `sucesso` for `false`, a mensagem explica o erro (validação, banco, etc.). O menu apenas exibe a mensagem — sem lógica condicional complexa.

### Principais decisões técnicas

| Decisão | Motivo |
|---|---|
| SQL dinâmico no BaseRepository | Evita repetição de consultas idênticas entre entidades |
| Whitelist de tabelas | Previne SQL injection via nome de tabela |
| Parâmetros `$1`, `$2`, ... | Previne SQL injection via valores |
| `RETURNING *` em INSERT/UPDATE | Retorna o registro completo (incluindo ID gerado) sem query extra |
| Classes de modelo (`Autor`, `Cliente`, etc.) | Tipagem forte e método `fromRow()` para conversão |
| Função `validarId()` | Centraliza validação de IDs em um único lugar |
| Função `extrairMensagemErro()` | Centraliza extração de mensagens de erro em catch |
| `console.clear()` no início do loop | Interface limpa a cada navegação |
| `pool.on("error")` | Previne crash por falhas assíncronas de conexão |

---

## Funcionalidades Implementadas

### Autores

| Operação | Descrição |
|---|---|
| Cadastrar | Nome, nacionalidade, data de nascimento. Valida nome obrigatório, formato AAAA-MM-DD, nome único. |
| Listar | Exibe todos os autores cadastrados. |
| Consultar por ID | Exibe dados completos de um autor específico. |
| Atualizar | Altera dados mantendo valores atuais se campo deixado em branco. |
| Remover | Exclui autor do banco. |

### Clientes

| Operação | Descrição |
|---|---|
| Cadastrar | Nome, email, telefone, endereço. Valida nome e email obrigatórios, formato de email, email único (case-insensitive). |
| Listar | Exibe todos os clientes cadastrados. |
| Consultar por ID | Exibe dados completos de um cliente específico. |
| Atualizar | Altera dados mantendo valores atuais se campo deixado em branco. |
| Remover | Exclui cliente do banco. |

### Livros

| Operação | Descrição |
|---|---|
| Cadastrar | Título, ano, gênero, autor (selecionado de lista), quantidade. Valida título obrigatório e único, ano com 4 dígitos, autor existente, quantidade inteira positiva. |
| Listar | Exibe todos os livros cadastrados. |
| Consultar por ID | Exibe dados completos de um livro específico. |
| Atualizar | Altera dados mantendo valores atuais se campo deixado em branco. |
| Remover | Exclui livro do banco. |

### Empréstimos

| Operação | Descrição |
|---|---|
| Registrar | Seleciona cliente e livro (com disponibilidade). Valida cliente e livro existentes, calcula disponibilidade = `quantidade - empréstimos ativos`. Define `data_emprestimo` = hoje, `data_devolucao` = hoje + 7 dias, status = `emprestado`. |
| Listar | Exibe todos os empréstimos com nome do cliente e título do livro (JOIN). |
| Consultar por ID | Exibe dados completos com nome do cliente e título do livro. |
| Devolver | Registra devolução: define `data_devolucao` = hoje, status = `devolvido`. Impede devolução duplicada. |

### Relatórios

| Relatório | Descrição | SQL |
|---|---|---|
| Livros Disponíveis | Livros com exemplares disponíveis (quantidade > empréstimos ativos) | `LEFT JOIN` + subquery + `WHERE` |
| Livros Emprestados | Livros com pelo menos um empréstimo ativo | `JOIN` + subquery + `ORDER BY` |
| Livros por Autor | Contagem de livros por autor | `LEFT JOIN` + `COUNT` + `GROUP BY` |
| Empréstimos por Livro | Total de empréstimos por livro (top 10) | `LEFT JOIN` + `COUNT` + `GROUP BY` + `ORDER BY DESC` + `LIMIT 10` |
| Clientes com Empréstimos Ativos | Clientes com empréstimos em aberto (top 10) | `JOIN` + `COUNT` + `GROUP BY` + `ORDER BY DESC` + `LIMIT 10` |

### Tratamento de Erros

O sistema captura e exibe mensagens claras sem interromper a execução nos seguintes casos:

- Autor inexistente ao cadastrar/atualizar livro
- Cliente inexistente ao registrar empréstimo
- Livro inexistente ao registrar empréstimo
- Empréstimo inexistente ao tentar devolver
- Livro sem exemplares disponíveis
- Registros duplicados (nome de autor, email de cliente, título de livro)
- Campos obrigatórios vazios
- IDs inválidos (zero/negativo)
- Formato inválido de data, email, ano ou quantidade
- Livro já devolvido
- Erros de conexão com o banco de dados

---

## Estrutura de Pastas

```
src/
├── main.ts                          # Ponto de entrada da aplicação
├── controllers/                     # Camada de orquestração
│   ├── autorController.ts
│   ├── clienteController.ts
│   ├── emprestimoController.ts
│   ├── livroController.ts
│   └── relatoriosController.ts
├── database/                        # Conexão e schema do banco
│   ├── connection.ts
│   └── schema.sql
├── menus/                           # Interface com o usuário
│   ├── menu.ts                      # Classe abstrata base
│   ├── mainMenu.ts                  # Menu principal
│   ├── autoresMenu.ts
│   ├── clientesMenu.ts
│   ├── emprestimosMenu.ts
│   ├── livrosMenu.ts
│   └── relatoriosMenu.ts
├── models/
│   ├── classes/                     # Modelos de domínio
│   │   ├── Autor.ts
│   │   ├── BaseRepository.ts        # CRUD genérico
│   │   ├── Cliente.ts
│   │   ├── Emprestimo.ts
│   │   └── Livro.ts
│   └── interfaces/                  # Interfaces de dados
│       ├── AutorInterface.ts
│       ├── ClienteInterface.ts
│       ├── EmprestimoInterface.ts
│       ├── LivroInterface.ts
│       └── RelatorioInterface.ts
├── repositories/                    # Acesso a dados
│   ├── autorRepository.ts
│   ├── clienteRepository.ts
│   ├── emprestimoRepository.ts
│   ├── livroRepository.ts
│   └── relatoriosRepository.ts
├── services/                        # Regras de negócio
│   ├── autorService.ts
│   ├── clienteService.ts
│   ├── emprestimoService.ts
│   ├── livroService.ts
│   └── relatoriosService.ts
└── utils/                           # Utilitários
    ├── formatDate.ts
    └── validators.ts                # validarId() e extrairMensagemErro()
```

---

## Exemplos de Utilização

### Cadastrar um autor

```
=== Gerenciar Autores ===

1 - Cadastrar autor
2 - Listar autores
3 - Consultar autor por ID
4 - Atualizar autor
5 - Remover autor
6 - Voltar

Escolha uma opção: 1
Nome: J. R. R. Tolkien
Nacionalidade: Britânica
Data de nascimento (AAAA-MM-DD): 1892-01-03
Autor cadastrado com sucesso! ID: 1
```

### Registrar um empréstimo

```
=== Gerenciar Empréstimos ===

1 - Registrar empréstimo
2 - Listar empréstimos
3 - Consultar empréstimo por ID
4 - Devolver livro
5 - Voltar

Escolha uma opção: 1

--- Clientes cadastrados ---
ID: 1 | Nome: Maria Silva | Email: maria@email.com
ID: 2 | Nome: João Santos | Email: joao@email.com

ID do cliente: 1

--- Livros disponíveis ---
ID: 1 | Título: O Senhor dos Anéis | Disponíveis: 3
ID: 2 | Título: 1984 | Disponíveis: 2

ID do livro: 1
Empréstimo registrado com sucesso! ID: 1
```

### Consultar relatório de livros mais emprestados

```
=== Relatórios ===

1 - Livros disponíveis
2 - Livros emprestados
3 - Livros por autor
4 - Empréstimos por livro
5 - Clientes com empréstimos ativos
6 - Voltar

Escolha uma opção: 4

ID: 1 | Título: O Senhor dos Anéis | Autor: J. R. R. Tolkien | Total de empréstimos: 5
ID: 3 | Título: Dom Casmurro | Autor: Machado de Assis | Total de empréstimos: 3
...
5 livro(s) encontrado(s).
```

---

## Integrantes da Equipe

- **Willian de  Oliveira Ribeiro** 
- *(Projeto individual)*

---

## Link do Kanban

[Kanban do Projeto] — *https://trello.com/invite/b/6a515aec27b890fe13dfe472/ATTI074b4f8638a99af6e1ca77557de29ab739C910AD/bookstore-manager-cli*
