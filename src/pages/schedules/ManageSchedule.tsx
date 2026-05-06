import React, { useEffect, useState } from "react";
import { getAllSchedules, saveSchedule, deleteSchedule } from "../../services/scheduleService";
import api from "../../services/api";
import "../../styles/schedule.css";

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Schedule | null>(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    if (editData) {
      await saveSchedule(editData);
      setEditingId(null);
      setEditData(null);
      loadSchedules();
    }
  };

  const handleDelete = async (id: number) => {
    await deleteSchedule(id);
    loadSchedules();
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingId(schedule.id!);
    setEditData({ ...schedule });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSchedules = schedules.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(schedules.length / itemsPerPage);


  //Permisos
  const userRole = localStorage.getItem("role");

  return (
    <div className="schedule-page">
      <div className="container">
        <h2>Horario de Doctores</h2>
        {/* Formulario para registrar horario */}
        <div className="form-row">
          <select
            value={editData?.doctor.id || ""}
            onChange={(e) =>
              setEditData({
                doctor: { id: Number(e.target.value), name: "" },
                dayOfWeek: "",
                startTime: "",
                endTime: ""
              })
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
            placeholder="Día de la semana"
            value={editData?.dayOfWeek || ""}
            onChange={(e) => setEditData({ ...editData!, dayOfWeek: e.target.value })}
          />

          <input
            type="time"
            value={editData?.startTime || ""}
            onChange={(e) => setEditData({ ...editData!, startTime: e.target.value })}
          />

          <input
            type="time"
            value={editData?.endTime || ""}
            onChange={(e) => setEditData({ ...editData!, endTime: e.target.value })}
          />

          <button
            onClick={async () => {
              if (!editData || !editData.doctor.id || !editData.dayOfWeek || !editData.startTime || !editData.endTime) {
                alert("Completa todos los campos");
                return;
              }
              await saveSchedule(editData);
              setEditData(null);
              loadSchedules();
            }}
          >
            Registrar Horario
          </button>
        </div>

        <div className="list">
          <h3>Lista de Horarios Registrados</h3>
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Día</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentSchedules.map((s) => (
                <tr key={s.id}>
                  {editingId === s.id ? (
                    <>
                      <td>
                        <select
                          value={editData?.doctor.id}
                          onChange={(e) =>
                            setEditData({ ...editData!, doctor: { id: Number(e.target.value), name: "" } })
                          }
                        >
                          {doctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>{doc.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editData?.dayOfWeek}
                          onChange={(e) => setEditData({ ...editData!, dayOfWeek: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          value={editData?.startTime}
                          onChange={(e) => setEditData({ ...editData!, startTime: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          value={editData?.endTime}
                          onChange={(e) => setEditData({ ...editData!, endTime: e.target.value })}
                        />
                      </td>
                      <td className="actions">
                        <button className="edit" onClick={handleSave}>Guardar</button>
                        <button className="delete" onClick={handleCancel}>Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{s.doctor.name}</td>
                      <td>{s.dayOfWeek}</td>
                      <td>{s.startTime}</td>
                      <td>{s.endTime}</td>  
                      <td className="actions">
                        <button className="edit" onClick={() => handleEdit(s)}>Editar</button>
                        {userRole === "ADMIN" && (
                          <button className="delete" onClick={() => handleDelete(s.id!)}>Eliminar</button>
                        )}
                      </td>
                    </>
                  )}
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
    </div>
  );
};

export default ManageSchedule;
