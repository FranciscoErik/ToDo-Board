# ToDo Board

Um gerenciador de tarefas moderno, com drag & drop, autenticação JWT, backend Node.js/Express e frontend React.

## ✨ Funcionalidades

- Login e cadastro de usuários (JWT)
- Board com colunas (A Fazer, Em Progresso, Concluído)
- Cards de tarefas com título e descrição
- Arrastar e soltar tarefas entre colunas (drag & drop)
- Adicionar, editar e excluir tarefas
- Visual moderno e responsivo
- Logout e rotas protegidas

## 🚀 Tecnologias Utilizadas

### Frontend
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
- CSS moderno

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [SQLite3](https://www.sqlite.org/index.html)
- [jsonwebtoken (JWT)](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [dotenv](https://github.com/motdotla/dotenv)

## 🏗️ Estrutura do Projeto

```
list_temp/
  frontend/         # Frontend React (Vite)
  controllers/
  models/
  routes/
  database/
  server.js         # Backend Express
  package.json
```

## ⚡ Como rodar o projeto

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
O backend estará rodando em `http://localhost:3001`

### 5. Rode o frontend
Em outra aba do terminal:
```bash
cd frontend
npm run dev
```
O frontend estará rodando em `http://localhost:5173`

### 6. Acesse no navegador
- Tela de login/cadastro: [http://localhost:5173](http://localhost:5173)
- Board: após login, você será redirecionado para `/board`

## 🛡️ Autenticação

- O sistema utiliza JWT para proteger as rotas.
- Apenas usuários autenticados podem acessar o board.

## 📦 Observações

- O banco de dados é SQLite e será criado automaticamente na primeira execução.
- Para resetar o banco, basta apagar o arquivo `database/todo.db` e reiniciar o backend.

## 📸 Screenshots

> Adicione aqui prints do board, login, etc.

## 📝 Licença

Este projeto é open-source e está sob a licença MIT.

---

Feito com 💜 por [Seu Nome](https://github.com/seu-usuario) 