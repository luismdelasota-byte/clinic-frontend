import React, { useEffect, useState } from "react";
import { getAllPatients, savePatient, deletePatient, updatePatient } from "../../services/patientService";
import "../../styles/patients.css";

interface Patient {
  id?: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
}

const ManagePatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState<Patient>({
    name: "",
    email: "",
    phone: "",
    birthDate: ""
  });

// Estados para búsqueda y paginación
const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const patientsPerPage = 5;
const [editingId, setEditingId] = useState<number | null>(null);
const [editedPatient, setEditedPatient] = useState<Patient | null>(null);
const userRole = localStorage.getItem("role");

  

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

const handleUpdate = async (id:number, patient:Patient) => {
  await updatePatient(id, patient);
  loadPatients();
}

// Filtrar pacientes por búsqueda
const filteredPatients = patients.filter((p) =>
  p.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// Paginación
const indexOfLast = currentPage * patientsPerPage;
const indexOfFirst = indexOfLast - patientsPerPage;
const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  return (
    <div className="patients-page">
      <div className="container">
        <h2>Gestionar Pacientes</h2>
        {/* Formulario para crear paciente */}
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
          <button onClick={handleSave}>Registrar Paciente</button>
        </div>

        {/* Lista de pacientes en tabla */}
        <div className="list">
          <h3>Lista de Pacientes</h3>
          <input type="text" placeholder="Buscar..." className="search-bar" value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reinicia a la primera página al buscar
            }} 
          />
          <table>
            <thead>
              <tr>  
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Nacimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((p) => (
                <tr key={p.id}>
                  <td>
                    {editingId === p.id ? (
                      <input
                        value={editedPatient?.name || ""}
                        onChange={(e) =>
                          setEditedPatient({ ...editedPatient!, name: e.target.value })
                        }
                      />
                    ) : (
                      p.name
                    )}
                  </td>
                  <td>
                    {editingId === p.id ? (
                      <input
                        value={editedPatient?.email || ""}
                        onChange={(e) =>
                          setEditedPatient({ ...editedPatient!, email: e.target.value })
                        }
                      />
                    ) : (
                      p.email
                    )}
                  </td>
                  <td>
                    {editingId === p.id ? (
                      <input
                        value={editedPatient?.phone || ""}
                        onChange={(e) =>
                          setEditedPatient({ ...editedPatient!, phone: e.target.value })
                        }
                      />
                    ) : (
                      p.phone
                    )}
                  </td>
                  <td>
                    {editingId === p.id ? (
                      <input
                        type="date"
                        value={editedPatient?.birthDate || ""}
                        onChange={(e) =>
                          setEditedPatient({ ...editedPatient!, birthDate: e.target.value })
                        }
                      />
                    ) : (
                      p.birthDate
                    )}
                  </td>
                  <td className="actions">
                    {editingId === p.id ? (
                      <>
                        <button
                          className="save"
                          onClick={async () => {
                            if (!editedPatient) return;

                            if (
                              !editedPatient.name ||
                              !editedPatient.email ||
                              !editedPatient.phone ||
                              !editedPatient.birthDate
                            ) {
                              alert("Completa todos los campos");
                              return;
                            }

                            await handleUpdate(p.id!, editedPatient);
                            setEditingId(null);
                            setEditedPatient(null);
                          }}
                        >
                          Guardar
                        </button>
                        <button
                          className="cancel"
                          onClick={() => {
                            setEditingId(null);
                            setEditedPatient(null);
                          }}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit"
                          onClick={() => {
                            setEditingId(p.id!);
                            setEditedPatient({ ...p });
                          }}
                        >
                          Editar
                        </button>
                        {userRole === "ADMIN" && (
                          <button
                            className="delete"
                            onClick={() => handleDelete(p.id!)}
                          >
                            Eliminar
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default ManagePatients;
