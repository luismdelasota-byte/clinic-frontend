import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointmentsByDoctor } from "../services/appointmentService";
import { Calendar, User, Mail, Clock, ArrowLeft, CheckCircle, AlertCircle, Filter, CalendarDays } from "lucide-react";
import "../styles/DoctorAppointments.css";

interface Appointment {
  id: number;
  appointmentDate: string
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
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().substring(0, 7));
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
      const sortedData = data.sort((a: Appointment, b: Appointment) => 
        new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
      );
      setAppointments(sortedData);
    } catch (err) {
      console.error("Error cargando citas:", err);
    } finally {
      setLoading(false);
    }
  };

  const availableMonths = Array.from(new Set(appointments.map(a => a.appointmentDate.substring(0, 7)))).sort().reverse();

  const formatMonthName = (yearMonth: string) => {
    if (!yearMonth) return "";
    const [year, month] = yearMonth.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthName = date.toLocaleString('es-ES', { month: 'long' });
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
  };

  const filteredAppointments = appointments.filter(a => a.appointmentDate.startsWith(selectedMonth));

  const upcomingAppointments = filteredAppointments.filter(a => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(a.appointmentDate) >= today;
  });

  const pastAppointments = filteredAppointments.filter(a => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(a.appointmentDate) < today;
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return { day, time };
  };

  if (loading) {
    return <div className="doctor-appointments-wrapper"><div className="loading-state">Cargando tu agenda médica...</div></div>;
  }

  return (
    <div className="doctor-appointments-wrapper">
      <header className="page-header-top">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          <span>Volver al Dashboard</span>
        </button>
        <div className="header-main-content">
          <div className="title-group">
            <CalendarDays className="header-icon" size={32} />
            <h1>Mi Agenda Médica</h1>
          </div>
          <div className="filter-group">
            <Filter size={18} />
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {availableMonths.length > 0 ? (
                availableMonths.map(m => <option key={m} value={m}>{formatMonthName(m)}</option>)
              ) : (
                <option value={selectedMonth}>{formatMonthName(selectedMonth)}</option>
              )}
            </select>
          </div>
        </div>
      </header>

      <div className="appointments-content-area animate-fade-in">
        {appointments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <p>No tienes citas programadas aún.</p>
          </div>
        ) : (
          <div className="appointments-sections-grid">
            
            <section className="appt-section">
              <h2 className="section-title text-blue">
                <AlertCircle size={20} /> Próximas Citas ({upcomingAppointments.length})
              </h2>
              <div className="appt-cards-stack">
                {upcomingAppointments.map(a => {
                  const { day, time } = formatDateTime(a.appointmentDate);
                  return (
                    <div key={a.id} className="appt-card upcoming">
                      <div className="card-badge pending">Pendiente</div>
                      <div className="card-row">
                        <User size={18} /> <strong>{a.patient.name}</strong>
                      </div>
                      <div className="card-row">
                        <Calendar size={16} /> <span>{day}</span>
                      </div>
                      <div className="card-row">
                        <Clock size={16} /> <span>{time} hs</span>
                      </div>
                      <div className="card-footer">
                        <p><Mail size={14} /> {a.patient.email}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="appt-section">
              <h2 className="section-title text-green">
                <CheckCircle size={20} /> Historial / Atendidos ({pastAppointments.length})
              </h2>
              <div className="appt-cards-stack">
                {pastAppointments.map(a => {
                  const { day} = formatDateTime(a.appointmentDate);
                  return (
                    <div key={a.id} className="appt-card past">
                      <div className="card-badge completed">Atendido</div>
                      <div className="card-row">
                        <User size={18} /> <strong>{a.patient.name}</strong>
                      </div>
                      <div className="card-row">
                        <Calendar size={16} /> <span>{day}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
