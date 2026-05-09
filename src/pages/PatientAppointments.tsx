import React, { useEffect, useState } from "react";
import { getAppointmentsByPatient } from "../services/appointmentService";

const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      getAppointmentsByPatient(Number(patientId))
        .then(data => setAppointments(data))
        .catch(err => console.error("Error cargando citas del paciente:", err))
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) return <p>Cargando citas...</p>;

  return (
    <div className="patient-appointments">
      <h2>Mis Citas</h2>
      {appointments.length === 0 ? (
        <p>No tienes citas registradas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Especialidad</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(ap => (
              <tr key={ap.id}>
                <td>{ap.doctor?.name}</td>
                <td>{ap.doctor?.speciality}</td>
                <td>{ap.appointmentDate}</td>
                <td>{ap.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientAppointments;
