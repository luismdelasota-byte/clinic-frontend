import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { getAllDoctors } from "../services/doctorService";
import { getAllPatients } from "../services/patientService";
import { getAllAppointments } from "../services/appointmentService";
import { getAllSchedules } from "../services/scheduleService";
import clinicaImg from "../assets/imagen_doctores.jpg";


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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  // --- Estados con datos reales ---
  const [doctorCount, setDoctorCount] = useState<number>(0);
  const [patientCount, setPatientCount] = useState<number>(0);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [scheduleCount, setScheduleCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // ---  modal simple ---
  const [docModal, setDocModal] = useState<{ open: boolean; type: string | null }>({ open: false, type: null });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctors, patients, appts, schedules] = await Promise.all([
          getAllDoctors(),
          getAllPatients(),
          getAllAppointments(),
          getAllSchedules(),
        ]);
        setDoctorCount(doctors.length);
        setPatientCount(patients.length);
        setAppointments(appts);
        setScheduleCount(schedules.length);
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userRole === "ADMIN") loadData();
  }, [userRole]);

  // --- Indicadores calculados desde appointments ---
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(a => a.date?.startsWith(today));
  const confirmedToday = todayAppointments.filter(a => a.status === "CONFIRMED").length;
  const pendingToday = todayAppointments.filter(a => a.status === "PENDING").length;

  // Pacientes nuevos esta semana (últimos 7 días)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const newPatientsWeek = appointments.filter(a => new Date(a.date) >= weekAgo).length;

  // Tendencia: citas por día últimos 7 días
  const days = ["L", "M", "X", "J", "V", "S", "D"];
  const trendData = Array(7).fill(0).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    return appointments.filter(a => a.date?.startsWith(key)).length;
  });

  const patientTrendData = {
    labels: days,
    datasets: [{
      label: "Citas",
      data: trendData,
      fill: false,
      borderColor: "#0078d4",
      backgroundColor: "#0078d4",
      tension: 0.3,
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  };

  const patientTrendOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" as const },
      title: { display: true, text: "Citas por Día (Últimos 7 Días)" },
    },
  };

  // --- Modal de Documentación ---
  const docContent: Record<string, string> = {
    diarioClinico: `Total de citas registradas: ${appointments.length}. Hoy: ${todayAppointments.length}.`,
    descansoMedico: `Doctores activos: ${doctorCount}. Horarios configurados: ${scheduleCount}.`,
    informesMedicos: `Pacientes totales: ${patientCount}. Nuevos esta semana: ${newPatientsWeek}.`,
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
            <li onClick={() => { localStorage.clear(); navigate("/login"); }}>Cerrar sesión</li>
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
              {loading ? <p>Cargando datos...</p> : (
                <div className="cards">
                  <div className="card" onClick={() => navigate("/patients")}>
                    <h4>Gestionar Pacientes</h4>
                    <p>{patientCount} pacientes registrados</p>
                  </div>
                  <div className="card" onClick={() => navigate("/appointments")}>
                    <h4>Gestionar Citas</h4>
                    <p>{appointments.length} citas en total</p>
                  </div>
                  <div className="card" onClick={() => navigate("/doctors")}>
                    <h4>Gestionar Doctores</h4>
                    <p>{doctorCount} médicos activos</p>
                  </div>
                  <div className="card" onClick={() => navigate("/schedule")}>
                    <h4>Horario Doctores</h4>
                    <p>{scheduleCount} horarios configurados</p>
                  </div>
                </div>
              )}
            </section>

            <section className="admin-indicators">
              <h3>Indicadores Clave del Día</h3>
              <div className="indicators-grid">
                {/* Columna 1: Gráfico */}
                <div className="chart">
                  <h4>Tendencia de Citas (Últimos 7 Días)</h4>
                  <Line data={patientTrendData} options={patientTrendOptions} />
                </div>

                {/* Columna 2: Indicadores */}
                <div className="indicators-column">
                  <div className="indicator">
                    <h4>Citas de Hoy</h4>
                    {loading
                      ? <p>Cargando...</p>
                      : <p>{todayAppointments.length} ({confirmedToday} Confirmadas | {pendingToday} Pendientes)</p>
                    }
                  </div>
                  <div className="indicator">
                    <h4>Citas Nuevas (Semana)</h4>
                    {loading ? <p>Cargando...</p> : <p>{newPatientsWeek}</p>}
                  </div>
                  <div className="indicator">
                    <h4>Total Pacientes</h4>
                    {loading ? <p>Cargando...</p> : <p>{patientCount}</p>}
                  </div>
                </div>

                {/* Columna 3: Documentación */}
                <div className="documentation">
                  <h2>Documentación</h2>
                  <ul>
                    <li>
                      <button onClick={() => setDocModal({ open: true, type: "diarioClinico" })}>
                        Diario Clínico
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setDocModal({ open: true, type: "descansoMedico" })}>
                        Descanso Médico
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setDocModal({ open: true, type: "informesMedicos" })}>
                        Informes Médicos
                      </button>
                    </li>
                  </ul>
                  <div className="animated-image">
                    <img src={clinicaImg} alt="Imagen clínica" />
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h4>Panel de Acciones Rápidas</h4>
                <button onClick={() => navigate("/appointments")}>+ Nueva Cita</button>
                <button onClick={() => navigate("/patients")}>+ Nuevo Registro Paciente</button>
              </div>
            </section>

            {/* Modal de Documentación */}
            {docModal.open && docModal.type && (
              <div className="modal-overlay" onClick={() => setDocModal({ open: false, type: null })}>
                <div className="modal-box" onClick={e => e.stopPropagation()}>
                  <h3>
                    {docModal.type === "diarioClinico" && "Diario Clínico"}
                    {docModal.type === "descansoMedico" && "Descanso Médico"}
                    {docModal.type === "informesMedicos" && "Informes Médicos"}
                  </h3>
                  <p>{docContent[docModal.type]}</p>
                  <button onClick={() => setDocModal({ open: false, type: null })}>Cerrar</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* DOCTOR y PATIENT sin cambios */}
        {userRole === "DOCTOR" && (
          <section className="doctor-section">
            <h3>DOCTOR - Panel de Control</h3>
            <div className="cards">
              <div className="card" onClick={() => navigate("/doctor/appointments")}><h4>Mis citas</h4></div>
              <div className="card" onClick={() => navigate("/patients")}><h4>Registrar Paciente</h4><p>Crear nuevos pacientes</p></div>
              <div className="card" onClick={() => navigate("/schedule")}><h4>Horario Doctores</h4><p>Consultar disponibilidad</p></div>
            </div>
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
              <div className="card" onClick={() => navigate("/patient/appointments")}><h4>Mis Citas</h4><p>Ver próximas citas</p></div>
              <div className="card"><h4>Mi Historial Clínico</h4><p>Acceso a tu historial</p></div>
              <div className="card"><h4>Perfil Personal</h4><p>Editar información personal</p></div>
            </div>
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