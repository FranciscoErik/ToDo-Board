import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Cadastro realizado com sucesso! Faça login.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message || "Falha no cadastro");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor");
    }
  };

  return (
    <>
      <div className="app-title">ToDo List App</div>
      <div className="card">
        <h2 style={{ textAlign: "center", marginBottom: 18 }}>Cadastro</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          <button type="submit">Cadastrar</button>
        </form>
        <div style={{ textAlign: "center", marginTop: 10 }}>
          Já tem conta?
          <Link to="/login" className="link-btn">Faça login</Link>
        </div>
      </div>
    </>
  );
}

export default Register; 