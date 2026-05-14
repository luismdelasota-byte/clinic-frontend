import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, Clock, ChevronLeft, ChevronRight, ArrowLeft, 
  CheckCircle, FileText, ClipboardList, Activity, CalendarDays, Mail, FilePlus
} from "lucide-react";
import "../styles/DoctorAppointments.css";
import { updateAppointmentStatus, getAppointmentsByDoctor } from "../services/appointmentService";
import ClinicalDiaryModal from "../components/modals/ClinicalDiaryModal";
import MedicalLeaveModal from "../components/modals/MedicalLeaveModal";
import MedicalReportModal from "../components/modals/MedicalReportModal";

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [modalState, setModalState] = useState<{ open: boolean; type: string | null; appointment: any }>({
    open: false,
    type: null,
    appointment: null
  });
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
      setAppointments(data);
    } catch (err) {
      console.error("Error cargando citas:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generar días del mes actual para el selector horizontal
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    for (let i = 1; i <= lastDay; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const daysList = getDaysInMonth(selectedDate);

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const filteredAppointments = appointments.filter(a => {
    const apptDate = new Date(a.appointmentDate);
    return isSameDay(apptDate, selectedDate);
  });

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      loadData();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const openModal = (type: string, appointment: any) => {
    setModalState({ open: true, type, appointment });
  };

  const formatMonthTitle = (date: Date) => {
    const month = date.toLocaleString('es-ES', { month: 'long' });
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${date.getFullYear()}`;
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + offset, 1);
    setSelectedDate(newDate);
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
          
          <div className="calendar-navigation">
            <button className="nav-icon-btn" onClick={() => changeMonth(-1)}><ChevronLeft /></button>
            <span className="month-title">{formatMonthTitle(selectedDate)}</span>
            <button className="nav-icon-btn" onClick={() => changeMonth(1)}><ChevronRight /></button>
          </div>
        </div>

        <div className="days-selector-container">
          <div className="days-strip">
            {daysList.map((date, idx) => (
              <button
                key={idx}
                className={`day-item ${isSameDay(date, selectedDate) ? 'active' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="day-name">{date.toLocaleString('es-ES', { weekday: 'short' })}</span>
                <span className="day-number">{date.getDate()}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="appointments-content-area animate-fade-in">
        {filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <p>No hay citas programadas para este día.</p>
          </div>
        ) : (
          <div className="appointments-grid-modern">
            {filteredAppointments.map(a => {
              const { time } = formatDateTime(a.appointmentDate);
              const status = a.status || "PENDING";
              
              return (
                <div key={a.id} className={`appt-card-modern ${status.toLowerCase()}`}>
                  <div className="card-top">
                    <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
                    <span className="appt-time"><Clock size={16} /> {time} hs</span>
                  </div>
                  
                  <div className="patient-info">
                    <div className="patient-avatar">
                      {a.patient.name.charAt(0)}
                    </div>
                    <div className="patient-details">
                      <h3>{a.patient.name}</h3>
                      <p><Mail size={14} /> {a.patient.email}</p>
                    </div>
                  </div>

                  <div className="card-actions">
                    {status === "PENDING" || status === "SCHEDULED" ? (
                      <button 
                        className="btn-action primary"
                        onClick={() => handleStatusChange(a.id, "IN_CONSULTATION")}
                      >
                        <Activity size={18} /> Entrar a Consultorio
                      </button>
                    ) : status === "IN_CONSULTATION" ? (
                      <>
                        <button 
                          className="btn-action success"
                          onClick={() => handleStatusChange(a.id, "COMPLETED")}
                        >
                          <CheckCircle size={18} /> Finalizar Cita
                        </button>
                        <div className="medical-docs-actions">
                          <button title="Ver Historial Clínico" onClick={() => navigate(`/patients/${a.patient.id}/history`)}>
                            <ClipboardList size={18} />
                          </button>
                          <button onClick={() => openModal("diario", a)} title="Diario Clínico">
                            <FilePlus size={18} />
                          </button>
                          <button onClick={() => openModal("informe", a)} title="Informe Médico">
                            <FileText size={18} />
                          </button>
                          <button onClick={() => openModal("descanso", a)} title="Descanso Médico">
                            <Activity size={18} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <span className="completed-label">Cita Finalizada</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalState.open && modalState.type === "diario" && (
        <ClinicalDiaryModal 
          isOpen={true} 
          onClose={() => setModalState({ ...modalState, open: false })}
          appointmentId={modalState.appointment.id}
          patientId={modalState.appointment.patient.id}
          doctorId={Number(doctorId)}
        />
      )}
      {modalState.open && modalState.type === "informe" && (
        <MedicalReportModal 
          isOpen={true} 
          onClose={() => setModalState({ ...modalState, open: false })}
          appointmentId={modalState.appointment.id}
          patientId={modalState.appointment.patient.id}
          doctorId={Number(doctorId)}
        />
      )}
      {modalState.open && modalState.type === "descanso" && (
        <MedicalLeaveModal 
          isOpen={true} 
          onClose={() => setModalState({ ...modalState, open: false })}
          appointmentId={modalState.appointment.id}
          patientId={modalState.appointment.patient.id}
          doctorId={Number(doctorId)}
        />
      )}
    </div>
  );
};

export default DoctorAppointments;
