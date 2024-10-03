# Compasscar

Este projeto é uma API CRUD. Ele permite criar, listar, atualizar e excluir carros, com regras de negócio definidas para validações e operações específicas.

## Tecnologias Utilizadas

- Node.js
- Prisma (ORM)
- SQLite (Banco de dados)
- Express (Framework)
- Postman (Testes de API)

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- Node.js
- npm
- Postman

## Instalação

Siga os passos abaixo para configurar o ambiente:

1. Clone o repositório:

   ```sh
   git clone https://github.com/jonathan-laco/desafio1-nodejsSet
   ```

2. Navegue até o diretório do projeto:

   ```sh
   cd desafio1-nodejsSet
   ```

3. Instale as dependências:

   ```sh
   npm  install
   ```

4. Inicie o servidor:

   ```sh
   npm start
   ```

O servidor será iniciado na porta 3000.

## Configuração do Banco de Dados

O banco de dados utilizado é o SQLite, e o arquivo do banco é gerado automaticamente ao rodar as migrações com o Prisma.

## Testando a API com Postman

Você pode usar o Postman para testar os endpoints da API. Abaixo estão os passos para configurar o Postman e os exemplos de chamadas.

### Endpoints Disponíveis

1. **Criar Carro**

   - **Método:** POST
   - **URL:** `http://localhost:3000/api/v1/cars`
   - **Body (JSON):**
     ```json
     {
       "brand": "Volkswagen",
       "model": "GOL",
       "year": 2015,
       "items": ["Ar-condicionado", "Direção Hidráulica", "Trava Elétrica"]
     }
     ```
   - **Resposta Esperada:**
     - Status 201: Carro criado com sucesso
     - Status 409: Já existe um carro com os mesmos dados

2. **Listar Carros**

   - **Método:** GET
   - **URL:** `http://localhost:3000/api/v1/cars/`
   - **URL:** `http://localhost:3000/api/v1/cars?page=1&limit=2`
   - **Resposta Esperada (200):**
     ```json
     {
       "count": 8,
       "pages": 4,
       "data": [
         {
           "id": 1,
           "brand": "Volkswagen",
           "model": "GOL",
           "year": 2015,
           "items": ["Ar-condicionado", "Direção Hidráulica", "Trava Elétrica"]
         }
       ]
     }
     ```
     - Status 204: Nenhum carro encontrado

3. **Atualizar Carro**

   - **Método:** PATCH
   - **URL:** `http://localhost:3000/api/v1/cars/:id`
   - **Body (JSON):**
     ```json
     {
       "brand": "Chevrolet",
       "model": "Onix",
       "year": 2020
     }
     ```
   - **Resposta Esperada:**
     - Status 204: Carro atualizado com sucesso
     - Status 404: Carro não encontrado

4. **Excluir Carro**
   - **Método:** DELETE
   - **URL:** `http://localhost:3000/api/v1/cars/:id`
   - **Resposta Esperada:**
     - Status 204: Carro excluído com sucesso
     - Status 404: Carro não encontrado

## Como Configurar Chamadas no Postman

1. Abra o Postman e clique em `New > HTTP Request`.
2. Escolha o método da requisição (GET, POST, PATCH, DELETE).
3. Insira a URL correspondente do endpoint.
4. Se necessário, vá até a aba `Body`, escolha `raw` e selecione o formato `JSON`. Em seguida, insira os dados do corpo da requisição.
5. Clique em `Send` para testar a requisição.
