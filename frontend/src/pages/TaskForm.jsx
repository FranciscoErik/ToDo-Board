import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // Editar: buscar dados da tarefa
      const fetchTask = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(`/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          const data = await response.json();
          if (response.ok) {
            setTitle(data.title);
            setDescription(data.description);
          } else {
            setError(data.message || "Erro ao buscar tarefa");
          }
        } catch (err) {
          setError("Erro ao conectar ao servidor");
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const token = localStorage.getItem("token");
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/tasks/${id}` : "/api/tasks";
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      if (response.ok) {
        navigate("/tasks");
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao salvar tarefa");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="app-title">ToDo List App</div>
      <div className="card">
        <h2 style={{ textAlign: "center", marginBottom: 18 }}>{id ? "Editar Tarefa" : "Nova Tarefa"}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label>Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="submit" disabled={loading}>
              {loading ? "Salvando..." : id ? "Salvar Alterações" : "Criar Tarefa"}
            </button>
            <button type="button" onClick={() => navigate("/tasks")}
              style={{ background: '#64748b' }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default TaskForm; 