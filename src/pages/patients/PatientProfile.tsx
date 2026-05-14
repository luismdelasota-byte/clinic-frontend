import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Calendar, Lock, Save, ShieldCheck } from "lucide-react";
import { getPatientById, updatePatient } from "../../services/patientService";
import { changePassword } from "../../services/userService";
import "../../styles/PatientProfile.css";

const PatientProfile: React.FC = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // States for password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const patientId = localStorage.getItem("patientId");

  useEffect(() => {
    if (patientId) {
      loadData();
    }
  }, [patientId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getPatientById(Number(patientId));
      setPatient(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await updatePatient(Number(patientId), patient);
      setSuccessMsg("Perfil actualizado correctamente.");
    } catch (error) {
      setErrorMsg("Error al actualizar el perfil.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    
    if (newPassword !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      await changePassword(patient.user.id, newPassword);
      setSuccessMsg("Contraseña cambiada correctamente.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMsg("Error al cambiar la contraseña.");
    }
  };

  if (loading) return <div className="loading-state">Cargando perfil...</div>;

  return (
    <div className="patient-profile-wrapper">
      <header className="page-header-top">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          <span>Volver al Dashboard</span>
        </button>
        <div className="title-group">
          <User className="header-icon" size={32} />
          <h1>Mi Perfil</h1>
        </div>
      </header>

      <div className="profile-container animate-fade-in">
        {(successMsg || errorMsg) && (
          <div className={`alert-message ${successMsg ? 'success' : 'error'}`}>
            {successMsg || errorMsg}
          </div>
        )}

        {!patient ? (
          <div className="empty-state">
            <User size={48} />
            <p>No se pudieron cargar los datos del perfil.</p>
          </div>
        ) : (
          <div className="profile-grid">
            {/* Datos Personales */}
            <div className="profile-card">
              <div className="card-header">
                <ShieldCheck size={24} />
                <h2>Datos Personales</h2>
              </div>
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="input-group">
                  <label>Nombre Completo</label>
                  <div className="input-wrapper">
                    <User size={18} />
                    <input 
                      type="text" 
                      value={patient.name || ""} 
                      onChange={(e) => setPatient({...patient, name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Correo Electrónico</label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input 
                      type="email" 
                      value={patient.email || ""} 
                      onChange={(e) => setPatient({...patient, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Teléfono</label>
                  <div className="input-wrapper">
                    <Phone size={18} />
                    <input 
                      type="text" 
                      value={patient.phone || ""} 
                      onChange={(e) => setPatient({...patient, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Fecha de Nacimiento</label>
                  <div className="input-wrapper">
                    <Calendar size={18} />
                    <input 
                      type="date" 
                      value={patient.birthDate || ""} 
                      onChange={(e) => setPatient({...patient, birthDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary">
                  <Save size={18} /> Guardar Cambios
                </button>
              </form>
            </div>

            {/* Seguridad */}
            <div className="profile-card">
              <div className="card-header">
                <Lock size={24} />
                <h2>Seguridad</h2>
              </div>
              <form onSubmit={handleChangePassword} className="profile-form">
                <p className="form-info">Cambia tu contraseña de acceso.</p>
                
                <div className="input-group">
                  <label>Nueva Contraseña</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Confirmar Contraseña</label>
                  <div className="input-wrapper">
                    <Lock size={18} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-secondary">
                  Actualizar Contraseña
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
