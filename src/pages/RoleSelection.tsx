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
      <h1>Clínica San Luis</h1>
      <h2>Selecciona tu rol para ingresar</h2>

      <div className="role-grid">
        <button onClick={() => handleRoleClick("ADMIN")}>ADMIN</button>
        <button onClick={() => handleRoleClick("USER")}>USER</button>
        <button onClick={() => handleRoleClick("DOCTOR")}>DOCTOR</button>
        <button onClick={() => handleRoleClick("PATIENT")}>PATIENT</button>
      </div>
    </div>
  );
};

export default RoleSelection;