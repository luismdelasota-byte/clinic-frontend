import React, { useEffect, useState } from "react";
import { getAllDoctors, saveDoctor, deleteDoctor, updateDoctor } from "../../services/doctorService";
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
  

  //Actualizar doctor
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedDoctor, setEditedDoctor] = useState<Doctor | null>(null);


  //Actualizar doctor
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedDoctor, setEditedDoctor] = useState<Doctor | null>(null);

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

  const handleUpdate = async (id: number, doctor: Doctor) => {
    await updateDoctor(id, doctor);
    loadDoctors();
  };


  // Calcular doctores visibles
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(doctors.length / itemsPerPage);
  

  return (
    <div className="doctor-page">
      <div className="container">
        <h2>Gestión de Doctores</h2>
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
<<<<<<< HEAD
                  <td>{editingId === d.id ? (
                    <input
                      value={editedDoctor?.cmp || ""}
                      onChange={(e) =>
                        setEditedDoctor({ ...editedDoctor!, cmp: Number(e.target.value) })
                      }
                    />
                  ) : d.cmp}</td>
                  <td>{editingId === d.id ? (
                    <input
                      value={editedDoctor?.name || ""}
                      onChange={(e) =>
                        setEditedDoctor({ ...editedDoctor!, name: e.target.value })
                      }
                    />
                  ) : d.name}</td>
                  <td>{editingId === d.id ? (
                    <input
                      value={editedDoctor?.speciality || ""}
                      onChange={(e) =>
                        setEditedDoctor({ ...editedDoctor!, speciality: e.target.value })
                      }
                    />
                  ) : d.speciality}</td>
                  <td>{editingId === d.id ? (
                    <input
                      value={editedDoctor?.email || ""}
                      onChange={(e) =>
                        setEditedDoctor({ ...editedDoctor!, email: e.target.value })
                      }
                    />
                  ) : d.email}</td>
                  <td>{editingId === d.id ? (
                    <input
                      value={editedDoctor?.phone || ""}
                      onChange={(e) =>
                        setEditedDoctor({ ...editedDoctor!, phone: e.target.value })
                      }
                    />
                  ) : d.phone}</td>
                  <td className="actions">
                    {editingId === d.id ? (
                      <>
                        <button className="save" onClick={async () => {
                          if (!editedDoctor) return;
                          await handleUpdate(d.id!, editedDoctor);
                          setEditingId(null);
                          setEditedDoctor(null);
                        }}>Guardar</button>
                        <button className="cancel" onClick={() => {
                          setEditingId(null);
                          setEditedDoctor(null);
                        }}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button className="edit" onClick={() => {
                          setEditingId(d.id!);
                          setEditedDoctor({ ...d });
                        }}>Editar</button>
                        <button className="delete" onClick={() => handleDelete(d.id!)}>Eliminar</button>
=======
                  <td>
                    {editingId === d.id ? (
                      <input
                        value={editedDoctor?.cmp || ""}
                        onChange={(e) =>
                          setEditedDoctor({ ...editedDoctor!, cmp: Number(e.target.value) })
                        }
                      />
                    ) : (
                      d.cmp
                    )}
                  </td>
                  <td>
                    {editingId === d.id ? (
                      <input
                        value={editedDoctor?.name || ""}
                        onChange={(e) =>
                          setEditedDoctor({ ...editedDoctor!, name: e.target.value })
                        }
                      />
                    ) : (
                      d.name
                    )}
                  </td>
                  <td>
                    {editingId === d.id ? (
                      <input
                        value={editedDoctor?.speciality || ""}
                        onChange={(e) =>
                          setEditedDoctor({ ...editedDoctor!, speciality: e.target.value })
                        }
                      />
                    ) : (
                      d.speciality
                    )}
                  </td>
                  <td>
                    {editingId === d.id ? (
                      <input
                        value={editedDoctor?.email || ""}
                        onChange={(e) =>
                          setEditedDoctor({ ...editedDoctor!, email: e.target.value })
                        }
                      />
                    ) : (
                      d.email
                    )}
                  </td>
                  <td>
                    {editingId === d.id ? (
                      <input
                        value={editedDoctor?.phone || ""}
                        onChange={(e) =>
                          setEditedDoctor({ ...editedDoctor!, phone: e.target.value })
                        }
                      />
                    ) : (
                      d.phone
                    )}
                  </td>
                  <td className="actions">
                    {editingId === d.id ? (
                      <>
                        <button
                          className="save"
                          onClick={async () => {
                            if (!editedDoctor) return;
                            await handleUpdate(d.id!, editedDoctor);
                            setEditingId(null);
                            setEditedDoctor(null);
                          }}
                        >
                          Guardar
                        </button>
                        <button
                          className="cancel"
                          onClick={() => {
                            setEditingId(null);
                            setEditedDoctor(null);
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
                            setEditingId(d.id!);
                            setEditedDoctor({ ...d });
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="delete"
                          onClick={() => handleDelete(d.id!)}
                        >
                          Eliminar
                        </button>
>>>>>>> dcf6f8ed6fe440e0f988eccc60adb54570d8a8f7
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
<<<<<<< HEAD
          </table>

=======

          </table>

>>>>>>> dcf6f8ed6fe440e0f988eccc60adb54570d8a8f7
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
}

export default ManageDoctors;
