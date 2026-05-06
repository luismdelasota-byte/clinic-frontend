import React, { useState } from "react";
import { savePatient } from "../../services/patientService";
import "../../styles/patients.css";

interface Patient {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
}

const RegisterPatients: React.FC = () => {
  const [newPatient, setNewPatient] = useState<Patient>({
    name: "",
    email: "",
    phone: "",
    birthDate: ""
  });

  const handleSave = async () => {
    if (!newPatient.name || !newPatient.email || !newPatient.phone || !newPatient.birthDate) {
      alert("Completa todos los campos correctamente");
      return;
    }
    await savePatient(newPatient);
    alert("Paciente registrado correctamente ✅");
    setNewPatient({ name: "", email: "", phone: "", birthDate: "" });
  };

  return (
    <div className="container">
      <h2>Registrar Paciente</h2>
      <div className="form-row">
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
        <button onClick={handleSave}>+ Registrar Paciente</button>
      </div>
    </div>
  );
};

export default RegisterPatients;
