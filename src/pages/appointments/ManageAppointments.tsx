import React, { useEffect, useState } from "react";
import { getAllAppointments, saveAppointment, deleteAppointment } from "../../services/appointmentService";
import api from "../../services/api";
import "../../styles/appointments.css";

interface Appointment {
  id?: number;
  patient: { id: number; name: string };
  doctor: { id: number; name: string };
  appointmentDate: string;
  status: string;
}

const ManageAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [newAppointment, setNewAppointment] = useState<{ patientId: number; doctorId: number; date: string; time: string }>({
    patientId: 0,
    doctorId: 0,
    date: "",
    time: ""
  });

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadAppointments();
    fetchPatients();
    fetchDoctors();
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
    const appointmentDate = `${newAppointment.date}T${newAppointment.time}:00`;
    const appointment = {
      patient: { id: newAppointment.patientId },
      doctor: { id: newAppointment.doctorId },
      appointmentDate,
      status: "SCHEDULED"
    };
    await saveAppointment(appointment);
    setNewAppointment({ patientId: 0, doctorId: 0, date: "", time: "" });
    loadAppointments();
  };

  const handleDelete = async (id: number) => {
    await deleteAppointment(id);
    loadAppointments();
  };

  // Calcular citas visibles
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  return (
    <div className="container">
      <h2>Panel Médico: Gestión de Citas</h2>

      {/* Formulario */}
      <div className="form-row">
        <select value={newAppointment.patientId} onChange={(e) => setNewAppointment({ ...newAppointment, patientId: Number(e.target.value) })}>
          <option value="">Seleccione un paciente</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select value={newAppointment.doctorId} onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: Number(e.target.value) })}>
          <option value="">Seleccione un doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} />
        <input type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })} />
        <button onClick={handleSave}>Agendar Cita</button>
      </div>

      {/* Lista */}
      <div className="list">
        <h3>Lista de Citas</h3>
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Doctor</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.map((a) => (
              <tr key={a.id}>
                <td>{a.patient.name}</td>
                <td>{a.doctor.name}</td>
                <td>{a.appointmentDate.replace("T", " ")}</td>
                <td>{a.status}</td>
                <td className="actions">
                  <button className="delete" onClick={() => handleDelete(a.id!)}>Cancelar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>◀</button>
          <span>Página {currentPage} de {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>▶</button>
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;
