import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointmentsByDoctor } from "../services/appointmentService";
import { Calendar, User, Phone, Mail, Clock, ArrowLeft, CheckCircle, XCircle, AlertCircle, Filter } from "lucide-react";
import "../styles/DoctorAppointments.css";

interface Appointment {
  id: number;
  appointmentDate: string;
  status: string;
  patient: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

const DoctorAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    if (doctorId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [doctorId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAppointmentsByDoctor(Number(doctorId));
      
      // Ordenar citas por fecha descendente
      const sortedData = data.sort((a: Appointment, b: Appointment) => 
        new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
      );
      
      setAppointments(sortedData);
      
      // Establecer el mes actual por defecto si hay citas
      if (sortedData.length > 0) {
        const currentMonth = new Date().toISOString().substring(0, 7); // Formato "YYYY-MM"
        
        // Si hay citas en el mes actual, lo seleccionamos, si no, el mes de la cita más reciente
        const hasCurrentMonth = sortedData.some((a: Appointment) => a.appointmentDate.startsWith(currentMonth));
        if (hasCurrentMonth) {
          setSelectedMonth(currentMonth);
        } else {
          setSelectedMonth(sortedData[0].appointmentDate.substring(0, 7));
        }
      }
    } catch (err) {
      console.error("Error cargando citas:", err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener lista única de meses disponibles (formato YYYY-MM)
  const availableMonths = Array.from(new Set(appointments.map(a => a.appointmentDate.substring(0, 7)))).sort().reverse();

  // Función para formatear el mes (Ej: "2026-05" -> "Mayo 2026")
  const formatMonthName = (yearMonth: string) => {
    if (!yearMonth) return "";
    const [year, month] = yearMonth.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthName = date.toLocaleString('es-ES', { month: 'long' });
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
  };

  // Filtrar citas por mes seleccionado
  const filteredAppointments = appointments.filter(a => a.appointmentDate.startsWith(selectedMonth));

  // Separar en Próximas y Pasadas
  const upcomingAppointments = filteredAppointments.filter(a => a.status === "SCHEDULED" || a.status === "PENDING");
  const pastAppointments = filteredAppointments.filter(a => a.status === "COMPLETED" || a.status === "CANCELLED");

  // Función para formatear fecha y hora
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });
    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return { day, time };
  };

  // Íconos y colores por estado
  const getStatusConfig = (status: string) => {
    switch(status) {
      case "SCHEDULED":
      case "PENDING":
        return { icon: <AlertCircle size={18} />, color: "status-scheduled", label: "Programada" };
      case "COMPLETED":
        return { icon: <CheckCircle size={18} />, color: "status-completed", label: "Completada" };
      case "CANCELLED":
        return { icon: <XCircle size={18} />, color: "status-cancelled", label: "Cancelada" };
      default:
        return { icon: <AlertCircle size={18} />, color: "status-default", label: status };
    }
  };

  if (loading) {
    return <div className="doctor-appointments-wrapper"><div className="loading-spinner">Cargando tu agenda...</div></div>;
  }

  return (
    <div className="doctor-appointments-wrapper">
      <div className="doctor-appointments-container animate-fade-in">
        
        {/* Header Section */}
        <div className="appointments-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={20} />
              <span>Volver al Dashboard</span>
            </button>
            <h1>Mis Citas Médicas</h1>
            <p className="subtitle">Administra tu agenda y revisa tu historial de pacientes.</p>
          </div>
          
          <div className="header-right">
            <div className="month-filter-glass">
              <Filter size={18} className="filter-icon" />
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="month-select"
              >
                {availableMonths.length === 0 ? (
                  <option value="">Sin citas registradas</option>
                ) : (
                  availableMonths.map(month => (
                    <option key={month} value={month}>{formatMonthName(month)}</option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="empty-state-glass">
            <Calendar size={64} opacity={0.2} />
            <h2>No tienes citas registradas</h2>
            <p>Aún no hay citas en tu historial médico.</p>
          </div>
        ) : (
          <div className="appointments-content">
            
            {/* Próximas Citas */}
            <section className="appointment-section">
              <h2 className="section-title">
                Próximas Citas <span className="badge-count badge-blue">{upcomingAppointments.length}</span>
              </h2>
              
              {upcomingAppointments.length === 0 ? (
                <div className="no-appointments-box">No tienes citas pendientes este mes.</div>
              ) : (
                <div className="cards-grid">
                  {upcomingAppointments.map(appt => {
                    const { day, time } = formatDateTime(appt.appointmentDate);
                    const config = getStatusConfig(appt.status);
                    
                    return (
                      <div key={appt.id} className="appointment-card glass-card">
                        <div className="card-top">
                          <div className="date-badge">
                            <span className="day">{day}</span>
                            <span className="time"><Clock size={14} /> {time}</span>
                          </div>
                          <div className={`status-badge ${config.color}`}>
                            {config.icon} {config.label}
                          </div>
                        </div>
                        
                        <div className="card-body">
                          <div className="patient-info">
                            <div className="avatar">
                              <User size={24} color="#0f172a" />
                            </div>
                            <div>
                              <h3>{appt.patient.name}</h3>
                              <p className="patient-id">ID Paciente: #{appt.patient.id}</p>
                            </div>
                          </div>
                          
                          <div className="contact-details">
                            <p><Mail size={14} /> {appt.patient.email}</p>
                            <p><Phone size={14} /> {appt.patient.phone}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Citas Pasadas */}
            <section className="appointment-section">
              <h2 className="section-title">
                Historial del Mes <span className="badge-count badge-gray">{pastAppointments.length}</span>
              </h2>
              
              {pastAppointments.length === 0 ? (
                <div className="no-appointments-box">No hay historial para este mes.</div>
              ) : (
                <div className="cards-grid">
                  {pastAppointments.map(appt => {
                    const { day, time } = formatDateTime(appt.appointmentDate);
                    const config = getStatusConfig(appt.status);
                    
                    return (
                      <div key={appt.id} className="appointment-card glass-card past-card">
                        <div className="card-top">
                          <div className="date-badge">
                            <span className="day">{day}</span>
                            <span className="time"><Clock size={14} /> {time}</span>
                          </div>
                          <div className={`status-badge ${config.color}`}>
                            {config.icon} {config.label}
                          </div>
                        </div>
                        
                        <div className="card-body">
                          <div className="patient-info">
                            <div className="avatar avatar-gray">
                              <User size={20} color="#64748b" />
                            </div>
                            <div>
                              <h4>{appt.patient.name}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
