import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.css";

const Login: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Rol seleccionado desde la pantalla anterior
  const selectedRole = localStorage.getItem("selectedRole");
  console.log("Rol seleccionado antes del login:", selectedRole);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await api.post("/auth/login", {
      usernameOrEmail,
      password,
    });

    const realRole = response.data.role;
    const selectedRole = localStorage.getItem("selectedRole");

    localStorage.removeItem("selectedRole");
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", realRole);



    if (selectedRole && selectedRole !== realRole) {
      alert(
        `Ingresaste como ${selectedRole}, pero tu rol real es ${realRole}. Por favor, vuelve a seleccionar tu rol correcto.`
      );
      navigate("/"); // vuelve a la pantalla de selección
    } else {
      navigate("/dashboard"); // entra al dashboard si el rol coincide
    }
  } catch (error) {
    alert("Credenciales incorrectas o error en el servidor");
    console.error("Error en login:", error);
  }
};

  return (
    <div className="login-container">
      <div className="login-image"></div>
      <div className="login-form">
        <div className="login-box">
          <h2>Inicio de Sesión</h2>
          {selectedRole && (
            <p className="selected-role-text">
              Inicia sesión como <strong>{selectedRole}</strong>
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Usuario o Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Ingresar</button>
            <p>
              ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

