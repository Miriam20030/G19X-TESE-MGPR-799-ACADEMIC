# Sistema de Evaluación Inteligente de Proveedores

## 1. Descripción del proyecto

El Sistema de Evaluación Inteligente de Proveedores es una aplicación web desarrollada para registrar, administrar y evaluar el desempeño de proveedores mediante indicadores de cumplimiento de entregas, calidad, costos, tiempos de respuesta e incidencias.

El sistema incorpora un servicio de inteligencia artificial que analiza los indicadores de evaluación, estima el nivel de riesgo y genera recomendaciones para apoyar la toma de decisiones relacionadas con la selección y gestión de proveedores.

La aplicación está integrada por tres componentes principales: frontend, backend y servicio de inteligencia artificial, además de una base de datos relacional.

## 2. Funcionalidades principales

- Registro, consulta, edición y eliminación de proveedores.
- Inicio de sesión y administración de usuarios.
- Registro y consulta de evaluaciones.
- Cálculo de calificaciones y clasificación del desempeño.
- Análisis de riesgo mediante inteligencia artificial.
- Generación de recomendaciones para la gestión de proveedores.
- Visualización de resultados y seguimiento de evaluaciones.
- Configuración de la cuenta y cambio de contraseña.

## 3. Tecnologías utilizadas

| Componente | Tecnología |
|---|---|
| Frontend | React, JavaScript y Vite |
| Backend | Java y Spring Boot |
| Acceso a datos | Spring Data JPA |
| Seguridad | Spring Security y BCrypt |
| Base de datos | Microsoft SQL Server |
| Inteligencia artificial | Python, FastAPI y scikit-learn |
| Comunicación | API REST |
| Control de versiones | Git y GitHub |

## 4. Requisitos previos

Antes de instalar y ejecutar el sistema, es necesario contar con las siguientes herramientas:

- Java JDK 21.
- Maven o Maven Wrapper, si está disponible y correctamente configurado.
- Node.js y npm.
- Python compatible con las dependencias de `ia/requirements.txt`.
- Microsoft SQL Server.
- SQL Server Management Studio (SSMS), recomendado para administrar la base de datos.
- Git, para clonar el repositorio.

Para comprobar algunas instalaciones, se pueden ejecutar los siguientes comandos:

```bash
java -version
node -v
npm -v
python --version
git --version
```

## 5. Estructura del proyecto

```text
SistemaEvaluacionProveedores/
├── backend/
│   ├── src/
│   └── pom.xml
├── frontend/
│   ├── src/
│   └── package.json
├── ia/
│   ├── main.py
│   └── requirements.txt
├── database/
│   └── schema.sql
├── .gitignore
└── README.md
```

La estructura puede incluir archivos adicionales de configuración, dependencias y recursos necesarios para ejecutar el sistema.

## 6. Instalación y configuración

### 6.1. Descargar el proyecto

Si todavía no se tiene el proyecto descargado, abrir una terminal y ejecutar:

```bash
git clone https://github.com/Miriam20030/G19X-TESE-MGPR-799-ACADEMIC.git
cd G19X-TESE-MGPR-799-ACADEMIC
```

Si el proyecto ya está descargado, abrir directamente su carpeta principal en Visual Studio Code.

### 6.2. Crear la base de datos

Antes de iniciar los servicios, se debe preparar la base de datos.

1. Abrir SQL Server Management Studio (SSMS).
2. Conectarse a la instancia de SQL Server.
3. Abrir el archivo `database/schema.sql` del proyecto.
4. Ejecutar el script completo.
5. Verificar que se haya creado la base de datos `EvaluacionProveedores` y que existan las tablas correspondientes.

El script contiene la estructura de la base de datos y el registro inicial del administrador. Está preparado para evitar duplicaciones de los objetos y del registro inicial cuando se ejecuta nuevamente, según las condiciones definidas en el propio script.

La configuración predeterminada del backend utiliza SQL Server en `localhost`, puerto `1433`. Si la instancia utiliza otro nombre o puerto, será necesario ajustar la URL de conexión.

**Importante:** si ya existe una base de datos con información, se debe realizar una copia de seguridad antes de ejecutar scripts que puedan modificarla. No se debe sobrescribir ni eliminar una base de datos existente sin verificar previamente el contenido del script.

### 6.3. Configurar las credenciales de SQL Server y ejecutar el backend

El backend necesita un usuario y una contraseña válidos de SQL Server para conectarse a la base de datos `EvaluacionProveedores`.

Las credenciales se configuran mediante las variables de entorno `DB_USERNAME` y `DB_PASSWORD`. Se introducirán en la misma terminal de PowerShell donde se ejecutará el backend, sin escribirlas directamente en el código fuente ni en el repositorio.

**Paso 1. Abrir una terminal en Visual Studio Code**

En el menú superior, seleccionar **Terminal → Nueva terminal**.

**Paso 2. Entrar en la carpeta del backend**

Desde la carpeta principal del proyecto, ejecutar:

```powershell
cd backend
```

**Paso 3. Configurar el usuario y la contraseña de SQL Server**

En esa misma terminal, ejecutar:

```powershell
$env:DB_USERNAME = "TU_USUARIO_SQL"
$env:DB_PASSWORD = "TU_CONTRASENA_SQL"
```

Reemplazar `TU_USUARIO_SQL` y `TU_CONTRASENA_SQL` por las credenciales reales de la instancia de SQL Server que se utilizará.

La cuenta debe tener los permisos necesarios para acceder a la base de datos `EvaluacionProveedores`.

**Paso 4. Iniciar el backend**

Sin cerrar la terminal y después de configurar ambas variables, ejecutar:

```powershell
.\mvnw.cmd spring-boot:run
```

Este comando requiere que el Maven Wrapper esté correctamente configurado. Si no está disponible, se puede utilizar Maven instalado en el equipo:

```powershell
mvn spring-boot:run
```

El backend se ejecuta en el puerto `8080`, siempre que la configuración sea correcta y la base de datos esté disponible.

Dirección local: http://localhost:8080

**Importante:**

- Las variables configuradas con `$env:` permanecen disponibles en esa sesión de PowerShell.
- Si se cierra la terminal o se abre otra para iniciar el backend, será necesario configurar las variables nuevamente.
- No se deben publicar las credenciales reales en GitHub.
- El archivo `backend/src/main/resources/application.properties.example` sirve como referencia para la configuración.
- Si la conexión falla, se deben comprobar las credenciales, los permisos, la instancia y el puerto de SQL Server.

### 6.4. Instalar y ejecutar el servicio de inteligencia artificial

El servicio de inteligencia artificial se ejecuta de manera independiente del backend y del frontend.

**Paso 1. Abrir una segunda terminal**

En Visual Studio Code, seleccionar **Terminal → Nueva terminal**.

**Paso 2. Entrar en la carpeta de IA**

Desde la carpeta principal del proyecto, ejecutar:

```powershell
cd ia
```

**Paso 3. Crear el entorno virtual de Python**

```powershell
python -m venv venv
```

**Paso 4. Activar el entorno virtual**

```powershell
.\venv\Scripts\Activate.ps1
```

**Paso 5. Instalar las dependencias**

```powershell
python -m pip install -r requirements.txt
```

**Paso 6. Iniciar el servicio**

```powershell
uvicorn main:app --reload
```

El servicio de inteligencia artificial se ejecuta en el puerto `8000`.

Dirección local: http://localhost:8000

Documentación interactiva de la API: http://localhost:8000/docs

El servicio requiere que estén disponibles los archivos del modelo que utilice `main.py`, en las ubicaciones esperadas por la implementación actual.

Si PowerShell impide activar el entorno virtual, se puede utilizar una terminal compatible o ajustar la política de ejecución de acuerdo con las restricciones del equipo.

### 6.5. Instalar y ejecutar el frontend

El frontend se ejecuta de manera independiente en una tercera terminal.

**Paso 1. Abrir una tercera terminal**

En Visual Studio Code, seleccionar **Terminal → Nueva terminal**.

**Paso 2. Entrar en la carpeta del frontend**

Desde la carpeta principal del proyecto, ejecutar:

```powershell
cd frontend
```

**Paso 3. Configurar la URL del backend**

El frontend permite configurar la dirección del backend mediante la variable de entorno `VITE_API_URL`.

Por defecto, el sistema utiliza la siguiente dirección:

```env
VITE_API_URL=http://localhost:8080
```

Si se necesita utilizar otra dirección, se debe crear un archivo `.env` dentro de la carpeta `frontend` y definir la variable `VITE_API_URL` con la URL correspondiente.

El repositorio incluye el archivo `frontend/.env.example` como plantilla de configuración. Este archivo sirve como referencia y no debe contener credenciales privadas.

El servicio de inteligencia artificial también se puede configurar mediante la variable `VITE_IA_URL`. Su valor predeterminado es:

```env
VITE_IA_URL=http://localhost:8000/ia/analizar
```

Si se modifican las variables de entorno, es necesario reiniciar el servidor de desarrollo de Vite para que los cambios surtan efecto.

**Paso 4. Instalar las dependencias**

```powershell
npm install
```

**Paso 5. Iniciar la aplicación**

```powershell
npm run dev
```

Vite mostrará la dirección local de la aplicación. En la configuración habitual del proyecto es:

http://localhost:5173

Abrir esa dirección en el navegador para utilizar el sistema.

## 7. Puertos de los servicios

| Servicio | Puerto | Dirección local |
|---|---:|---|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 8080 | http://localhost:8080 |
| Inteligencia artificial | 8000 | http://localhost:8000 |
| SQL Server | 1433 | Configuración predeterminada |

Para utilizar las funcionalidades del sistema, deben estar disponibles SQL Server y los tres servicios de la aplicación.

Las terminales que ejecutan el backend, la IA y el frontend deben permanecer abiertas mientras se utiliza el sistema.

## 8. Primer inicio de sesión

El script `database/schema.sql` incluye un registro inicial de administrador.

- **Usuario:** `admin`
- **Correo:** `admin@evaluacion.com`

La contraseña inicial debe verificarse con la configuración de la versión entregada del proyecto. El script almacena la contraseña mediante un hash BCrypt, por lo que no se debe asumir una contraseña que no haya sido comprobada.

Después de iniciar sesión, se recomienda cambiar la contraseña inicial por una propia y segura desde la sección de configuración, si esta funcionalidad está disponible.

## 9. Seguridad y limitaciones conocidas

El sistema incorpora medidas de seguridad para proteger el acceso a la aplicación y la información almacenada en la base de datos.

Entre las medidas implementadas se encuentran:

- Uso de variables de entorno para configurar las credenciales de SQL Server.
- Verificación de contraseñas mediante BCrypt.
- Protección del backend mediante Spring Security.
- Requerimiento de una sesión autenticada para acceder a las operaciones protegidas de proveedores y evaluaciones.
- Manejo de respuestas de autenticación no autorizada para controlar las sesiones vencidas.
- Restricción de los orígenes permitidos mediante la configuración de CORS.
- Validaciones de datos en los procesos de autenticación.
- Validación de extensión y ruta de las fotografías de proveedores.

**Limitación pendiente: comunicación con el servicio de inteligencia artificial.**

El backend exige una sesión autenticada para acceder a las operaciones protegidas por Spring Security. Sin embargo, el servicio de inteligencia artificial implementado con FastAPI se ejecuta de manera independiente en el puerto `8000`. La autenticación del backend no protege automáticamente los endpoints de este servicio.

Por ello, se debe revisar y, si corresponde, implementar autenticación o restricciones de acceso para el servicio de IA, además de mantener una configuración adecuada de CORS y evitar la exposición innecesaria del servicio a redes externas.

Antes de desplegar el sistema en un entorno de producción, se recomienda verificar la protección de todos los endpoints, gestionar adecuadamente los secretos, revisar los permisos de acceso a la base de datos y validar la configuración de red de los servicios.

La configuración descrita en este documento está orientada al desarrollo local.

## 10. Uso de inteligencia artificial durante el desarrollo

Se utilizaron herramientas de inteligencia artificial generativa como apoyo durante el desarrollo, principalmente para resolver dudas de programación, analizar errores, proponer mejoras de código y estructura, y elaborar o revisar documentación.

Además, el sistema incorpora un servicio de análisis inteligente implementado con Python, FastAPI y scikit-learn. Este servicio procesa indicadores de evaluación para calcular calificaciones, estimar riesgos y apoyar la generación de recomendaciones.

Las herramientas de inteligencia artificial se utilizaron como apoyo al proceso de desarrollo y no sustituyen la revisión del código, las pruebas ni la responsabilidad sobre los resultados del sistema.

## 11. Documentación adicional

- `database/schema.sql`: script de creación de la base de datos.
- `backend/src/main/resources/application.properties.example`: ejemplo de configuración de conexión.
- `ia/requirements.txt`: dependencias del servicio de inteligencia artificial.
- `ia/main.py`: implementación de la API de análisis inteligente.
- `frontend/.env.example`: plantilla para configurar las direcciones del backend y del servicio de inteligencia artificial.

## 12. Información del proyecto

**Proyecto:** Sistema de Evaluación Inteligente de Proveedores.

**Organización:** PluriOne S.A. de C.V.

**Nombre comercial:** Develop Talent & Technology.
