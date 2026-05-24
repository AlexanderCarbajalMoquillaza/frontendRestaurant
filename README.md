# Inventario de Productos

Aplicación web desarrollada en React para gestionar el inventario de productos conectado a un backend propio con Spring Boot.

## Descripción

Permite realizar las operaciones CRUD completas sobre el recurso **Producto**:

- **Listar:** Visualiza todos los productos registrados en la base de datos en una tabla con su nombre, descripción, precio, stock y estado.
- **Crear:** Añade nuevos productos mediante un formulario con validaciones.
- **Editar:** Modifica la información de un producto existente.
- **Eliminar:** Borra un producto con confirmación previa.

## Tecnologías utilizadas

- [React](https://react.dev/) con hooks (`useState`, `useEffect`)
- [Vite](https://vitejs.dev/) como bundler y servidor de desarrollo
- [Tailwind CSS](https://tailwindcss.com/) para estilos utilitarios
- [DaisyUI](https://daisyui.com/) para componentes de interfaz
- [SweetAlert2](https://sweetalert2.github.io/) para confirmaciones de eliminación
- [React Hot Toast](https://react-hot-toast.com/) para notificaciones de éxito y error
- `Fetch API` nativa para el consumo de la API REST del backend

## Requisitos previos

- Node.js >= 18
- pnpm instalado globalmente (`npm install -g pnpm`)
- El microservicio `ms-productos` (Spring Boot) corriendo en el puerto `8080`

## Instalación y ejecución

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar la URL del backend (ya viene configurada por defecto)
# Editar el archivo .env.local si el backend corre en un puerto distinto
# VITE_API_BASE_URL="http://localhost:8080/api/productos"

# 3. Iniciar el servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en: `http://localhost:5173`

## Estructura del proyecto

```
frontend-crud/
├── src/
│   ├── components/
│   │   ├── ProductoForm.jsx    # Formulario para crear y editar
│   │   └── ProductoList.jsx    # Tabla con listado de productos
│   ├── services/
│   │   └── api.js              # Funciones fetch para el CRUD
│   ├── App.jsx                 # Componente principal y manejo de estado
│   └── index.css               # Estilos globales (Tailwind + DaisyUI)
├── .env.local                  # Variables de entorno (URL del backend)
└── package.json
```
