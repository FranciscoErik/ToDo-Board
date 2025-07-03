const axios = require('axios');

const API = 'http://localhost:3001';
const user = {
  name: 'Erik Rodrigues',
  email: 'erik@gmail.com',
  password: 'suasenha'
};

const task = {
  title: 'Minha primeira tarefa'
};

async function main() {
  try {
    // Signup
    console.log('== Signup ==');
    await axios.post(`${API}/auth/signup`, user).catch(e => {
      if (e.response && e.response.status === 409) {
        console.log('Usuário já existe, continuando...');
      } else {
        throw e;
      }
    });

    // Login
    console.log('== Login ==');
    const loginRes = await axios.post(`${API}/auth/login`, {
      email: user.email,
      password: user.password
    });
    const token = loginRes.data.token;
    console.log('Token:', token);

    // Criar tarefa
    console.log('== Criar tarefa ==');
    const createRes = await axios.post(`${API}/tasks`, task, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Tarefa criada:', createRes.data);
    const taskId = createRes.data.id;

    // Listar tarefas
    console.log('== Listar tarefas ==');
    const listRes = await axios.get(`${API}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Tarefas:', listRes.data);

    // Atualizar tarefa
    console.log('== Atualizar tarefa ==');
    await axios.put(`${API}/tasks/${taskId}`, {
      title: 'Tarefa atualizada',
      done: true
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Tarefa atualizada!');

    // Deletar tarefa
    console.log('== Deletar tarefa ==');
    await axios.delete(`${API}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Tarefa deletada!');
  } catch (err) {
    console.error('Erro:', err);
  }
}

main(); 