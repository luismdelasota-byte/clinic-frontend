import React, { useEffect, useState } from "react";
import { getAllSchedules, saveSchedule, deleteSchedule } from "../../services/scheduleService";
import api from "../../services/api"; // tu instancia axios

interface Schedule {
  id?: number;
  doctor: { id: number; name: string };
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

const ManageSchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [newSchedule, setNewSchedule] = useState<Schedule>({
    doctor: { id: 0, name: "" },
    dayOfWeek: "",
    startTime: "",
    endTime: ""
  });

  useEffect(() => {
    loadSchedules();
    fetchDoctors();
  }, []);

  const loadSchedules = async () => {
    const data = await getAllSchedules();
    setSchedules(data);
  };

  const fetchDoctors = async () => {
    const response = await api.get("/api/doctors");
    setDoctors(response.data);
  };

  const handleSave = async () => {
    await saveSchedule(newSchedule);
    setNewSchedule({ doctor: { id: 0, name: "" }, dayOfWeek: "", startTime: "", endTime: "" });
    loadSchedules();
  };

  const handleDelete = async (id: number) => {
    await deleteSchedule(id);
    loadSchedules();
  };

  return (
    <div>
      <h2>Horario de Doctores</h2>

      {/* Formulario para registrar horario */}
      <select
        value={newSchedule.doctor.id}
        onChange={(e) =>
          setNewSchedule({ ...newSchedule, doctor: { id: Number(e.target.value), name: "" } })
        }
      >
        <option value="">Seleccione un doctor</option>
        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Introduzca el día"
        value={newSchedule.dayOfWeek}
        onChange={(e) => setNewSchedule({ ...newSchedule, dayOfWeek: e.target.value })}
      />
      <input
        type="time"
        value={newSchedule.startTime}
        onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
      />
      <input
        type="time"
        value={newSchedule.endTime}
        onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
      />
      <button onClick={handleSave}>Registrar Horario</button>

      {/* Lista de horarios registrados */}
      <h3>Lista de Horarios Registrados</h3>
      <ul>
        {schedules.map((s) => (
          <li key={s.id}>
            {s.doctor.name} atiende el {s.dayOfWeek} de {s.startTime} a {s.endTime}
            <button onClick={() => handleDelete(s.id!)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageSchedule;
