# Documento de Requerimientos
## Sistema de Evaluación Inteligente de Proveedores

**Nombre del proyecto:** Sistema de Evaluación Inteligente de Proveedores  
**Tipo de documento:** Especificación de requerimientos de software  
**Versión:** 1.0  
**Fecha:** 3 de noviembre de 2026

---

## 1. Introducción

El presente documento establece los requerimientos funcionales y no funcionales del Sistema de Evaluación Inteligente de Proveedores, cuyo propósito es facilitar el registro, evaluación, seguimiento y análisis del desempeño de los proveedores mediante herramientas tecnológicas y técnicas de inteligencia artificial.

El sistema permitirá administrar información de proveedores, registrar evaluaciones, calcular calificaciones, identificar posibles riesgos y generar reportes que faciliten la toma de decisiones.

## 2. Objetivo general

Desarrollar un sistema inteligente que permita evaluar el desempeño de los proveedores mediante indicadores relacionados con el cumplimiento de entregas, calidad, costos, tiempo de respuesta e incidencias, con el propósito de identificar áreas de oportunidad, detectar riesgos y mejorar la gestión de proveedores.

## 3. Alcance del sistema

El sistema contempla las siguientes funcionalidades:

- Inicio y cierre de sesión de usuarios.
- Registro, consulta, edición y eliminación de proveedores.
- Registro y consulta de evaluaciones.
- Cálculo automático de calificaciones y clasificación de proveedores.
- Análisis de indicadores mediante un servicio de inteligencia artificial.
- Identificación de proveedores con posibles riesgos.
- Generación de alertas y recomendaciones.
- Consulta de reportes y estadísticas.
- Configuración de preferencias del sistema.

El sistema está diseñado para ejecutarse en una computadora y utilizar una base de datos SQL Server para almacenar la información.

## 4. Usuarios del sistema

### 4.1 Administrador

Es el usuario encargado de acceder al sistema y realizar las operaciones de administración y seguimiento.

Sus actividades principales son:

- Iniciar y cerrar sesión.
- Registrar nuevos proveedores.
- Consultar y modificar información de proveedores.
- Eliminar proveedores.
- Registrar evaluaciones.
- Consultar resultados y clasificaciones.
- Revisar alertas y recomendaciones.
- Consultar reportes.
- Modificar las configuraciones disponibles.

## 5. Requerimientos funcionales

Los requerimientos funcionales describen las operaciones que el sistema debe realizar para cumplir con sus objetivos.

| ID | Requerimiento | Descripción |
|---|---|---|
| RF-01 | Inicio de sesión | El sistema debe permitir el acceso mediante un usuario y contraseña registrados. |
| RF-02 | Cierre de sesión | El sistema debe permitir cerrar la sesión del usuario. |
| RF-03 | Registro de proveedores | El sistema debe permitir registrar proveedores con sus datos correspondientes. |
| RF-04 | Consulta de proveedores | El sistema debe mostrar el listado de proveedores registrados. |
| RF-05 | Edición de proveedores | El sistema debe permitir modificar la información de un proveedor existente. |
| RF-06 | Eliminación de proveedores | El sistema debe permitir eliminar proveedores registrados, considerando las relaciones con sus evaluaciones. |
| RF-07 | Registro de evaluaciones | El sistema debe permitir registrar evaluaciones asociadas a un proveedor existente. |
| RF-08 | Validación de indicadores | El sistema debe validar que los indicadores de evaluación tengan valores dentro del rango permitido de 0 a 100. |
| RF-09 | Cálculo de calificación | El sistema debe calcular automáticamente la calificación final de cada evaluación en el servidor. |
| RF-10 | Clasificación de proveedores | El sistema debe asignar una clasificación de acuerdo con la calificación obtenida. |
| RF-11 | Análisis mediante IA | El sistema debe enviar los indicadores al servicio de inteligencia artificial para analizar el desempeño del proveedor. |
| RF-12 | Identificación de riesgos | El sistema debe identificar posibles riesgos relacionados con el desempeño de los proveedores. |
| RF-13 | Recomendaciones | El sistema debe proporcionar recomendaciones de acuerdo con los resultados del análisis. |
| RF-14 | Consulta de evaluaciones | El sistema debe permitir consultar las evaluaciones registradas. |
| RF-15 | Edición de evaluaciones | El sistema debe permitir modificar evaluaciones existentes. |
| RF-16 | Eliminación de evaluaciones | El sistema debe permitir eliminar evaluaciones existentes. |
| RF-17 | Generación de alertas | El sistema debe mostrar alertas relacionadas con proveedores que presenten situaciones de riesgo. |
| RF-18 | Reportes | El sistema debe presentar información estadística sobre el desempeño de los proveedores. |
| RF-19 | Configuración | El sistema debe permitir modificar las preferencias disponibles, como el modo de visualización. |
| RF-20 | Panel principal | El sistema debe mostrar indicadores generales, como el total de proveedores, proveedores activos, proveedores en riesgo y promedio de calificaciones. |

## 6. Requerimientos no funcionales

Los requerimientos no funcionales establecen las características de calidad, seguridad y funcionamiento que debe cumplir el sistema.

| ID | Requerimiento | Descripción |
|---|---|---|
| RNF-01 | Seguridad | El sistema debe restringir el acceso a las funcionalidades mediante autenticación de usuarios. |
| RNF-02 | Validación de datos | El sistema debe validar la información recibida para evitar registros incorrectos. |
| RNF-03 | Integridad | El sistema debe mantener la relación entre proveedores y sus evaluaciones. |
| RNF-04 | Rendimiento | El sistema debe responder en tiempos adecuados durante las operaciones habituales. |
| RNF-05 | Usabilidad | La interfaz debe ser clara, organizada y fácil de utilizar. |
| RNF-06 | Mantenibilidad | El código debe estar organizado por módulos para facilitar su modificación y mantenimiento. |
| RNF-07 | Compatibilidad | El sistema debe funcionar en un entorno de escritorio compatible con las tecnologías utilizadas. |
| RNF-08 | Disponibilidad | Los servicios del sistema deben estar disponibles mientras se encuentren ejecutándose correctamente. |
| RNF-09 | Protección de sesión | El sistema debe manejar las sesiones de usuario y controlar el acceso cuando estas hayan expirado. |
| RNF-10 | Persistencia | La información registrada debe almacenarse en una base de datos SQL Server. |
| RNF-11 | Escalabilidad | La arquitectura debe permitir incorporar nuevas funcionalidades y ampliar los módulos existentes. |
| RNF-12 | Interoperabilidad | El frontend, backend y servicio de inteligencia artificial deben comunicarse mediante interfaces de programación (API). |

## 7. Reglas de negocio

El sistema debe aplicar las siguientes reglas para realizar las evaluaciones de los proveedores.

### 7.1 Indicadores de evaluación

Cada proveedor será evaluado mediante cinco indicadores:

| Indicador | Ponderación |
|---|---:|
| Cumplimiento de entregas | 25 % |
| Calidad | 25 % |
| Costos | 20 % |
| Tiempo de respuesta | 15 % |
| Incidencias | 15 % |
| **Total** | **100 %** |

Cada indicador debe tener un valor entre 0 y 100.

### 7.2 Cálculo de calificación final

La calificación final se obtiene mediante una suma ponderada de los cinco indicadores.

La fórmula utilizada es:

**Calificación final =**

(Cumplimiento de entregas × 0.25) +  
(Calidad × 0.25) +  
(Costos × 0.20) +  
(Tiempo de respuesta × 0.15) +  
(Incidencias × 0.15)

El resultado se redondea a dos decimales.

El cálculo debe realizarse en el backend para evitar que los valores enviados desde el frontend puedan modificar directamente la calificación final.

### 7.3 Clasificación de proveedores

La clasificación se determina de acuerdo con la calificación final obtenida.

| Calificación | Clasificación |
|---|---|
| 90 a 100 | Excelente |
| 80 a 89.99 | Bueno |
| 70 a 79.99 | Regular |
| Menor a 70 | Riesgo |

### 7.4 Análisis de inteligencia artificial

El servicio de inteligencia artificial recibe los indicadores de evaluación y realiza un análisis para identificar posibles riesgos y generar recomendaciones que apoyen la toma de decisiones.

La clasificación obtenida mediante la fórmula de evaluación se calcula en el backend y es independiente del análisis complementario realizado por el servicio de inteligencia artificial.

## 8. Requerimientos de información

El sistema debe administrar la siguiente información:

### 8.1 Información de proveedores

- Identificador del proveedor.
- Nombre o razón social.
- Nombre de contacto.
- Correo electrónico.
- Número telefónico.
- RFC.
- Estado del proveedor.
- Fotografía o imagen del proveedor.

### 8.2 Información de evaluaciones

- Identificador de la evaluación.
- Identificador del proveedor relacionado.
- Fecha de evaluación.
- Cumplimiento de entregas.
- Calidad.
- Costos.
- Tiempo de respuesta.
- Incidencias.
- Calificación final.
- Clasificación.
- Recomendación.
- Resultado del análisis de riesgo mediante IA.
- Probabilidad de riesgo alto, cuando esté disponible.

### 8.3 Información de usuarios

- Identificador del usuario.
- Nombre de usuario.
- Contraseña almacenada de forma segura.

## 9. Requerimientos tecnológicos

Para el desarrollo e implementación del sistema se utilizan las siguientes tecnologías:

| Tecnología | Función |
|---|---|
| Java 21 | Lenguaje principal del backend. |
| Spring Boot | Desarrollo de servicios y API del backend. |
| Python | Desarrollo del módulo de inteligencia artificial. |
| FastAPI | Exposición de los servicios de IA mediante API. |
| React.js | Desarrollo de la interfaz de usuario. |
| Vite | Herramienta de desarrollo y compilación del frontend. |
| SQL Server | Administración y almacenamiento de la base de datos. |
| Power BI | Herramienta de análisis y visualización de información, cuando corresponda. |
| Docker | Herramienta de contenedorización para facilitar el despliegue. |
| Git y GitHub | Control de versiones y administración del código fuente. |

## 10. Restricciones del sistema

- El sistema requiere una computadora que cuente con el entorno necesario para ejecutar sus servicios.
- El backend depende de Java y Spring Boot.
- El frontend requiere Node.js para su instalación, desarrollo y compilación.
- El módulo de inteligencia artificial requiere Python y FastAPI.
- La base de datos debe contar con una instancia de SQL Server configurada.
- La comunicación entre los módulos depende de las direcciones y puertos configurados para cada servicio.
- Las funcionalidades de inteligencia artificial requieren que el servicio correspondiente se encuentre disponible.

## 11. Criterios de aceptación

Se considerará que el sistema cumple con sus requerimientos principales cuando:

1. Permita iniciar y cerrar sesión correctamente.
2. Permita registrar, consultar, editar y eliminar proveedores.
3. Permita registrar evaluaciones relacionadas con proveedores existentes.
4. Rechace valores inválidos en los indicadores de evaluación.
5. Calcule la calificación final y clasificación en el backend.
6. Identifique correctamente la clasificación de acuerdo con los rangos establecidos.
7. Permita consultar los resultados de las evaluaciones.
8. Permita utilizar el módulo de inteligencia artificial para analizar los indicadores.
9. Muestre alertas y recomendaciones cuando corresponda.
10. Presente información general y reportes del desempeño de los proveedores.
11. Mantenga la información almacenada en la base de datos.

## 12. Conclusión

El presente documento establece los requerimientos necesarios para el desarrollo del Sistema de Evaluación Inteligente de Proveedores. Estos requerimientos sirven como referencia para orientar el diseño, desarrollo, implementación y pruebas del sistema.

Mediante la integración de tecnologías como Java, Spring Boot, React.js, Python, FastAPI y SQL Server, se busca proporcionar una herramienta que facilite la administración y evaluación de proveedores, automatice el cálculo de calificaciones y apoye la identificación de riesgos mediante inteligencia artificial.

El cumplimiento de estos requerimientos permitirá contar con un sistema organizado, funcional y adaptable a las necesidades de evaluación y seguimiento de proveedores.