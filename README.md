## Clínica San Luis - Frontend

Frontend en React + TypeScript para el sistema clínico.  
Este módulo permite la interacción de distintos roles (ADMIM, DOCTOR, PATIENT) con dashboards personalizados y conexión al backend vía API REST, pryecto en crecimiento.

---

##  Tecnologías usadas

- [React] + [TypeScript]
- [Vite] como bundler y dev server
- [Axios] para consumo de APIs REST
- [React Router] v7 para navegación
- CSS Modules para estilos organizados y encapsulados
- [ESLint] para linting de código
---

## Estructura del proyecto
- frontend/
- ├── public/              # Archivos estáticos
- ├── src/
- │   ├── service/api.ts   # Conexión con backend (api.ts)
- │   |── assets/          # Imagenes
- |   ├── pages/           # Pantallas principales (Login, Dashboard, etc.)
- │   ├── styles/          # Estilos CSS organizados
- │   ├── App.tsx          # Rutas principales
- │   └── main.tsx         # Punto de entrada
- ├── package.json
- └── README.md   

---