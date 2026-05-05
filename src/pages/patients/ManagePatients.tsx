import React, { useEffect, useState } from "react";
import { getAllPatients, savePatient, deletePatient } from "../../services/patientService";

interface Patient {
  id?: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // formato YYYY-MM-DD
}

const ManagePatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState<Patient>({
    name: "",
    email: "",
    phone: "",
    birthDate: ""
  });

  // Cargar pacientes al montar el componente
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const data = await getAllPatients();
    setPatients(data);
  };

  const handleSave = async () => {
    if (!newPatient.name || !newPatient.email || !newPatient.phone || !newPatient.birthDate) {
      alert("Completa todos los campos correctamente");
      return;
    }
    await savePatient(newPatient);
    setNewPatient({ name: "", email: "", phone: "", birthDate: "" });
    loadPatients();
  };

  const handleDelete = async (id: number) => {
    await deletePatient(id);
    loadPatients();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestionar Pacientes</h2>

      {/* Formulario para crear paciente */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nombre"
          value={newPatient.name}
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newPatient.email}
          onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={newPatient.phone}
          onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
        />
        <input
          type="date"
          placeholder="Fecha de nacimiento"
          value={newPatient.birthDate}
          onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })}
        />
        <button onClick={handleSave}>Registrar Paciente</button>
      </div>

      {/* Lista de pacientes */}
      <h3>Lista de Pacientes</h3>
      <ul>
        {patients.map((p) => (
          <li key={p.id}>
            {p.name} | {p.email} | {p.phone} | Nacimiento: {p.birthDate}
            <button onClick={() => handleDelete(p.id!)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagePatients;
