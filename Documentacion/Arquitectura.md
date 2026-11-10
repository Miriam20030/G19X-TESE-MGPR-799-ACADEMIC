# Arquitectura del Sistema de Evaluación Inteligente de Proveedores

El Sistema de Evaluación Inteligente de Proveedores utiliza una arquitectura de tres capas, complementada con un módulo de Inteligencia Artificial y una base de datos distribuida mediante replicación de SQL Server.

Esta arquitectura permite separar la interfaz del usuario, la lógica del sistema y el almacenamiento de información, facilitando el mantenimiento, la organización y la comunicación entre los componentes.

## 1. Capas de la arquitectura

### 1.1 Capa de presentación (Frontend)

Es la parte visual del sistema con la que interactúa el usuario. Está desarrollada con React y Vite.

Sus principales funciones son:

- Inicio de sesión.
- Registro y edición de proveedores.
- Consulta de proveedores registrados.
- Registro de evaluaciones.
- Visualización de calificaciones.
- Consulta de alertas y riesgos.
- Configuración y reportes.

### 1.2 Capa lógica (Backend)

Es la encargada de procesar las solicitudes del usuario y ejecutar la lógica del sistema. Está desarrollada con Java 21 y Spring Boot.

Sus principales funciones son:

- Recibir las solicitudes del frontend.
- Procesar la información de los proveedores.
- Registrar y consultar evaluaciones.
- Comunicarse con la base de datos.
- Solicitar análisis al módulo de Inteligencia Artificial.
- Enviar los resultados al frontend mediante servicios API REST.

### 1.3 Capa de datos (Base de datos)

Se encarga de almacenar y administrar la información del sistema mediante Microsoft SQL Server.

Las principales tablas son:

| Tabla        | Descripción                                                 |
| ------------ | ----------------------------------------------------------- |
| Proveedores  | Almacena los datos de los proveedores registrados.          |
| Usuarios     | Almacena la información de los usuarios del sistema.        |
| Evaluaciones | Guarda las calificaciones y resultados de las evaluaciones. |

## 2. Módulo de Inteligencia Artificial

El sistema incorpora un módulo desarrollado con Python y FastAPI, que utiliza un algoritmo de aprendizaje automático llamado Random Forest.

Sus funciones son:

- Recibir los datos de una evaluación.
- Analizar el cumplimiento de entregas, calidad, costos, tiempo de respuesta e incidencias.
- Identificar posibles riesgos de los proveedores.
- Generar predicciones sobre el nivel de riesgo.

El módulo utiliza las bibliotecas pandas y scikit-learn para procesar los datos y realizar las predicciones.

## 3. Arquitectura de base de datos distribuida

El proyecto implementa una replicación transaccional mediante SQL Server, utilizando dos equipos conectados a través de una red local.

Equipo principal (Publicador y Distribuidor)

- Contiene la base de datos principal `EvaluacionProveedores`.
- Ejecuta las operaciones principales del sistema.
- Publica los cambios para que sean enviados al segundo equipo.

Segundo equipo (Suscriptor)

- Contiene la base de datos `EvaluacionProveedoresReplica`.
- Recibe los cambios enviados desde el equipo principal.
- Mantiene una copia de la información replicada.

Esta implementación permite demostrar la comunicación entre dos servidores y la distribución de información entre diferentes equipos.

## 4. Flujo de funcionamiento

1. El usuario ingresa al sistema desde el frontend.
2. El frontend envía solicitudes al backend mediante servicios API REST.
3. El backend procesa las solicitudes y consulta o modifica la información en SQL Server.
4. Cuando se requiere analizar una evaluación, el backend se comunica con el módulo de Inteligencia Artificial.
5. El módulo de IA procesa los datos y devuelve una predicción de riesgo.
6. El backend entrega los resultados al frontend.
7. SQL Server replica los cambios de la base de datos principal hacia el equipo suscriptor.

## 5. Tecnologías utilizadas

| Componente              | Tecnología             |
| ----------------------- | ---------------------- |
| Frontend                | React y Vite           |
| Backend                 | Java 21 y Spring Boot  |
| Comunicación            | API REST               |
| Base de datos           | Microsoft SQL Server   |
| Inteligencia Artificial | Python y Random Forest |
| API de IA               | FastAPI                |
| Aprendizaje automático  | Scikit-learn y pandas  |
| Replicación             | SQL Server Replication |
| Control de versiones    | Git y GitHub           |

## 6. Tipo de arquitectura implementada

El sistema combina los siguientes enfoques arquitectónicos:

- Arquitectura de tres capas: separa la presentación, la lógica de negocio y los datos.
- Arquitectura cliente-servidor: permite la comunicación entre el frontend y el backend.
- Arquitectura modular: organiza las funcionalidades en diferentes módulos.
- Arquitectura de base de datos distribuida: utiliza dos equipos conectados mediante replicación transaccional de SQL Server.

## 7. Conclusión

La arquitectura del Sistema de Evaluación Inteligente de Proveedores permite integrar tecnologías de desarrollo web, administración de bases de datos e Inteligencia Artificial. La separación de sus componentes facilita el mantenimiento y la comunicación entre los módulos. Además, la implementación de la replicación de SQL Server permite mantener una copia de la información en un segundo equipo, aplicando conceptos de sistemas distribuidos y demostrando el intercambio de información entre servidores.