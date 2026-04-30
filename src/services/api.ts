/*Capa de servicios, aca hacemos lo siguiente:
1.Configuramos "axios" con la URL base del backend y un interceptor para que siempre envie el token existe

2. No usaremos api.tsx -> ya que esto es para JSX(componentes React) api.ts -> codigo TypeScript normal*/

/*instalar npm install axios:
-Axios es la herramienta que usaremos para hacer 
peticiones HTTP(GET, POST, PUT, DELETE) al backend
--Sin esto, no podemos comunicar el frontend con el backend*/
import axios from "axios";

//Configuracion base de Axios
const api = axios.create({
    baseURL: "http://localhost:8081" //Define la direccion base del backend
});

//Interceptor para incluir el token en cada request
/*Antes de ejecutar cualquier request, ejecuta esta funcion "api.interceptor.request.use((config) => {})*/
api.interceptors.request.use((config) => {

    //Busca el token guardado en el navegador
    //localStorage -> memoria del navegador
    //"token" -> clave donde guardamose el JWT des pues del logon
    const token = localStorage.getItem("token");

    //Si el usuario esta autenticando, es decir si el token existe
    if(token){

        //Agrefamos el token en el "header" header HTTP
        config.headers.Authorization = `Bearer ${token}`;
    }

    //devuelve la configuracion modificada
    return config;
});

export default api;