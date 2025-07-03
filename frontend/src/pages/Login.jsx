import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/board");
      } else {
        setError(data.message || "Falha no login");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          {/* Ícone SVG simples para simular um logo */}
          <svg className="login-logo-icon" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke="#a78bfa" strokeWidth="4"/><circle cx="20" cy="20" r="10" stroke="#a78bfa" strokeWidth="4"/><circle cx="20" cy="20" r="4" fill="#a78bfa"/></svg>
          <span style={{ fontWeight: 700, fontSize: 22, color: '#181824', letterSpacing: 1 }}>ToDoList</span>
        </div>
        <div className="login-title">Acesse a plataforma</div>
        <div className="login-subtitle">Faça login ou registre-se para começar a organizar suas tarefas hoje mesmo.</div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit">Entrar</button>
        </form>
        <div style={{ textAlign: "center", marginTop: 10, fontSize: '1rem' }}>
          Ainda não tem uma conta?
          <Link to="/register" className="login-link">Inscreva-se</Link>
        </div>
      </div>
    </div>
  );
}

export default Login; 