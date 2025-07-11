Claro! Vou organizar e deixar seu README mais profissional, claro e padronizado, mantendo todo o conteúdo importante.

---

# ToDo Board

Um gerenciador de tarefas moderno, com drag & drop, autenticação JWT, backend em Node.js/Express e frontend em React.

---

## ✨ Funcionalidades

* Cadastro e login de usuários com autenticação JWT
* Board com colunas: **A Fazer**, **Em Progresso** e **Concluído**
* Cards de tarefas com título e descrição
* Arrastar e soltar tarefas entre colunas (drag & drop)
* Adicionar, editar e excluir tarefas
* Visual moderno, responsivo e intuitivo
* Logout e rotas protegidas para usuários autenticados

---

## 🚀 Tecnologias Utilizadas

### Frontend

* [React](https://react.dev/)
* [Vite](https://vitejs.dev/)
* [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
* CSS moderno

### Backend

* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [SQLite3](https://www.sqlite.org/index.html)
* [jsonwebtoken (JWT)](https://github.com/auth0/node-jsonwebtoken)
* [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
* [dotenv](https://github.com/motdotla/dotenv)

---

## 🏗️ Estrutura do Projeto

```
list_temp/
├── frontend/           # Frontend React (Vite)
├── controllers/        # Lógica dos controllers backend
├── models/             # Modelos do banco de dados
├── routes/             # Rotas backend
├── database/           # Arquivo do banco SQLite
├── server.js           # Servidor Express
└── package.json        # Dependências backend
```

---

## ⚡ Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

### 2. Instale as dependências do backend

```bash
npm install
```

### 3. Instale as dependências do frontend

```bash
cd frontend
npm install
```

### 4. Rode o backend

Volte para a raiz do projeto:

```bash
cd ..
npm start
```

O backend estará rodando em: `http://localhost:3001`

### 5. Rode o frontend

Em outra aba do terminal:

```bash
cd frontend
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

### 6. Acesse no navegador

* Tela de login/cadastro: `http://localhost:5173`
* Após login, você será redirecionado para o board em `/board`

---

## 🛡️ Autenticação

* O sistema utiliza JWT para proteger as rotas.
* Apenas usuários autenticados podem acessar o board.

---

## 📦 Observações

* O banco de dados SQLite será criado automaticamente na primeira execução.
* Para resetar o banco, apague o arquivo `database/todo.db` e reinicie o backend.

---

## 📸 Screenshots

> (Adicione aqui screenshots do board, login e demais telas)

---

## 📝 Licença

Este projeto é open-source e está sob a licença MIT.

---

Feito por [Francisco Erik](https://github.com/FranciscoErik)
