import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ManagePatients from "./pages/patients/ManagePatients";
import ManageSchedule from "./pages/schedules/ManageSchedule";
import ManageDoctors from "./pages/doctors/ManageDoctors";
import ManageAppointments from "./pages/appointments/ManageAppointments";
import RegisterPatients from "./pages/patients/RegisterPatients";
import PatientAppointments from "./pages/patients/PatientAppointments";
import DoctorAppointments from "./pages/DoctorAppointments";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/patients" element = {<ManagePatients/>}/>
        <Route path="/patients/register" element={<RegisterPatients/>} />
        <Route path="/patients/citas" element={<PatientAppointments />} />
        <Route path="/doctors" element = {<ManageDoctors/>}/>
        <Route path="/schedule" element = {<ManageSchedule/>}/>
        <Route path="/appointments" element = {<ManageAppointments/>}/>
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
      </Routes>
    </Router>
  );
};

export default App;