import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // vuelve a la pantalla de selección
  };

  return (
    <div className="dashboard-container">
      <h1>Clínica San Luis</h1>
      <h2>Bienvenido al sistema clínico</h2>

      {userRole === "ADMIN" && (
        <section className="admin-section">
          <h3>ADMIN - Panel de Control</h3>
          <div className="cards">
            <button>Gestionar Pacientes</button>
            <button>Gestionar Doctores</button>
            <button>Ver Reportes</button>
            <button>Horario Doctores</button>
          </div>
          <p>Hola, Admin</p>
        </section>
      )}

      {userRole === "USER" && (
        <section className="user-section">
          <h3>USER - Área del Cajero</h3>
          <div className="cards">
            <button>Agendar Cita</button>
            <button>Reprogramar Cita</button>
            <button>Ver Historial Clínico</button>
            <button>Horario Doctores</button>
          </div>
          <p>Hola, Usuario</p>
        </section>
      )}

      {userRole === "DOCTOR" && (
        <section className="doctor-section">
          <h3>DOCTOR - Área del Médico</h3>
          <div className="cards">
            <button>Mis Pacientes</button>
            <button>Mis Citas</button>
            <button>Historial Clínico</button>
          </div>
          <p>Hola, Dr. Pérez</p>
        </section>
      )}

      {userRole === "PATIENT" && (
        <section className="patient-section">
          <h3>PACIENTE - Mi Espacio</h3>
          <div className="cards">
            <button>Mis Citas</button>
            <button>Mi Historial Clínico</button>
            <button>Perfil Personal</button>
          </div>
          <p>Hola, Luis</p>
        </section>
      )}

      <footer className="footer-nav">
        <button>Inicio</button>
        <button>Mensajes 🔔</button>
        <button>Ajustes ⚙️</button>
        <button onClick={handleLogout}>Cerrar sesión 🚪</button>
      </footer>
    </div>
  );
};

export default Dashboard;