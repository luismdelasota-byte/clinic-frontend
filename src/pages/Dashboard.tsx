import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const [openPatients, setOpenPatients] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar o barra lateral(navegacion)*/}
      <aside className="sidebar">
        <h2>Clínica San Luis</h2>
        <ul>
          <li onClick={() => setOpenPatients(!openPatients)}>
            Pacientes
            {openPatients && (
              <ul className="submenu">
                <li onClick={() => navigate("/patients/register")}>Registrar</li>
                <li onClick={() => navigate("/patients/citas")}>Citas</li>
              </ul>
            )}
          </li>
          <li onClick={() => navigate("/doctors")}>Doctores</li>
          <li onClick={handleLogout}>Cerrar sesión</li>
        </ul>
      </aside>
      {/* Main content o contenido principal */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Bienvenido al sistema clínico</h1>
          <div className="user-info">
            <span>Hola, {userRole}</span>
            <span className="bell">🔔</span>
          </div>
        </header>

        {/* Sección por rol */}
        {userRole === "ADMIN" && (
          <section className="admin-section">
            <h3>ADMIN - Panel de Control</h3>
            <div className="cards">
              <div className="card" onClick={() => navigate("/patients")}>
                <h4>Gestionar Pacientes</h4>
                <p>Ver y editar registros de pacientes</p>
              </div>
              <div className="card" onClick={() => navigate("/appointments")}>
                <h4>Gestionar Citas</h4>
                <p>Agendar y/o reprogramar citas</p>
              </div>
              <div className="card" onClick={() => navigate("/doctors")} >
                <h4>Gestionar Doctores</h4>
                <p>4 médicos activos</p>
              </div>
              <div className="card" onClick={() => navigate("/schedule")}>
                <h4>Horario Doctores</h4>
                <p>Ver y editar horarios</p>
              </div>
            </div>
          </section>
        )}

        {userRole === "USER" && (
          <section className="user-section">
            <h3>USER - Área del Cajero</h3>
            <div className="cards">
              <div className="card">
                <h4>Agendar Cita</h4>
                <p>Registrar nueva cita</p>
              </div>
              <div className="card">
                <h4>Reprogramar Cita</h4>
                <p>Modificar citas existentes</p>
              </div>
              <div className="card">
                <h4>Ver Historial Clínico</h4>
                <p>Acceso rápido a historial</p>
              </div>
              <div className="card">
                <h4>Horario Doctores</h4>
                <p>Consultar disponibilidad</p>
              </div>
            </div>
          </section>
        )}

        {userRole === "DOCTOR" && (
          <section className="doctor-section">
            <h3>DOCTOR - Área del Médico</h3>
            <div className="cards">
              <div className="card">
                <h4>Mis Pacientes</h4>
                <p>Lista de pacientes asignados</p>
              </div>
              <div className="card">
                <h4>Mis Citas</h4>
                <p>Agenda de consultas</p>
              </div>
              <div className="card">
                <h4>Historial Clínico</h4>
                <p>Acceso a registros médicos</p>
              </div>
            </div>
          </section>
        )}

        {userRole === "PATIENT" && (
          <section className="patient-section">
            <h3>PACIENTE - Mi Espacio</h3>
            <div className="cards">
              <div className="card">
                <h4>Mis Citas</h4>
                <p>Ver próximas citas</p>
              </div>
              <div className="card">
                <h4>Mi Historial Clínico</h4>
                <p>Acceso a tu historial</p>
              </div>
              <div className="card">
                <h4>Perfil Personal</h4>
                <p>Editar información personal</p>
              </div>
            </div>
          </section>
        )}

        {/* Actividad reciente */}
        <section className="activity">
          <h3>Resumen de Actividad Reciente</h3>
          <ul>
            <li>Nueva cita para Pérez, J. (hace 2 horas)</li>
            <li>Doctor Sánchez: horario actualizado (hace 3 horas)</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;