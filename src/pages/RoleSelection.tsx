import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RoleSelection.css";

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role: string) => {
    localStorage.setItem("selectedRole", role);
    navigate("/login");
  };

  return (
    <div className="role-selection-container">
      <header className="role-header">
        <h1>Clínica San Luis</h1>
        <h2>Selecciona tu rol para ingresar</h2>
      </header>

      <div className="role-grid">
        <div className="role-card admin" onClick={() => handleRoleClick("ADMIN")}>
          <h3>ADMIN</h3>
          <p>Panel de control</p>
        </div>

        <div className="role-card user" onClick={() => handleRoleClick("USER")}>
          <h3>USER</h3>
          <p>Área del cajero</p>
        </div>

        <div className="role-card doctor" onClick={() => handleRoleClick("DOCTOR")}>
          <h3>DOCTOR</h3>
          <p>Área del médico</p>
        </div>

        <div className="role-card patient" onClick={() => handleRoleClick("PATIENT")}>
          <h3>PATIENT</h3>
          <p>Mi espacio personal</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;