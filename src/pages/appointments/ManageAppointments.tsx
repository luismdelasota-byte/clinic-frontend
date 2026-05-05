import React, { useEffect, useState } from "react";
import {
  getAllAppointments,
  saveAppointment,
  deleteAppointment
} from "../../services/appointmentService";
import api from "../../services/api";

interface Appointment {
  id?: number;
  patient: { id: number; name: string };
  doctor: { id: number; name: string };
  appointmentDate: string; // formato ISO: YYYY-MM-DDTHH:mm
  status: string;
}

const ManageAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [newAppointment, setNewAppointment] = useState<{
    patientId: number;
    doctorId: number;
    date: string;
    time: string;
  }>({
    patientId: 0,
    doctorId: 0,
    date: "",
    time: ""
  });

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

    // Construir appointmentDate en formato ISO
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestionar Citas</h2>

      {/* Formulario para agendar cita */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={newAppointment.patientId}
          onChange={(e) => setNewAppointment({ ...newAppointment, patientId: Number(e.target.value) })}
        >
          <option value="">Seleccione un paciente</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={newAppointment.doctorId}
          onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: Number(e.target.value) })}
        >
          <option value="">Seleccione un doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={newAppointment.date}
          onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
        />
        <input
          type="time"
          value={newAppointment.time}
          onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
        />
        <button onClick={handleSave}>Agendar Cita</button>
      </div>

      {/* Lista de citas */}
      <h3>Lista de Citas</h3>
      <ul>
        {appointments.map((a) => (
          <li key={a.id}>
            Paciente: {a.patient.name} | Doctor: {a.doctor.name} | {a.appointmentDate.replace("T", " ")} | Estado: {a.status}
            <button onClick={() => handleDelete(a.id!)}>Cancelar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageAppointments;
