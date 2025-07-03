import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

const columnOrder = ["todo", "doing", "done"];
const columnNames = { todo: "A Fazer", doing: "Em Progresso", done: "Concluído" };

function Board() {
  const [columns, setColumns] = useState({ todo: { name: "A Fazer", items: [] }, doing: { name: "Em Progresso", items: [] }, done: { name: "Concluído", items: [] } });
  const [modal, setModal] = useState({ open: false, colId: null, card: null });
  const [form, setForm] = useState({ title: "", description: "", labels: [], deadline: "", attachments: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Buscar tarefas do backend ao carregar
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
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
          // Organizar tarefas por coluna
          const newColumns = { todo: { name: columnNames.todo, items: [] }, doing: { name: columnNames.doing, items: [] }, done: { name: columnNames.done, items: [] } };
          data.forEach((task) => {
            const col = task.status || "todo";
            if (newColumns[col]) newColumns[col].items.push(task);
          });
          setColumns(newColumns);
        } else {
          setError(data.message || "Erro ao buscar tarefas");
        }
      } catch (err) {
        setError("Erro ao conectar ao servidor");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [navigate]);

  // Drag & Drop
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      // Reordenar localmente
      const col = columns[source.droppableId];
      const copiedItems = [...col.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...col,
          items: copiedItems,
        },
      });
    } else {
      // Mover entre colunas (atualizar status no backend)
      const sourceCol = columns[source.droppableId];
      const destCol = columns[destination.droppableId];
      const sourceItems = [...sourceCol.items];
      const destItems = [...destCol.items];
      const [removed] = sourceItems.splice(source.index, 1);
      // Atualizar status no backend
      try {
        const token = localStorage.getItem("token");
        await fetch(`/api/tasks/${removed.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ status: destination.droppableId, title: removed.title, description: removed.description }),
        });
        removed.status = destination.droppableId;
      } catch {}
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceCol,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destCol,
          items: destItems,
        },
      });
    }
  };

  // Modal helpers
  const openAddModal = (colId) => {
    setForm({ title: "", description: "", labels: [], deadline: "", attachments: [] });
    setModal({ open: true, colId, card: null });
  };
  const openEditModal = (colId, card) => {
    setForm({
      title: card.title,
      description: card.description || "",
      labels: card.labels || [],
      deadline: card.deadline || "",
      attachments: card.attachments || [],
    });
    setModal({ open: true, colId, card });
  };
  const closeModal = () => setModal({ open: false, colId: null, card: null });

  // Adicionar ou editar card
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      if (modal.card) {
        // Editar
        const response = await fetch(`/api/tasks/${modal.card.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            status: modal.colId,
          }),
        });
        if (!response.ok) throw new Error();
        setColumns((prev) => {
          const items = prev[modal.colId].items.map((item) =>
            item.id === modal.card.id ? { ...item, ...form, status: modal.colId } : item
          );
          return { ...prev, [modal.colId]: { ...prev[modal.colId], items } };
        });
      } else {
        // Adicionar
        const response = await fetch(`/api/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            status: modal.colId,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error();
        setColumns((prev) => ({
          ...prev,
          [modal.colId]: {
            ...prev[modal.colId],
            items: [data, ...prev[modal.colId].items],
          },
        }));
      }
      closeModal();
    } catch {
      setError("Erro ao salvar tarefa");
    } finally {
      setLoading(false);
    }
  };

  // Excluir card
  const handleDelete = async (colId, cardId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/tasks/${cardId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      setColumns((prev) => ({
        ...prev,
        [colId]: {
          ...prev[colId],
          items: prev[colId].items.filter((item) => item.id !== cardId),
        },
      }));
    } catch {
      setError("Erro ao excluir tarefa");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(120deg, #181824 50vw, #a78bfa 100vw)", padding: 0 }}>
      {/* Menu superior */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '18px 32px 0 0' }}>
        <button onClick={handleLogout} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Logout</button>
      </div>
      <h1 style={{ textAlign: "center", color: "#fff", fontWeight: 700, letterSpacing: 1, padding: "12px 0 18px 0", fontSize: 32 }}>ToDo Board</h1>
      {error && <div style={{ color: '#dc2626', background: '#fee2e2', borderRadius: 4, padding: '6px 10px', margin: '0 auto 18px auto', maxWidth: 400, textAlign: 'center' }}>{error}</div>}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, alignItems: "flex-start", flexWrap: "wrap", paddingBottom: 40 }}>
          {columnOrder.map((colId) => {
            const col = columns[colId];
            return (
              <Droppable droppableId={colId} key={colId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: snapshot.isDraggingOver ? "#ede9fe" : "#fff",
                      borderRadius: 16,
                      minWidth: 290,
                      maxWidth: 320,
                      minHeight: 420,
                      boxShadow: "0 4px 24px rgba(37,99,235,0.08)",
                      padding: 18,
                      margin: "0 8px",
                      transition: "background 0.2s",
                      position: "relative",
                    }}
                  >
                    <h2 style={{ color: "#7c3aed", fontWeight: 700, fontSize: 20, margin: "0 0 18px 0", textAlign: "center" }}>{col.name}</h2>
                    <button onClick={() => openAddModal(colId)} style={{ background: "#a78bfa", color: "#fff", border: "none", borderRadius: 7, padding: "8px 0", width: "100%", fontWeight: 600, fontSize: 15, marginBottom: 12, cursor: "pointer" }}>+ Adicionar</button>
                    {col.items.map((item, idx) => (
                      <Draggable key={item.id} draggableId={item.id.toString()} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: "none",
                              background: snapshot.isDragging ? "#a78bfa22" : "#f3f4f6",
                              borderRadius: 10,
                              boxShadow: snapshot.isDragging ? "0 4px 16px #a78bfa55" : "0 1px 4px rgba(37,99,235,0.06)",
                              padding: "16px 14px 12px 14px",
                              marginBottom: 14,
                              marginTop: 0,
                              position: "relative",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div style={{ fontWeight: 600, color: "#181824", fontSize: 17, marginBottom: 6 }}>{item.title}</div>
                            <div style={{ color: "#555", fontSize: 15, marginBottom: 4, whiteSpace: 'pre-line' }}>{item.description}</div>
                            {/* Futuro: labels, deadline, anexos */}
                            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                              <button onClick={() => openEditModal(colId, item)} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 5, padding: '4px 10px', fontSize: 13, cursor: 'pointer' }}>Editar</button>
                              <button onClick={() => handleDelete(colId, item.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 5, padding: '4px 10px', fontSize: 13, cursor: 'pointer' }}>Excluir</button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
      {/* Modal simples */}
      {modal.open && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#18182499", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 14, boxShadow: "0 4px 32px #a78bfa55", padding: 32, minWidth: 320, maxWidth: 90, display: "flex", flexDirection: "column", gap: 14 }}>
            <h3 style={{ color: "#7c3aed", margin: 0, textAlign: "center" }}>{modal.card ? "Editar Tarefa" : "Nova Tarefa"}</h3>
            <label>Título</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required autoFocus placeholder="Título da tarefa" style={{ fontSize: 16 }} />
            <label>Descrição</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} placeholder="Descrição (opcional)" style={{ fontSize: 15 }} />
            {/* Futuro: campos para labels, deadline, anexos */}
            <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "center" }}>
              <button type="submit" style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>{modal.card ? "Salvar" : "Adicionar"}</button>
              <button type="button" onClick={closeModal} style={{ background: '#64748b', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancelar</button>
            </div>
            {error && <div className="error-msg">{error}</div>}
          </form>
        </div>
      )}
      {loading && <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#18182444', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', fontWeight: 700, fontSize: 22 }}>Carregando...</div>}
    </div>
  );
}

export default Board; 