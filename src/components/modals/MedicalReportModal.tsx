import React, { useState, useEffect } from "react";
import { X, Search, User, ClipboardPlus, FileText, AlertCircle, Calendar } from "lucide-react";
import { getAllPatients } from "../../services/patientService";
import "../../styles/modals.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MedicalReportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    const pts = await getAllPatients();
    setPatients(pts);
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

  return (
    <div className="fullscreen-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="fullscreen-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2><ClipboardPlus size={24} color="#0F52BA" /> Informes Médicos y Referencias</h2>
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
                <div style={{ backgroundColor: "#0F52BA", color: "white", width: "40px", height: "40px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ color: "#0F52BA", margin: 0 }}>{selectedPatient.name}</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>{selectedPatient.email} | Nacimiento: {selectedPatient.birthDate}</p>
                </div>
                <button
                  style={{ marginLeft: "auto", background: "transparent", border: "1px solid #0F52BA", color: "#0F52BA", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                  onClick={() => setSelectedPatient(null)}
                >
                  Cambiar
                </button>
              </div>
            )}
          </div>

          {/* Historial de Informes */}
          {selectedPatient ? (
            <div className="history-feed">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <FileText size={20} color="#0F52BA" /> Informes Generados del Paciente
                </h3>
                <button className="btn-primary" style={{ backgroundColor: "#0F52BA", padding: "0.5rem 1rem" }}>Redactar Nuevo Informe</button>
              </div>

              <div className="record-card animate-fade-in" style={{ borderLeft: "4px solid #DC2626" }}>
                <div className="record-header">
                  <div>
                    <div className="record-title" style={{ color: "#DC2626", display: "flex", alignItems: "center", gap: "8px" }}>
                      <AlertCircle size={18} /> Orden de Hospitalización Urgente
                    </div>
                    <div className="record-date"><Calendar size={14} /> Fecha de Emisión: Hace 2 horas</div>
                  </div>
                  <span className="badge-status danger">Requiere Internamiento</span>
                </div>
                <div className="record-content">
                  <h4>Detalle del Informe Médico (Simulado)</h4>
                  <p style={{ borderLeftColor: "#DC2626" }}>
                    A través del presente documento se informa la condición crítica del paciente <strong>{selectedPatient.name}</strong>, quien acudió a urgencias presentando dificultad respiratoria severa (disnea), saturación de oxígeno del 85% al aire ambiente y taquicardia.<br /><br />
                    <strong>Motivo de Hospitalización:</strong> Se ordena internamiento inmediato en la unidad de cuidados intermedios para administración de oxigenoterapia de alto flujo y monitoreo cardíaco continuo. Sospecha de neumonía atípica bilateral complicada.<br /><br />
                    <strong>Pronóstico:</strong> Reservado. Pendiente resultados de gasometría arterial y tomografía de tórax.
                  </p>

                  <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                    <button style={{ padding: "8px 15px", background: "transparent", border: "1px solid #E2E8F0", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
                      <FileText size={16} /> Imprimir PDF
                    </button>
                    <button style={{ padding: "8px 15px", background: "#FEF2F2", border: "none", color: "#DC2626", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "5px" }}>
                      Enviar a Emergencias
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-muted)", flexDirection: "column", gap: "10px" }}>
              <Search size={48} opacity={0.2} />
              <p>Busca y selecciona un paciente para emitir o ver sus Informes y Referencias.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MedicalReportModal;
