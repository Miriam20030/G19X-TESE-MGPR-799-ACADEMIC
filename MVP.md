# MVP — Sistema de Evaluación Inteligente de Proveedores

## 1. Nombre del sistema

**Sistema de Evaluación Inteligente de Proveedores**

---

## 2. Descripción del MVP

El Producto Mínimo Viable (MVP) consiste en una aplicación web orientada a la evaluación, seguimiento y análisis del desempeño de proveedores.

El sistema permite gestionar la información de los proveedores, realizar evaluaciones mediante diferentes indicadores de desempeño, almacenar los resultados obtenidos y consultar el historial de evaluaciones realizadas.

Como parte del componente inteligente, el sistema incorpora un módulo desarrollado con Python y FastAPI que utiliza un modelo de aprendizaje automático para analizar los indicadores de una evaluación y estimar el nivel de riesgo del proveedor. A partir de los resultados obtenidos también se genera una recomendación orientada a facilitar la interpretación de la evaluación y apoyar la toma de decisiones.

El MVP integra un frontend desarrollado con React, un backend desarrollado con Spring Boot, una base de datos en Microsoft SQL Server y un servicio independiente de análisis inteligente desarrollado con Python y FastAPI.

---

## 3. Problema que resuelve

La evaluación de proveedores puede requerir el análisis de diferentes indicadores y el seguimiento de resultados obtenidos a través del tiempo. Cuando este proceso se realiza de manera manual o mediante información distribuida, puede resultar difícil mantener un historial organizado, identificar proveedores con bajo desempeño y tomar decisiones basadas en información actualizada.

El sistema busca solucionar esta situación mediante una plataforma centralizada que permita administrar proveedores, realizar evaluaciones, almacenar resultados, consultar el historial y obtener recomendaciones basadas en los indicadores registrados.

---

## 4. Objetivo del MVP

Desarrollar una aplicación web funcional que permita evaluar el desempeño de proveedores mediante indicadores definidos, almacenar los resultados obtenidos y utilizar un módulo de análisis inteligente para identificar niveles de riesgo y generar recomendaciones que apoyen la toma de decisiones.

---

## 5. Delimitación del proyecto

El sistema se delimita a la evaluación y seguimiento del desempeño de proveedores mediante el análisis de indicadores relacionados con el cumplimiento de entregas, calidad, costos, tiempos de respuesta e incidencias.

A partir de la información registrada durante las evaluaciones, el sistema calcula una calificación general, clasifica el desempeño del proveedor y utiliza un modelo de inteligencia artificial para realizar una predicción del nivel de riesgo.

El sistema también genera recomendaciones de acuerdo con el desempeño obtenido y los indicadores que presentan las puntuaciones más bajas.

El MVP contempla la gestión de proveedores, realización de evaluaciones, almacenamiento de resultados, consulta del historial, generación de recomendaciones y consulta de alertas relacionadas con evaluaciones que requieren atención.

Las funcionalidades de integración con sistemas empresariales externos, modelos predictivos más avanzados, automatizaciones empresariales y otras características de nivel productivo quedan fuera del alcance inicial del MVP y pueden incorporarse en versiones posteriores.

---

# 6. Usuarios del sistema

El sistema está dirigido principalmente a usuarios encargados de administrar y evaluar proveedores dentro de una organización.

El usuario puede:

* Iniciar sesión en el sistema.
* Consultar proveedores.
* Registrar proveedores.
* Editar información de proveedores.
* Registrar información relacionada con los proveedores.
* Realizar evaluaciones.
* Consultar resultados.
* Consultar el historial de evaluaciones.
* Consultar alertas.
* Consultar reportes.
* Obtener recomendaciones para la gestión de proveedores.
* Cambiar su contraseña.

---

# 7. Funcionalidades principales del MVP

## 7.1 Inicio de sesión

El sistema cuenta con un módulo de autenticación que permite al usuario ingresar mediante sus credenciales.

El acceso permite controlar la entrada a las funcionalidades principales de la aplicación.

También se contempla la funcionalidad para cambiar la contraseña del usuario.

---

## 7.2 Gestión de proveedores

El sistema permite administrar la información de los proveedores registrados.

Las principales operaciones contempladas son:

* Consultar proveedores.
* Consultar un proveedor específico.
* Registrar nuevos proveedores.
* Actualizar información de proveedores.
* Eliminar proveedores.
* Registrar fotografías asociadas a proveedores.

La información se almacena en Microsoft SQL Server.

---

## 7.3 Evaluación de proveedores

El sistema permite realizar evaluaciones sobre los proveedores registrados.

La evaluación utiliza cinco indicadores principales:

* Cumplimiento de entregas.
* Calidad.
* Costos.
* Tiempo de respuesta.
* Incidencias.

Cada indicador recibe una puntuación que posteriormente es utilizada para obtener una calificación general.

---

## 7.4 Cálculo de la calificación

La calificación general se obtiene mediante una ponderación de los cinco indicadores.

Los pesos utilizados por el sistema son:

| Indicador                | Peso |
| ------------------------ | ---: |
| Cumplimiento de entregas |  25% |
| Calidad                  |  25% |
| Costos                   |  20% |
| Tiempo de respuesta      |  15% |
| Incidencias              |  15% |

La calificación se obtiene mediante la siguiente expresión:

```text
Calificación =
(Cumplimiento de entregas × 0.25) +
(Calidad × 0.25) +
(Costos × 0.20) +
(Tiempo de respuesta × 0.15) +
(Incidencias × 0.15)
```

El resultado se redondea a dos decimales.

---

## 7.5 Clasificación del desempeño

Después de calcular la calificación general, el sistema clasifica el desempeño del proveedor de acuerdo con los siguientes rangos:

| Calificación | Clasificación |
| ------------ | ------------- |
| 90 a 100     | Excelente     |
| 80 a 89.99   | Bueno         |
| 70 a 79.99   | Regular       |
| Menor a 70   | Riesgo        |

Esta clasificación permite interpretar de manera sencilla el resultado obtenido durante la evaluación.

---

## 7.6 Análisis mediante inteligencia artificial

El sistema cuenta con un servicio independiente desarrollado con Python y FastAPI.

Este servicio utiliza un modelo de aprendizaje automático almacenado en el archivo:

```text
modelo_riesgo.pkl
```

El modelo recibe como entrada los cinco indicadores de la evaluación:

```text
cumplimientoEntregas
calidad
costos
tiempoRespuesta
incidencias
```

A partir de estos datos, el modelo realiza una predicción del nivel de riesgo del proveedor.

El servicio también obtiene la probabilidad asociada a la categoría de riesgo alto.

---

## 7.7 Generación de recomendaciones

Después de analizar la evaluación, el sistema identifica los indicadores con las puntuaciones más bajas.

Con base en estos resultados genera una recomendación para el usuario.

Las recomendaciones pueden incluir acciones relacionadas con:

* Cumplimiento de entregas.
* Calidad.
* Costos.
* Tiempo de respuesta.
* Incidencias.

Por ejemplo, cuando un indicador presenta una puntuación baja, el sistema puede recomendar establecer compromisos de entrega, implementar controles de calidad, revisar costos, mejorar los canales de comunicación o establecer medidas preventivas.

La recomendación también considera la clasificación general del proveedor.

---

## 7.8 Historial de evaluaciones

El sistema almacena las evaluaciones realizadas y permite consultar los resultados obtenidos anteriormente.

El historial permite mantener un registro de las evaluaciones realizadas a los proveedores y facilita el seguimiento de su desempeño.

---

## 7.9 Alertas

El sistema cuenta con un módulo destinado a la consulta de alertas.

Las alertas permiten identificar evaluaciones o proveedores que requieren atención debido a resultados de desempeño bajos o situaciones que representan un posible riesgo.

Esta funcionalidad facilita la identificación de casos que requieren seguimiento.

---

## 7.10 Reportes

El sistema incorpora un módulo de reportes para facilitar la consulta de la información generada durante el proceso de evaluación.

Los reportes permiten presentar información relacionada con los proveedores y sus evaluaciones de manera organizada.

---

## 7.11 Configuración

El sistema cuenta con un apartado de configuración para administrar opciones relacionadas con el funcionamiento de la aplicación.

---

# 8. Flujo principal del MVP

El funcionamiento principal del sistema sigue el siguiente flujo:

```text
Inicio de sesión
       ↓
Consulta de proveedores
       ↓
Selección de proveedor
       ↓
Nueva evaluación
       ↓
Captura de indicadores
       ↓
Cálculo de calificación
       ↓
Clasificación del desempeño
       ↓
Análisis mediante IA
       ↓
Predicción de riesgo
       ↓
Generación de recomendación
       ↓
Almacenamiento de evaluación
       ↓
Historial / Alertas / Reportes
```

---

# 9. Arquitectura del sistema

El MVP está compuesto por tres componentes principales.

## 9.1 Frontend

El frontend proporciona la interfaz gráfica mediante la cual el usuario interactúa con el sistema.

Tecnologías utilizadas:

* React.
* Vite.
* JavaScript.
* HTML.
* CSS.
* React Router.

Entre las principales vistas se encuentran:

* Inicio de sesión.
* Proveedores.
* Registro de proveedores.
* Edición de proveedores.
* Evaluaciones.
* Nueva evaluación.
* Alertas.
* Reportes.
* Configuración.

---

## 9.2 Backend

El backend se encarga de procesar las solicitudes realizadas desde el frontend y administrar la comunicación con la base de datos.

Tecnologías utilizadas:

* Java.
* Spring Boot.
* Spring Data JPA.
* Maven.

El backend contiene controladores relacionados con:

* Autenticación.
* Proveedores.
* Evaluaciones.

---

## 9.3 Servicio de inteligencia artificial

El componente de inteligencia artificial se encuentra desarrollado de manera independiente.

Tecnologías utilizadas:

* Python.
* FastAPI.


El servicio proporciona endpoints para comprobar el estado del componente de IA y analizar una evaluación.

---

## 9.4 Base de datos

La información del sistema se almacena mediante:

**SQL Server**

La base de datos permite conservar la información relacionada con:

* Usuarios.
* Proveedores.
* Evaluaciones.
* Resultados.
* Historial.

---

# 10. Comunicación entre componentes

La comunicación del sistema se realiza de la siguiente manera:

```text
                 ┌──────────────────┐
                 │     Usuario      │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │    Frontend      │
                 │ React + Vite     │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │     Backend      │
                 │   Spring Boot   │
                 └───────┬──────────┘
                         │
                 ┌───────┴──────────┐
                 ▼                  ▼
        ┌─────────────────┐  ┌──────────────────┐
        │   SQL Server    │  │ Servicio de IA   │
        │ Base de datos   │  │ Python + FastAPI │
        └─────────────────┘  └──────────────────┘
```

El frontend solicita información al backend mediante servicios HTTP.

El backend procesa las solicitudes y se comunica con SQL Server para consultar o almacenar información.

Cuando se requiere el análisis inteligente de una evaluación, se envían los indicadores al servicio desarrollado con Python y FastAPI.

---

# 11. Tecnologías utilizadas

| Componente              | Tecnología           |
| ----------------------- | -------------------- |
| Frontend                | React                |
| Herramienta frontend    | Vite                 |
| Backend                 | Java + Spring Boot   |
| Gestión de dependencias | Maven                |
| Base de datos           | SQL Server           |
| Inteligencia artificial | Python               |
| API de IA               | FastAPI              |
| Modelo de IA            | Machine Learning     |
| Comunicación            | HTTP / API REST      |
| Control de versiones    | Git                  |

---

# 12. Requisitos para ejecutar el MVP

Para ejecutar el sistema se requiere:

* Sistema operativo compatible con las herramientas utilizadas.
* Java instalado.
* Node.js y npm instalados.
* Python instalado.
* Microsoft SQL Server instalado y configurado.
* Base de datos del sistema.
* Archivos del frontend.
* Archivos del backend.
* Archivos del módulo de inteligencia artificial.

---

# 13. Ejecución del frontend

Desde la carpeta:

```text
frontend
```

se deben instalar las dependencias:

```bash
npm install
```

Posteriormente se inicia el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible normalmente en:

```text
http://localhost:5173
```

---

# 14. Ejecución del backend

Desde la carpeta:

```text
backend
```

se puede ejecutar el proyecto mediante Maven Wrapper:

```bash
mvnw spring-boot:run
```

El backend debe encontrarse configurado para conectarse con SQL Server.

---

# 15. Ejecución del servicio de inteligencia artificial

El módulo de inteligencia artificial se encuentra dentro de la carpeta `ia` y utiliza un entorno virtual de Python para administrar sus dependencias.

Primero se debe ingresar a la carpeta correspondiente:

```bash
cd ia
```

Posteriormente, se activa el entorno virtual:

```bash
venv\Scripts\activate
```

Una vez activado el entorno virtual, se inicia el servidor de FastAPI mediante Uvicorn:

```bash
uvicorn main:app --reload
```

El parámetro `--reload` permite que el servidor se reinicie automáticamente cuando se detecten cambios en los archivos del proyecto durante el desarrollo.

El servicio de inteligencia artificial queda disponible para recibir las solicitudes realizadas por el backend.


---

# 16. Criterios de aceptación del MVP

El MVP se considera funcional cuando se cumplen los siguientes criterios:

### Autenticación

* El usuario puede iniciar sesión.
* El sistema valida las credenciales.
* El usuario puede cambiar su contraseña.

### Proveedores

* Se pueden consultar proveedores.
* Se pueden registrar proveedores.
* Se puede modificar información.
* Se pueden eliminar proveedores.
* Se puede asociar una fotografía.

### Evaluaciones

* Se puede seleccionar un proveedor.
* Se puede crear una evaluación.
* Se pueden registrar los cinco indicadores.
* Se calcula una calificación general.
* Se genera una clasificación.

### Inteligencia artificial

* El servicio de IA puede iniciarse correctamente.
* El sistema puede enviar una evaluación al servicio.
* El modelo puede realizar una predicción.
* Se obtiene la probabilidad de riesgo alto.
* Se genera una recomendación.

### Historial

* Las evaluaciones quedan almacenadas.
* Se pueden consultar evaluaciones anteriores.

### Alertas y reportes

* El usuario puede acceder al módulo de alertas.
* El usuario puede consultar la información disponible.
* El usuario puede acceder al módulo de reportes.

---

# 17. Alcance del MVP

El MVP permite demostrar el flujo completo de evaluación de un proveedor:

```text
Proveedor
   ↓
Evaluación
   ↓
Indicadores
   ↓
Calificación
   ↓
Clasificación
   ↓
Análisis IA
   ↓
Riesgo
   ↓
Recomendación
   ↓
Historial
```

El alcance se centra en proporcionar una solución funcional para centralizar la información de proveedores y apoyar su evaluación mediante herramientas de análisis tradicional e inteligente.

---

# 18. Funcionalidades fuera del MVP

Las siguientes características se consideran posibles ampliaciones para futuras versiones:

* Integración con sistemas ERP empresariales.
* Integración con sistemas de compras.
* Notificaciones automáticas por correo electrónico.
* Automatización de evaluaciones periódicas.
* Modelos predictivos más avanzados.
* Análisis de tendencias a largo plazo.
* Predicción de incumplimientos futuros.
* Dashboards empresariales avanzados.
* Gestión avanzada de roles y permisos.
* Despliegue en infraestructura de producción.
* Integración con servicios externos de inteligencia artificial.
* Automatización completa de la selección de proveedores.

---

# 19. Limitaciones del MVP

El MVP depende de la disponibilidad de Microsoft SQL Server para almacenar la información y de la configuración correcta de las conexiones entre los diferentes componentes.

El modelo de inteligencia artificial utilizado depende de los datos con los que fue entrenado y de los indicadores proporcionados durante cada evaluación.

La versión inicial está orientada principalmente a demostrar el flujo funcional de evaluación y análisis de proveedores, por lo que algunas funcionalidades empresariales avanzadas pueden requerir desarrollo adicional.

---

# 20. Resultado esperado

Al finalizar la implementación del MVP se obtiene una aplicación web capaz de centralizar la gestión y evaluación de proveedores.

El usuario puede registrar y consultar proveedores, realizar evaluaciones, obtener una calificación general, conocer la clasificación de desempeño, recibir un análisis de riesgo mediante inteligencia artificial y consultar recomendaciones relacionadas con los principales aspectos que requieren atención.

De esta manera, el sistema proporciona una herramienta de apoyo para la gestión y seguimiento de proveedores mediante información estructurada y análisis automatizado.

---

# 21. Estado del MVP

**Estado:** MVP funcional en desarrollo y pruebas.

Los componentes principales del sistema se encuentran implementados:

* Frontend web.
* Backend REST.
* Base de datos SQL Server.
* Servicio de inteligencia artificial.
* Gestión de proveedores.
* Evaluaciones.
* Historial.
* Recomendaciones.
* Alertas.
* Reportes.
* Autenticación.

Las siguientes etapas corresponden principalmente a la preparación del entorno de ejecución, pruebas finales, documentación y empaquetado del sistema para su entrega.
