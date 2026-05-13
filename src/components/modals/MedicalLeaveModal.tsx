import React, { useState, useEffect } from "react";
import { X, Search, User, FileText, AlertTriangle, Calendar, FileBadge } from "lucide-react";
import { getAllPatients } from "../../services/patientService";
import "../../styles/modals.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MedicalLeaveModal: React.FC<Props> = ({ isOpen, onClose }) => {
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
          <h2><FileBadge size={24} color="#00A86B" /> Descansos Médicos</h2>
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
              <div className="selected-patient-card animate-fade-in" style={{ borderColor: "rgba(0, 168, 107, 0.2)", backgroundColor: "rgba(0, 168, 107, 0.05)" }}>
                <div style={{ backgroundColor: "#00A86B", color: "white", width: "40px", height: "40px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h4 style={{ color: "#006d45", margin: 0 }}>{selectedPatient.name}</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>{selectedPatient.email} | {selectedPatient.phone}</p>
                </div>
                <button 
                  style={{ marginLeft: "auto", background: "transparent", border: "1px solid #00A86B", color: "#00A86B", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                  onClick={() => setSelectedPatient(null)}
                >
                  Cambiar
                </button>
              </div>
            )}
          </div>

          {/* Historial de Descansos */}
          {selectedPatient ? (
            <div className="history-feed">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <FileText size={20} color="#00A86B"/> Certificados de Descanso Médico Emitidos
                </h3>
                <button className="btn-primary" style={{ backgroundColor: "#00A86B", padding: "0.5rem 1rem" }}>Emitir Nuevo Descanso</button>
              </div>
              
              <div className="record-card animate-fade-in" style={{ borderLeft: "4px solid #00A86B" }}>
                <div className="record-header">
                  <div>
                    <div className="record-title" style={{ color: "#00A86B" }}>Descanso por Incapacidad Temporal</div>
                    <div className="record-date"><Calendar size={14} /> Emitido el: Hace 3 días</div>
                  </div>
                  <span className="badge-status danger">Aún Vigente</span>
                </div>
                <div className="record-content">
                  <h4>Especificaciones Médicas (Simulado)</h4>
                  <p style={{ borderLeftColor: "#00A86B" }}>
                    Se otorga descanso médico al paciente por un periodo de <strong>05 días naturales</strong> (del 09/05/2026 al 14/05/2026).<br/><br/>
                    <strong>Motivo:</strong> Cuadro infeccioso respiratorio agudo severo con riesgo de contagio.<br/>
                    <strong>Indicaciones Adicionales:</strong> El paciente debe permanecer en aislamiento domiciliario estricto. Prohibido realizar esfuerzo físico. Debe regresar a consulta si la fiebre persiste por más de 48 horas tras el inicio del tratamiento con antibióticos.
                  </p>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "1rem", color: "#92400E", backgroundColor: "#FEF3C7", padding: "0.75rem", borderRadius: "8px", fontSize: "0.9rem" }}>
                    <AlertTriangle size={16} /> <span>Este certificado ha sido firmado digitalmente por el Dr(a). a cargo.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-muted)", flexDirection: "column", gap: "10px" }}>
               <Search size={48} opacity={0.2} />
               <p>Busca y selecciona un paciente para emitir o ver sus Descansos Médicos.</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MedicalLeaveModal;
