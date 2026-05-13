import React, { useState, useEffect } from "react";
import { X, Search, User, Calendar, ClipboardList, Activity, Stethoscope } from "lucide-react";
import { getAllPatients } from "../../services/patientService";
import { getAllAppointments } from "../../services/appointmentService";
import "../../styles/modals.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ClinicalDiaryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    const pts = await getAllPatients();
    const appts = await getAllAppointments();
    setPatients(pts);
    setAppointments(appts);
  };

  if (!isOpen) return null;

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPatient = (patient: any) => {
    setSelectedPatient(patient);
    setSearchTerm("");
  };

  const patientAppointments = selectedPatient
    ? appointments.filter(a => a.patient.id === selectedPatient.id)
    : [];

  return (
    <div className="fullscreen-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="fullscreen-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2><ClipboardList size={24} /> Diario Clínico</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="modal-body">
          {/* Buscador */}
          <div className="patient-search-section">
            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Buscar Paciente</h3>
            <div className="search-input-wrapper">
              <Search size={20} className="text-muted" />
              <input
                type="text"
                placeholder="Ingresa nombre o correo del paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Resultados Rápidos */}
            {searchTerm && filteredPatients.length > 0 && (
              <div style={{ marginTop: "1rem", background: "white", border: "1px solid #E2E8F0", borderRadius: "8px", maxHeight: "150px", overflowY: "auto" }}>
                {filteredPatients.map(p => (
                  <div key={p.id}
                    style={{ padding: "10px 15px", cursor: "pointer", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "10px" }}
                    onClick={() => handleSelectPatient(p)}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#F8FAFC"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <User size={16} /> <strong>{p.name}</strong> - {p.email}
                  </div>
                ))}
              </div>
            )}

            {/* Paciente Seleccionado */}
            {selectedPatient && (
              <div className="selected-patient-card animate-fade-in">
                <div style={{ backgroundColor: "var(--primary-color)", color: "white", width: "40px", height: "40px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ color: "var(--primary-dark)", margin: 0 }}>{selectedPatient.name}</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>{selectedPatient.email} | {selectedPatient.phone}</p>
                </div>
                <button
                  style={{ marginLeft: "auto", background: "transparent", border: "1px solid var(--primary-color)", color: "var(--primary-color)", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                  onClick={() => setSelectedPatient(null)}
                >
                  Cambiar
                </button>
              </div>
            )}
          </div>

          {/* Historial del Paciente */}
          {selectedPatient ? (
            <div className="history-feed">
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "1rem" }}>
                <Activity size={20} color="var(--primary-color)" /> Historial de Citas y Diagnósticos
              </h3>

              {patientAppointments.length === 0 ? (
                <p className="empty-state" style={{ textAlign: "center", padding: "2rem" }}>El paciente no tiene historial registrado aún.</p>
              ) : (
                patientAppointments.map(appt => (
                  <div key={appt.id} className="record-card animate-fade-in">
                    <div className="record-header">
                      <div>
                        <div className="record-title">Atención Médica</div>
                        <div className="record-date"><Calendar size={14} /> {appt.appointmentDate.replace("T", " ")}</div>
                        <div className="record-date" style={{ marginTop: "5px" }}><Stethoscope size={14} /> Dr(a). {appt.doctor.name}</div>
                      </div>
                      <span className="badge-status active">{appt.status}</span>
                    </div>
                    <div className="record-content">
                      <h4>Diagnóstico (Simulado)</h4>
                      <p>Paciente presenta cuadro de infección respiratoria aguda. Refiere fiebre de 39°C y malestar general desde hace 48 horas. Faringe hiperémica, amígdalas inflamadas sin placas purulentas. Pulmones limpios a la auscultación.</p>

                      <h4>Tratamiento y Notas (Simulado)</h4>
                      <p>1. Paracetamol 500mg cada 8 horas por 3 días.<br />
                        2. Amoxicilina 500mg cada 8 horas por 7 días.<br />
                        3. Reposo absoluto por 48 horas. Hidratación abundante.</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-muted)", flexDirection: "column", gap: "10px" }}>
              <Search size={48} opacity={0.2} />
              <p>Busca y selecciona un paciente para ver su Diario Clínico.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ClinicalDiaryModal;
