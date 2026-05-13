import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDoctors, saveDoctor, deleteDoctor, updateDoctor } from "../../services/doctorService";
import { ArrowLeft, Stethoscope, Plus, X, Edit2, Trash2, Save, Mail, Phone, Hash } from "lucide-react";
import "../../styles/doctors.css";
// Reutilizamos estilos base
import "../../styles/patients.css";

interface Doctor {
  id?: number;
  cmp: number;
  name: string;
  speciality: string;
  email: string;
  phone: string;
}

const ManageDoctors: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState<Doctor>({
    cmp: 0,
    name: "",
    speciality: "",
    email: "",
    phone: ""
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedDoctor, setEditedDoctor] = useState<Doctor | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
    setShowAddForm(false);
    loadDoctors();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de que desea eliminar este médico?")) {
      await deleteDoctor(id);
      loadDoctors();
    }
  };

  const handleUpdate = async (id: number, doctor: Doctor) => {
    await updateDoctor(id, doctor);
    loadDoctors();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(doctors.length / itemsPerPage);

  return (
    <div className="management-page animate-fade-in">
      <header className="page-header-top">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          <span>Volver al Dashboard</span>
        </button>
        <div className="title-section">
          <Stethoscope size={28} className="title-icon" />
          <h1>Gestión de Médicos</h1>
        </div>
      </header>

      <div className="management-container">
        {/* Controles */}
        <div className="controls-bar" style={{ justifyContent: "flex-end" }}>
          <button className="btn-primary flex-center" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? <X size={20} /> : <Plus size={20} />}
            <span>{showAddForm ? "Cancelar" : "Registrar Médico"}</span>
          </button>
        </div>

        {/* Formulario desplegable */}
        {showAddForm && (
          <div className="card-form animate-fade-in">
            <h3>Registrar Nuevo Médico</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>CMP (Colegio Médico del Perú)</label>
                <div className="input-wrapper">
                  <Hash size={18} className="input-icon" />
                  <input type="number" placeholder="Ej. 123456" 
                    value={newDoctor.cmp || ""}
                    onChange={(e) => setNewDoctor({ ...newDoctor, cmp: Number(e.target.value) })} />
                </div>
              </div>
              <div className="input-group">
                <label>Nombre Completo</label>
                <div className="input-wrapper">
                  <Stethoscope size={18} className="input-icon" />
                  <input type="text" placeholder="Ej. Dr. Juan Pérez" 
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })} />
                </div>
              </div>
              <div className="input-group">
                <label>Especialidad</label>
                <div className="input-wrapper">
                  <Stethoscope size={18} className="input-icon" />
                  <input type="text" placeholder="Ej. Cardiología" 
                    value={newDoctor.speciality}
                    onChange={(e) => setNewDoctor({ ...newDoctor, speciality: e.target.value })} />
                </div>
              </div>
              <div className="input-group">
                <label>Correo Electrónico</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input type="email" placeholder="doctor@correo.com" 
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} />
                </div>
              </div>
              <div className="input-group">
                <label>Teléfono</label>
                <div className="input-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input type="text" placeholder="Ej. 999 888 777" 
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handleSave}>Guardar Médico</button>
            </div>
          </div>
        )}

        {/* Tabla Moderna */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>CMP</th>
                  <th>Especialista</th>
                  <th>Contacto</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentDoctors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center empty-state">No hay médicos registrados.</td>
                  </tr>
                ) : (
                  currentDoctors.map((d) => (
                    <tr key={d.id}>
                      <td>
                        {editingId === d.id ? (
                          <input type="number" className="edit-input" value={editedDoctor?.cmp || ""}
                            onChange={(e) => setEditedDoctor({ ...editedDoctor!, cmp: Number(e.target.value) })} />
                        ) : (
                          <span className="date-badge">{d.cmp}</span>
                        )}
                      </td>
                      <td>
                        {editingId === d.id ? (
                          <div className="edit-contact-group">
                            <input className="edit-input" value={editedDoctor?.name || ""}
                              onChange={(e) => setEditedDoctor({ ...editedDoctor!, name: e.target.value })} />
                            <input className="edit-input" value={editedDoctor?.speciality || ""}
                              onChange={(e) => setEditedDoctor({ ...editedDoctor!, speciality: e.target.value })} />
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium text-main">{d.name}</div>
                            <div className="contact-item" style={{ marginTop: "0.25rem" }}>{d.speciality}</div>
                          </div>
                        )}
                      </td>
                      <td>
                        {editingId === d.id ? (
                          <div className="edit-contact-group">
                            <input className="edit-input" value={editedDoctor?.email || ""}
                              onChange={(e) => setEditedDoctor({ ...editedDoctor!, email: e.target.value })} />
                            <input className="edit-input" value={editedDoctor?.phone || ""}
                              onChange={(e) => setEditedDoctor({ ...editedDoctor!, phone: e.target.value })} />
                          </div>
                        ) : (
                          <div className="contact-info">
                            <span className="contact-item"><Mail size={14} /> {d.email}</span>
                            <span className="contact-item"><Phone size={14} /> {d.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="actions text-right">
                        {editingId === d.id ? (
                          <div className="action-buttons">
                            <button className="btn-icon save-btn" title="Guardar"
                              onClick={async () => {
                                if (!editedDoctor) return;
                                await handleUpdate(d.id!, editedDoctor);
                                setEditingId(null);
                                setEditedDoctor(null);
                              }}>
                              <Save size={18} />
                            </button>
                            <button className="btn-icon cancel-btn" title="Cancelar"
                              onClick={() => { setEditingId(null); setEditedDoctor(null); }}>
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button className="btn-icon edit-btn" title="Editar"
                              onClick={() => { setEditingId(d.id!); setEditedDoctor({ ...d }); }}>
                              <Edit2 size={18} />
                            </button>
                            <button className="btn-icon delete-btn" title="Eliminar"
                              onClick={() => handleDelete(d.id!)}>
                              <Trash2 size={18} />
                            </button>
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
}

export default ManageDoctors;
