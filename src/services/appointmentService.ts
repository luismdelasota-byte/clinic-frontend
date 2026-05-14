import api from "./api.ts";

//Obtener todas las citas
export const getAllAppointments = async () => {
    const response = await api.get("/api/appointments");
    return response.data;
}

//Crear nueva cita
export const saveAppointment = async (appointment:any) =>{
    const response = await api.post("/api/appointments", appointment);
    return response.data;
}

//Obtener cita por ID
export const getAllAppointmentById = async (id:number) => {
    const response = await api.get(`/api/appointments/${id}`);
    return response.data;
}

//Eliminar cita por ID
export const deleteAppointment = async (id:number) => {
    await api.delete(`/api/appointments/${id}`);
}

//Obtener citas por paciente
export const getAppointmentsByPatient = async (patientId: number) => {
    const response = await api.get(`/api/appointments/patient/${patientId}`);
    return response.data;
};

//Obtener citas por doctor
export const getAppointmentsByDoctor = async (doctorId: number) => {
  try {
    const response = await api.get(`/api/appointments/doctor/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener citas del doctor", error);
    throw error;
  }
};

//Actualizar estado de cita
export const updateAppointmentStatus = async (id: number, status: string) => {
    const response = await api.patch(`/api/appointments/${id}/status`, status, {
        headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
};
