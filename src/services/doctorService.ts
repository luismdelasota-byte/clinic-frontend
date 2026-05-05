import api from  "./api.ts";

//Obtener todos los doctores
/* Importante:
export -> permite usar esta funcion en otros archivos
const getAllDoctors -> definimos la  funcion
async -> asíncrona, trabaja con peticiones al servidor

api -> instancia de axios
.get(...) -> Hacemos peticion HTTP tipo GET para obtener datos
await -> espera que el sevidor responsa antes de continuar

conts response -> Aqui guardamos la respuesta completa del servidor
ENTONCES -> api.get(...) envia la peticion*/
export const getAllDoctors = async () => {
    const response = await api.get("/api/doctors");
    return response.data;
}

//Crear un nuevo doctor
/* api.post(..., ...) envia peticion HTTP POST con los datos del doctor*/
export const saveDoctor = async (doctor:any) => {
    const response = await api.post("/api/doctors", doctor);
    return response.data;
}

//Obtener doctor por ID
export const getDoctorById = async (id:number) => {
    const response = await api.get(`/api/doctors/${id}`);
    return response.data;
}

//Eliminar doctor por ID
export const deleteDoctor = async (id:number) => {
    await api.delete(`/api/doctors/${id}`);
}