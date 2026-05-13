import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPatients, savePatient, deletePatient, updatePatient } from "../../services/patientService";
import { ArrowLeft, Search, Plus, Edit2, Trash2, Save, X, Users, Calendar, Phone, Mail } from "lucide-react";
import "../../styles/patients.css";

interface Patient {
  id?: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
}

const ManagePatients: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState<Patient>({
    name: "",
    email: "",
    phone: "",
    birthDate: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Estados para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 6;
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
    setShowAddForm(false);
    loadPatients();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de que desea eliminar este paciente?")) {
      await deletePatient(id);
      loadPatients();
    }
  };

  const handleUpdate = async (id: number, patient: Patient) => {
    await updatePatient(id, patient);
    loadPatients();
  };

  // Filtrar pacientes por búsqueda
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  return (
    <div className="management-page animate-fade-in">
      <header className="page-header-top">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          <span>Volver al Dashboard</span>
        </button>
        <div className="title-section">
          <Users size={28} className="title-icon" />
          <h1>Gestión de Pacientes</h1>
        </div>
      </header>

      <div className="management-container">
        {/* Controles: Buscador y Botón Nuevo */}
        <div className="controls-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar paciente por nombre o correo..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }} 
            />
          </div>
          <button className="btn-primary flex-center" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? <X size={20} /> : <Plus size={20} />}
            <span>{showAddForm ? "Cancelar" : "Nuevo Paciente"}</span>
          </button>
        </div>

        {/* Formulario desplegable */}
        {showAddForm && (
          <div className="card-form animate-fade-in">
            <h3>Registrar Nuevo Paciente</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>Nombre Completo</label>
                <div className="input-wrapper">
                  <Users size={18} className="input-icon" />
                  <input type="text" placeholder="Ej. Juan Pérez" value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} />
                </div>
              </div>
              <div className="input-group">
                <label>Correo Electrónico</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input type="email" placeholder="juan@correo.com" value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })} />
                </div>
              </div>
              <div className="input-group">
                <label>Teléfono</label>
                <div className="input-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input type="text" placeholder="Ej. 999 888 777" value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} />
                </div>
              </div>
              <div className="input-group">
                <label>Fecha de Nacimiento</label>
                <div className="input-wrapper">
                  <Calendar size={18} className="input-icon" />
                  <input type="date" value={newPatient.birthDate}
                    onChange={(e) => setNewPatient({ ...newPatient, birthDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handleSave}>Guardar Paciente</button>
            </div>
          </div>
        )}

        {/* Tabla Moderna */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>  
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Nacimiento</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center empty-state">No se encontraron pacientes.</td>
                  </tr>
                ) : (
                  currentPatients.map((p) => (
                    <tr key={p.id}>
                      <td>
                        {editingId === p.id ? (
                          <input className="edit-input" value={editedPatient?.name || ""}
                            onChange={(e) => setEditedPatient({ ...editedPatient!, name: e.target.value })} />
                        ) : (
                          <span className="font-medium text-main">{p.name}</span>
                        )}
                      </td>
                      <td>
                        {editingId === p.id ? (
                          <div className="edit-contact-group">
                            <input className="edit-input" value={editedPatient?.email || ""}
                              onChange={(e) => setEditedPatient({ ...editedPatient!, email: e.target.value })} />
                            <input className="edit-input" value={editedPatient?.phone || ""}
                              onChange={(e) => setEditedPatient({ ...editedPatient!, phone: e.target.value })} />
                          </div>
                        ) : (
                          <div className="contact-info">
                            <span className="contact-item"><Mail size={14} /> {p.email}</span>
                            <span className="contact-item"><Phone size={14} /> {p.phone}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        {editingId === p.id ? (
                          <input type="date" className="edit-input" value={editedPatient?.birthDate || ""}
                            onChange={(e) => setEditedPatient({ ...editedPatient!, birthDate: e.target.value })} />
                        ) : (
                          <span className="date-badge">{p.birthDate}</span>
                        )}
                      </td>
                      <td className="actions text-right">
                        {editingId === p.id ? (
                          <div className="action-buttons">
                            <button className="btn-icon save-btn" title="Guardar"
                              onClick={async () => {
                                if (!editedPatient || !editedPatient.name || !editedPatient.email || !editedPatient.phone || !editedPatient.birthDate) {
                                  alert("Completa todos los campos");
                                  return;
                                }
                                await handleUpdate(p.id!, editedPatient);
                                setEditingId(null);
                                setEditedPatient(null);
                              }}>
                              <Save size={18} />
                            </button>
                            <button className="btn-icon cancel-btn" title="Cancelar"
                              onClick={() => { setEditingId(null); setEditedPatient(null); }}>
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button className="btn-icon edit-btn" title="Editar"
                              onClick={() => { setEditingId(p.id!); setEditedPatient({ ...p }); }}>
                              <Edit2 size={18} />
                            </button>
                            {userRole === "ADMIN" && (
                              <button className="btn-icon delete-btn" title="Eliminar"
                                onClick={() => handleDelete(p.id!)}>
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</button>
              <div className="page-indicators">
                {Array.from({length: totalPages}, (_, i) => i + 1).map(num => (
                  <button key={num} className={`page-dot ${currentPage === num ? 'active' : ''}`} onClick={() => setCurrentPage(num)}>
                    {num}
                  </button>
                ))}
              </div>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePatients;
