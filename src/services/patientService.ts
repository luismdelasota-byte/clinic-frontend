import api from "./api";

// Obtener todos los pacientes
export const getAllPatients = async () => {
  const response = await api.get("/api/patients");
  return response.data;
};

// Crear un nuevo paciente
export const savePatient = async (patient: any) => {
  const response = await api.post("/api/patients", patient);
  return response.data;
};

// Obtener paciente por ID
export const getPatientById = async (id: number) => {
  const response = await api.get(`/api/patients/${id}`);
  return response.data;
};

// Eliminar paciente por ID
export const deletePatient = async (id: number) => {
  await api.delete(`/api/patients/${id}`);
};
