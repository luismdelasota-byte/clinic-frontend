import React, { useEffect, useState } from "react";
import { getAllDoctors, saveDoctor, deleteDoctor } from "../../services/doctorService";
import "../../styles/doctors.css";

interface Doctor {
  id?: number;
  cmp: number;
  name: string;
  speciality: string;
  email: string;
  phone: string;
}

const ManageDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [newDoctor, setNewDoctor] = useState<Doctor>({
    cmp: 0,
    name: "",
    speciality: "",
    email: "",
    phone: ""
  });

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const data = await getAllDoctors();
    setDoctors(data);
  };

  const handleSave = async () => {
    if (!newDoctor.name || !newDoctor.speciality || !newDoctor.email || newDoctor.cmp <= 0) {
      alert("Completa todos los campos correctamente");
      return;
    }
    await saveDoctor(newDoctor);
    setNewDoctor({ cmp: 0, name: "", speciality: "", email: "", phone: "" });
    loadDoctors();
  };

  const handleDelete = async (id: number) => {
    await deleteDoctor(id);
    loadDoctors();
  };

  // Calcular doctores visibles
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(doctors.length / itemsPerPage);

  return (
    <div className="container">
      <h2>Panel Médico: Gestión de Doctores</h2>

      {/* Formulario */}
      <div className="form-row">
        <input
          type="text"
          placeholder="CMP"
          value={newDoctor.cmp}
          onChange={(e) => setNewDoctor({ ...newDoctor, cmp: Number(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Nombre"
          value={newDoctor.name}
          onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Especialidad"
          value={newDoctor.speciality}
          onChange={(e) => setNewDoctor({ ...newDoctor, speciality: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newDoctor.email}
          onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={newDoctor.phone}
          onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
        />
        <button onClick={handleSave}>Registrar Doctor</button>
      </div>

      {/* Lista */}
      <div className="list">
        <h3>Lista de Doctores</h3>
        <table>
          <thead>
            <tr>
              <th>CMP</th>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.map((d) => (
              <tr key={d.id}>
                <td>{d.cmp}</td>
                <td>{d.name}</td>
                <td>{d.speciality}</td>
                <td>{d.email}</td>
                <td>{d.phone}</td>
                <td className="actions">
                  <button className="delete" onClick={() => handleDelete(d.id!)}>Eliminar</button>
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

export default ManageDoctors;
