# Frontend - Sistema de Evaluación de Proveedores

## 1. Descripción general

El frontend del Sistema de Evaluación de Proveedores es el componente encargado de proporcionar la interfaz gráfica para que los usuarios puedan interactuar con las funcionalidades del sistema.

Permite administrar proveedores, registrar evaluaciones, consultar resultados, visualizar alertas y acceder a los diferentes módulos de la aplicación.

## 2. Tecnologías utilizadas

- **React:** biblioteca utilizada para desarrollar la interfaz de usuario.
- **Vite:** herramienta para ejecutar y construir el proyecto.
- **JavaScript:** lenguaje de programación utilizado en el frontend.
- **HTML5:** estructura de las vistas.
- **CSS3:** diseño y estilos visuales.
- **React Router DOM:** navegación entre las diferentes páginas del sistema.

## 3. Instalación

Para ejecutar el frontend localmente, seguir los siguientes pasos:

**Paso 1.** Abrir una terminal y ubicarse en la carpeta `frontend` del proyecto.

**Paso 2.** Instalar las dependencias:

```bash
npm install
```

**Paso 3.** Iniciar el servidor de desarrollo:

```bash
npm run dev
```

**Paso 4.** Abrir el navegador en la dirección:

```text
http://localhost:5173
```

## 4. Funcionalidades principales

El frontend cuenta con los siguientes módulos:

- **Inicio de sesión:** permite el acceso de los usuarios.
- **Proveedores:** consulta y visualización de proveedores registrados.
- **Registrar proveedor:** permite agregar nuevos proveedores.
- **Editar proveedor:** permite modificar información existente.
- **Evaluaciones:** consulta de evaluaciones realizadas.
- **Nueva evaluación:** registro de evaluaciones de desempeño.
- **Alertas:** visualización de alertas relacionadas con los proveedores.
- **Reportes:** consulta de información y resultados.
- **Configuración:** personalización de opciones del sistema.

## 5. Comunicación con el backend

El frontend se comunica con el backend mediante solicitudes HTTP a los servicios REST desarrollados con Spring Boot.

El backend procesa las solicitudes, consulta o modifica la información almacenada en SQL Server y devuelve las respuestas correspondientes al frontend.

## 6. Integración con inteligencia artificial

El sistema incorpora un módulo de inteligencia artificial desarrollado con Python y FastAPI.

Desde el frontend se pueden consultar funcionalidades relacionadas con la evaluación y predicción de riesgos de los proveedores, mediante la comunicación con los servicios correspondientes del sistema.

## 7. Ejecución

Para utilizar correctamente el sistema, es necesario que se encuentren iniciados los servicios del backend, la base de datos y el módulo de inteligencia artificial cuando la funcionalidad lo requiera.

El frontend se ejecuta mediante Vite en el puerto 5173.