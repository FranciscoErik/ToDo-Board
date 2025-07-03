import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskList from "./pages/TaskList";
import TaskForm from "./pages/TaskForm";
import PrivateRoute from "./components/PrivateRoute";
import Board from "./pages/Board";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/board" element={<PrivateRoute><Board /></PrivateRoute>} />
      {/* Rotas antigas podem ser removidas ou redirecionadas */}
      <Route path="/tasks" element={<Navigate to="/board" />} />
      <Route path="/tasks/new" element={<Navigate to="/board" />} />
      <Route path="/tasks/:id/edit" element={<Navigate to="/board" />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
