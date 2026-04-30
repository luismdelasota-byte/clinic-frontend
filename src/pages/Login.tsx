import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulación: si hay datos, redirige
    if (usernameOrEmail && password) {
      navigate("/dashboard");
    } else {
      alert("Por favor ingresa usuario y contraseña");
    }
  };

  return (
    <div className="login-container">
      <div className="login-image"></div>
      <div className="login-form">
        <div className="login-box">
          <h2>Inicio Sesión</h2>
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