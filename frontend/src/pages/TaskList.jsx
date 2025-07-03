import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch("/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        const data = await response.json();
        if (response.ok) {
          setTasks(data);
        } else {
          setError(data.message || "Erro ao buscar tarefas");
        }
      } catch (err) {
        setError("Erro ao conectar ao servidor");
      }
    };
    fetchTasks();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Tem certeza que deseja deletar esta tarefa?")) return;
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao deletar tarefa");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor");
    }
  };

  return (
    <>
      <div className="app-title">ToDo List App</div>
      <div className="card" style={{ maxWidth: 700 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ margin: 0 }}>Minhas Tarefas</h2>
          <button onClick={handleLogout} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>Logout</button>
        </div>
        <button onClick={() => navigate("/tasks/new")} style={{ marginBottom: 18 }}>Nova Tarefa</button>
        {error && <div className="error-msg">{error}</div>}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ background: '#f1f5f9', borderRadius: 10, boxShadow: '0 1px 4px rgba(37,99,235,0.06)', margin: '14px 0', padding: '18px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px 0', color: '#2563eb', fontSize: '1.2rem' }}>{task.title}</h3>
                  <p style={{ margin: 0, color: '#334155', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{task.description}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 16 }}>
                  <button onClick={() => navigate(`/tasks/${task.id}/edit`)} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', marginBottom: 4, fontSize: '0.98rem' }}>Editar</button>
                  <button onClick={() => handleDelete(task.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', fontSize: '0.98rem' }}>Deletar</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default TaskList; 