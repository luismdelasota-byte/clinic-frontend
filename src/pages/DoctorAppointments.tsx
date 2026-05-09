import React, { useEffect, useState } from "react";
import { getAppointmentsByDoctor } from "../services/appointmentService";
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const doctorId = localStorage.getItem("doctorId"); // guardado al login

  useEffect(() => {
    if (doctorId) {
      getAppointmentsByDoctor(Number(doctorId))
        .then(setAppointments)
        .catch((err) => console.error("Error cargando citas:", err));
    }
  }, [doctorId]);

  return (
    <div className="doctor-appointments">
      <div className="container">
        <h2>Mis Citas</h2>
        {appointments.length === 0 ? (
          <p>No tienes citas registradas.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.patient.name}</td>
                  <td>{a.patient.email}</td>
                  <td>{a.patient.phone}</td>
                  <td>{a.appointmentDate}</td>
                  <td>
                    <span className={`status ${a.status}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
