
# Reporte de Pruebas QA

## 1. Información general

| Campo | Información |
|---|---|
| Proyecto | Sistema de Evaluación Inteligente de Proveedores |
| Tipo de pruebas | Pruebas manuales de integración, validación y compilación |
| Fecha de ejecución | 3 de noviembre de 2026 |
| Backend | Java 21, Spring Boot |
| Frontend | React.js, Vite |
| Base de datos | SQL Server |
| Servicio de IA | Python, FastAPI |

## 2. Objetivo

Documentar las pruebas realizadas para verificar la compilación del sistema, la validación de datos recibidos por el backend y el cálculo de la calificación y clasificación de las evaluaciones en el servidor.

## 3. Alcance

Se documentan las pruebas manuales realizadas sobre:

- Compilación del backend.
- Compilación de producción del frontend.
- Validación de los indicadores de una evaluación.
- Validación de la existencia del proveedor.
- Respuestas del backend cuando una evaluación no existe.
- Cálculo de calificación y clasificación en el servidor.
- Registro de una evaluación desde la interfaz.

Este documento refleja las pruebas ejecutadas y observadas durante el desarrollo. No representa una certificación integral del sistema.

## 4. Casos de prueba

### CP-01. Compilación del backend

| Campo | Resultado |
|---|---|
| Objetivo | Comprobar que el backend compile después de incorporar las validaciones y el servicio de evaluación. |
| Procedimiento | Ejecutar `.\mvnw.cmd clean compile` desde la carpeta `backend`. |
| Resultado esperado | El proyecto compila sin errores. |
| Resultado obtenido | La compilación terminó correctamente (`BUILD SUCCESS`). |
| Estado | **Aprobado** |

### CP-02. Validación de indicadores fuera de rango

| Campo | Resultado |
|---|---|
| Objetivo | Comprobar que el backend rechace valores inválidos en los indicadores. |
| Procedimiento | Enviar una solicitud de creación con un indicador fuera del rango permitido de 0 a 100. |
| Resultado esperado | El backend rechaza la solicitud con HTTP 400. |
| Resultado obtenido | Se recibió HTTP 400. |
| Estado | **Aprobado** |

### CP-03. Validación de proveedor inexistente

| Campo | Resultado |
|---|---|
| Objetivo | Evitar registrar evaluaciones asociadas a proveedores inexistentes. |
| Procedimiento | Enviar una solicitud de creación con un `idProveedor` inexistente (por ejemplo, 999999). |
| Resultado esperado | El backend responde HTTP 400 e informa que el proveedor indicado no existe. |
| Resultado obtenido | Se recibió HTTP 400 con el mensaje `El proveedor indicado no existe.` |
| Estado | **Aprobado** |

### CP-04. Actualización de evaluación inexistente

| Campo | Resultado |
|---|---|
| Objetivo | Comprobar que el endpoint PUT no actualice ni cree una evaluación inexistente. |
| Procedimiento | Enviar una solicitud PUT con un identificador de evaluación inexistente. |
| Resultado esperado | El backend responde HTTP 404. |
| Resultado obtenido | Se observó HTTP 404. |
| Estado | **Aprobado** |

### CP-05. Eliminación de evaluación inexistente

| Campo | Resultado |
|---|---|
| Objetivo | Comprobar que el endpoint DELETE informe cuando la evaluación no existe. |
| Procedimiento | Enviar una solicitud DELETE con un identificador de evaluación inexistente. |
| Resultado esperado | El backend responde HTTP 404. |
| Resultado obtenido | Se observó HTTP 404. |
| Estado | **Aprobado** |

### CP-06. Cálculo de calificación y clasificación en el servidor

| Campo | Resultado |
|---|---|
| Objetivo | Verificar que el backend calcule la calificación y clasificación sin confiar en los valores enviados por el navegador. |
| Procedimiento | Enviar los cinco indicadores con valor 100 y, deliberadamente, enviar `calificacionFinal: 1` y `clasificacion: "Riesgo"`. |
| Resultado esperado | El servidor ignora esos valores y calcula 100.00 con clasificación `Excelente`. |
| Resultado obtenido | La respuesta HTTP 200 devolvió `calificacionFinal: 100.0` y `clasificacion: "Excelente"`. |
| Estado | **Aprobado** |

### CP-07. Compilación de producción del frontend

| Campo | Resultado |
|---|---|
| Objetivo | Comprobar que el frontend genere la versión de producción. |
| Procedimiento | Ejecutar `npm.cmd run build` desde la carpeta `frontend`. |
| Resultado esperado | Vite genera los archivos de producción sin errores. |
| Resultado obtenido | La compilación terminó correctamente (`built in 5.63s`). Vite mostró una advertencia porque un archivo JavaScript supera los 500 kB, pero no impidió la compilación. |
| Estado | **Aprobado con observación** |

**Observación:** se recomienda revisar posteriormente la división de código (*code splitting*) para reducir el tamaño del paquete JavaScript principal.

### CP-08. Registro de evaluación desde la interfaz

| Campo | Resultado |
|---|---|
| Objetivo | Verificar el registro de una evaluación y la visualización del resultado calculado por el servidor. |
| Procedimiento | Iniciar sesión, abrir Nueva Evaluación, seleccionar un proveedor, asignar 100 a los cinco indicadores y guardar. |
| Resultado esperado | La evaluación se guarda y la interfaz muestra 100.00 y `Excelente`. |
| Resultado obtenido | Se confirmó que la operación funcionó correctamente y que la interfaz mostró el resultado esperado. |
| Estado | **Aprobado** |

## 5. Resumen de resultados

| Indicador | Cantidad |
|---|---:|
| Casos ejecutados | 8 |
| Casos aprobados | 7 |
| Casos aprobados con observación | 1 |
| Casos fallidos | 0 |

## 6. Observaciones y actividades pendientes

Las siguientes actividades no se consideran verificadas por las pruebas documentadas:

1. Revisar y centralizar la configuración CORS para evitar configuraciones repetidas entre controladores y `SecurityConfig.java`.
2. Incorporar pruebas automatizadas para el backend, incluyendo pruebas unitarias de `EvaluacionService` y pruebas de integración de `EvaluacionController`.
3. Incorporar pruebas automatizadas para los flujos principales del frontend.
4. Revisar la advertencia de tamaño del paquete JavaScript.
5. Ampliar las pruebas con valores límite (0 y 100), valores decimales y combinaciones que produzcan cada clasificación.

## 7. Conclusión

Las pruebas manuales documentadas muestran que el backend compila, valida los datos de las evaluaciones, comprueba la existencia del proveedor y responde correctamente cuando se intenta actualizar o eliminar una evaluación inexistente. También se comprobó que la calificación y clasificación se calculan en el servidor y que los valores manipulados enviados desde el navegador no sustituyen el resultado calculado.

El frontend generó correctamente su compilación de producción y se verificó el registro de una evaluación desde la interfaz. La advertencia de tamaño del paquete no bloqueó la compilación.

Los resultados de los casos ejecutados son satisfactorios. Sin embargo, aún se requieren pruebas automatizadas y la revisión de CORS para ampliar la cobertura y robustecer la calidad del software.
