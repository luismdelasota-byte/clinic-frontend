import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAppointments, saveAppointment, deleteAppointment } from "../../services/appointmentService";
import api from "../../services/api";
import { ArrowLeft, CalendarDays, Plus, X, Calendar as CalendarIcon, Clock, Trash2, User, Stethoscope, CheckCircle, AlertCircle } from "lucide-react";
import "../../styles/appointments.css";
// Reutilizamos estilos base
import "../../styles/patients.css";

interface Appointment {
  id?: number;
  patient: { id: number; name: string };
  doctor: { id: number; name: string };
  appointmentDate: string;
  status: string;
}

const ManageAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState<{ patientId: number; doctorId: number; date: string; time: string }>({
    patientId: 0,
    doctorId: 0,
    date: "",
    time: ""
  });
  const [schedules, setSchedules] = useState<any[]>([]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchSchedules = async () => {
    const response = await api.get("/api/schedules");
    setSchedules(response.data);
  };

  useEffect(() => {
    loadAppointments();
    fetchPatients();
    fetchDoctors();
    fetchSchedules();
  }, []);

  const loadAppointments = async () => {
    const data = await getAllAppointments();
    setAppointments(data);
  };

  const fetchPatients = async () => {
    const response = await api.get("/api/patients");
    setPatients(response.data);
  };

  const fetchDoctors = async () => {
    const response = await api.get("/api/doctors");
    setDoctors(response.data);
  };
  
  const handleSave = async () => {
    if (!newAppointment.patientId || !newAppointment.doctorId || !newAppointment.date || !newAppointment.time) {
      alert("Completa todos los campos");
      return;
    }

    // Calcular día de la semana
    const dayName = new Date(newAppointment.date).toLocaleDateString("es-ES", { weekday: "long" }).toUpperCase();

    // Buscar horario del doctor
    const doctorSchedule = schedules.find(
      (s) => s.doctor.id === newAppointment.doctorId && s.dayOfWeek === dayName
    );

    if (!doctorSchedule) {
      alert("El doctor está fuera de horario este día.");
      return;
    }

    if (newAppointment.time < doctorSchedule.startTime || newAppointment.time > doctorSchedule.endTime) {
      alert(`El doctor solo atiende de ${doctorSchedule.startTime} a ${doctorSchedule.endTime}.`);
      return;
    }

    const appointmentDate = `${newAppointment.date}T${newAppointment.time}:00`;
    const appointment = {
      patient: { id: newAppointment.patientId },
      doctor: { id: newAppointment.doctorId },
      appointmentDate,
      status: "SCHEDULED" // o PENDING
    };

    try {
      await saveAppointment(appointment);
      setNewAppointment({ patientId: 0, doctorId: 0, date: "", time: "" });
      setShowAddForm(false);
      loadAppointments();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al registrar la cita");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de cancelar esta cita?")) {
      await deleteAppointment(id);
      loadAppointments();
    }
  };

  // Calcular citas visibles
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    if (status === "CONFIRMED" || status === "SCHEDULED") {
      return <span className="status-badge success"><CheckCircle size={14} /> Confirmada</span>;
    }
    return <span className="status-badge warning"><AlertCircle size={14} /> {status}</span>;
  };

  return (
    <div className="management-page animate-fade-in">
      <header className="page-header-top">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          <span>Volver al Dashboard</span>
        </button>
        <div className="title-section">
          <CalendarDays size={28} className="title-icon" />
          <h1>Gestión de Citas</h1>
        </div>
      </header>

      <div className="management-container">
        {/* Controles */}
        <div className="controls-bar" style={{ justifyContent: "flex-end" }}>
          <button className="btn-primary flex-center" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? <X size={20} /> : <Plus size={20} />}
            <span>{showAddForm ? "Cancelar" : "Agendar Nueva Cita"}</span>
          </button>
        </div>

        {/* Formulario desplegable */}
        {showAddForm && (
          <div className="card-form animate-fade-in">
            <h3>Agendar Cita Médica</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Paciente</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <select 
                    className="custom-select"
                    value={newAppointment.patientId} 
                    onChange={(e) => setNewAppointment({ ...newAppointment, patientId: Number(e.target.value) })}
                  >
                    <option value="">Seleccione un paciente</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Médico Especialista</label>
                <div className="input-wrapper">
                  <Stethoscope size={18} className="input-icon" />
                  <select 
                    className="custom-select"
                    value={newAppointment.doctorId} 
                    onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: Number(e.target.value) })}
                  >
                    <option value="">Seleccione un doctor</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Fecha</label>
                <div className="input-wrapper">
                  <CalendarIcon size={18} className="input-icon" />
                  <input type="date" value={newAppointment.date} 
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} />
                </div>
              </div>

              <div className="input-group">
                <label>Hora</label>
                <div className="input-wrapper">
                  <Clock size={18} className="input-icon" />
                  <input type="time" value={newAppointment.time} 
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handleSave}>Confirmar Cita</button>
            </div>
          </div>
        )}

        {/* Tabla Moderna */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Fecha y Hora</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center empty-state">No hay citas programadas.</td>
                  </tr>
                ) : (
                  currentAppointments.map((a) => {
                    const [datePart, timePart] = a.appointmentDate.split("T");
                    return (
                      <tr key={a.id}>
                        <td>
                          <div className="flex-center" style={{ justifyContent: "flex-start", gap: "0.75rem" }}>
                            <div className="avatar-small bg-blue">{a.patient.name.charAt(0)}</div>
                            <span className="font-medium text-main">{a.patient.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex-center" style={{ justifyContent: "flex-start", gap: "0.75rem" }}>
                            <div className="avatar-small bg-green"><Stethoscope size={14} /></div>
                            <span className="text-main">{a.doctor.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info">
                            <span className="contact-item"><CalendarIcon size={14} /> {datePart}</span>
                            <span className="contact-item"><Clock size={14} /> {timePart?.substring(0, 5)}</span>
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(a.status)}
                        </td>
                        <td className="actions text-right">
                          <button className="btn-icon delete-btn" title="Cancelar Cita" onClick={() => handleDelete(a.id!)}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</button>
              <div className="page-indicators">
                {Array.from({length: totalPages}, (_, i) => i + 1).map(num => (
                  <button key={num} className={`page-dot ${currentPage === num ? 'active' : ''}`} onClick={() => setCurrentPage(num)}>
                    {num}
                  </button>
                ))}
              </div>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;
