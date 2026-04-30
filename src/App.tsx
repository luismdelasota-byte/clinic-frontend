import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Register from "./pages/Register.tsx";

//Componente principal
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<Login/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;