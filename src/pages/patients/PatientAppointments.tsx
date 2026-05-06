import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAppointmentsByPatient } from "../../services/appointmentService";

interface Appointment {
  id: number;
  doctorName: string;
  date: string;
  time: string;
  status: string;
}

const PatientAppointments: React.FC = () => {
  const { id } = useParams(); // el id del paciente viene de la URL
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (id) {
      loadAppointments(Number(id));
    }
  }, [id]);

  const loadAppointments = async (patientId: number) => {
    const data = await getAppointmentsByPatient(patientId);
    setAppointments(data);
  };

  return (
    <div className="container">
      <h2>Historial de Citas</h2>
      {appointments.length === 0 ? (
        <p>No hay citas registradas para este paciente.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.doctorName}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientAppointments;
