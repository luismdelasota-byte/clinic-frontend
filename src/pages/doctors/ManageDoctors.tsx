import React, { useEffect, useState } from "react";
import { getAllDoctors, saveDoctor, deleteDoctor } from "../../services/doctorService";

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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestionar Doctores</h2>

      {/* Formulario para crear doctor */}
      <div style={{ marginBottom: "20px" }}>
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

      {/* Lista de doctores */}
      <h3>Lista de Doctores</h3>
      <ul>
        {doctors.map((d) => (
          <li key={d.id}>
            CMP: {d.cmp} | {d.name} - {d.speciality} | {d.email} | {d.phone}
            <button onClick={() => handleDelete(d.id!)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageDoctors;
