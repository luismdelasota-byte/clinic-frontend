import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { getAllDoctors } from "../services/doctorService";
import clinicaImg from "../assets/imagen_doctores.jpg";


//Importamos libreria chartjs
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
); 

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const [doctorCount, setDoctorCount] = useState<number>(0);

  useEffect(() => {
    const loadDoctors = async () => {
      const data = await getAllDoctors();
      setDoctorCount(data.length);
    };
    loadDoctors();
  }, []);

  const patientTrendData = {
  labels: ["L", "M", "X", "J", "V", "S", "D"],
  datasets: [
    {
      label: "Pacientes",
      data: [5, 8, 6, 10, 12, 7, 9],
      fill: false,
      borderColor: "#0078d4",
      backgroundColor: "#0078d4",
      tension: 0.3,
      pointRadius: 5,
      pointHoverRadius: 7,
    },
  ],
};

const patientTrendOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Tendencia de Pacientes (Últimos 7 Días)",
    },
  },
};


  return (
    <div className={userRole === "ADMIN" ? "dashboard-layout admin-layout" : "dashboard-layout"}>
      {userRole === "ADMIN" && (
        <aside className="sidebar">
          <ul>
            <li onClick={() => navigate("/patients")}>Pacientes</li>
            <li onClick={() => navigate("/appointments")}>Citas</li>
            <li onClick={() => navigate("/doctors")}>Doctores</li>
            <li onClick={() => navigate("/schedule")}>Horarios</li>
            <li onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}>Cerrar sesión</li>
          </ul>
        </aside>
      )}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Bienvenido al sistema clínico</h1>
          <div className="user-info">
            <span>Hola, {userRole}</span>
            <span className="bell">🔔</span>
          </div>
        </header>

        {userRole === "ADMIN" && (
          <>
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
              <div className="card" onClick={() => navigate("/doctors")}>
                <h4>Gestionar Doctores</h4>
                <p>{doctorCount} médicos activos</p>
              </div>
              <div className="card" onClick={() => navigate("/schedule")}>
                <h4>Horario Doctores</h4>
                <p>Ver y editar horarios</p>
              </div>
            </div>
          </section>
          {/* Resumen de Actividad */}
          <section className="activity">
            <h3>Resumen de Actividad Reciente</h3>
            <ul>
              <li>Nueva cita para Pérez, J. (hace 2 horas)</li>
              <li>Doctor Sánchez: horario actualizado (hace 3 horas)</li>
            </ul>
          </section>
          <section className="admin-indicators">
            <h3>Indicadores Clave del Día</h3>
            <div className="indicators-grid">
              <div className="chart-and-indicators">
                <div className="chart">
                  <h4>Tendencia de Pacientes (Últimos 7 Días)</h4>
                  <Line data={patientTrendData} options={patientTrendOptions} />
                </div>
                <div className="indicators-with-image">
                  <div className="indicators-column">
                    <div className="indicator">
                      <h4>Citas de Hoy</h4>
                      <p>12 (8 Confirmadas | 4 Pendientes)</p>
                    </div>
                    <div className="indicator">
                      <h4>Pacientes Nuevos (Semana)</h4>
                      <p>5 (+2 vs la semana pasada)</p>
                    </div>
                    <div className="indicator">
                      <h4>Pacientes en Sala de Espera</h4>
                      <p>4</p>
                    </div>
                  </div>
                  {/*Imagen*/}
                  <div className="documentation">
                    <h2>Documentación</h2>
                      <ul>
                        <li><a href="/diarioClinico">Diario Clínico</a></li>
                        <li><a href="/descansoMedico">Descanso Médico</a></li>
                        <li><a href="/informesMedicos">Informes Médicos</a></li>
                      </ul>
                    <div className="animated-image">
                      <img src={clinicaImg} alt="Imagen clínica" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="quick-actions">
              <h4>Panel de Acciones Rápidas</h4>
              <button onClick={() => navigate("/appointments")}>+ Nueva Cita</button>
              <button onClick={() => navigate("/patients")}>+ Nuevo Registro Paciente</button>
            </div>
          </section>
          </>
        )}

        {userRole === "DOCTOR" && (
          <section className="doctor-section">
            <h3>DOCTOR - Panel de Control</h3>
            <div className="cards">
              <div className="card" onClick={() => navigate("/appointments")}>
                <h4>Agendar Cita</h4>
                <p>Registrar nueva cita</p>
              </div>
              <div className="card" onClick={() => navigate("/patients")}>
                <h4>Registrar Paciente</h4>
                <p>Crear nuevos pacientes</p>
              </div>
              <div className="card" onClick={() => navigate("/schedule")}>
                <h4>Horario Doctores</h4>
                <p>Consultar disponibilidad</p>
              </div>
            </div>
            {/* Resumen de Actividad */}
            <section className="activity">
              <h3>Actividad Reciente (Doctor)</h3>
              <ul>
                <li>Cita atendida hace 1 hora</li>
                <li>Nuevo paciente registrado</li>
              </ul>
            </section>
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
            {/* Resumen de Actividad */}
            <section className="activity">
              <h3>Mi Actividad Reciente</h3>
              <ul>
                <li>Cita confirmada para mañana</li>
                <li>Historial clínico actualizado</li>
              </ul>
            </section>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
