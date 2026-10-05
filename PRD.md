# PRD — Product Requirements Document

## 1. Información general

### Nombre del producto

**Sistema de Evaluación Inteligente de Proveedores**

### Tipo de producto

Aplicación web para la gestión, evaluación y análisis inteligente del desempeño de proveedores.

### Propósito

El sistema tiene como propósito proporcionar una herramienta centralizada que permita registrar proveedores, realizar evaluaciones periódicas de su desempeño y utilizar técnicas de análisis mediante Inteligencia Artificial para identificar niveles de riesgo y generar recomendaciones que apoyen la toma de decisiones.

### Alcance del producto

El producto contempla una aplicación web integrada por un frontend desarrollado con React, un backend desarrollado con Spring Boot, una base de datos SQL Server y un servicio independiente de Inteligencia Artificial desarrollado con Python y FastAPI.

---

## 2. Problema que se busca resolver

La evaluación de proveedores requiere considerar diferentes aspectos relacionados con el cumplimiento de entregas, calidad, costos, tiempos de respuesta e incidencias. Cuando esta información se administra de manera manual o dispersa, puede dificultarse la comparación entre proveedores, el seguimiento histórico de su desempeño y la identificación oportuna de posibles riesgos.

El sistema busca centralizar esta información y proporcionar una evaluación estructurada que facilite el análisis del desempeño de cada proveedor.

Además de la calificación tradicional, el sistema incorpora un componente de Inteligencia Artificial que permite complementar la evaluación mediante un análisis del nivel de riesgo y la generación de recomendaciones.

---

## 3. Objetivo del producto

Desarrollar una aplicación web que permita gestionar proveedores, registrar y consultar evaluaciones de desempeño y utilizar Inteligencia Artificial para analizar los resultados obtenidos, identificar riesgos y proporcionar recomendaciones para apoyar la selección y gestión estratégica de proveedores.

---

## 4. Usuarios objetivo

El sistema está dirigido principalmente a personal encargado de la gestión, seguimiento y evaluación de proveedores dentro de una organización.

### Usuario administrador

El usuario administrador puede acceder al sistema mediante autenticación y utilizar las funcionalidades disponibles para gestionar proveedores, realizar evaluaciones, consultar resultados y administrar su información de acceso.

---

## 5. Funcionalidades principales

### 5.1 Autenticación

El sistema deberá permitir que los usuarios registrados puedan iniciar sesión utilizando un nombre de usuario y una contraseña.

El sistema deberá:

* Validar que el usuario exista.
* Validar que la contraseña sea correcta.
* Verificar que el usuario se encuentre activo.
* Impedir el acceso cuando las credenciales sean incorrectas.
* Mostrar información básica del usuario después del inicio de sesión.

Las contraseñas deberán almacenarse utilizando un mecanismo de cifrado mediante BCrypt.

---

### 5.2 Cambio de contraseña

El sistema deberá permitir que el usuario autenticado cambie su contraseña.

Para realizar el cambio deberá proporcionar:

* Usuario.
* Contraseña actual.
* Nueva contraseña.

El sistema deberá verificar la contraseña actual antes de realizar el cambio y deberá exigir una longitud mínima de ocho caracteres para la nueva contraseña.

---

### 5.3 Gestión de proveedores

El sistema deberá permitir administrar la información correspondiente a los proveedores.

La información contemplada incluye:

* Nombre.
* Contacto.
* Correo electrónico.
* Teléfono.
* RFC.
* Estado.
* Fotografía o imagen del proveedor.

El sistema deberá permitir consultar los proveedores registrados y utilizar la información de un proveedor para realizar evaluaciones.

---

### 5.4 Registro de evaluaciones

El sistema deberá permitir registrar evaluaciones asociadas a un proveedor.

Cada evaluación deberá considerar los siguientes indicadores:

* Cumplimiento de entregas.
* Calidad.
* Costos.
* Tiempo de respuesta.
* Incidencias.

Los indicadores deberán manejar valores en una escala de 0 a 100.

El sistema deberá almacenar la fecha en que se realiza cada evaluación.

---

## 6. Sistema de calificación

La evaluación deberá obtener una calificación final utilizando los indicadores definidos y sus respectivos pesos.

Los pesos establecidos son:

| Indicador                | Peso |
| ------------------------ | ---: |
| Cumplimiento de entregas |  25% |
| Calidad                  |  25% |
| Costos                   |  20% |
| Tiempo de respuesta      |  15% |
| Incidencias              |  15% |

La calificación final deberá obtenerse mediante una combinación ponderada de los cinco indicadores.

### Clasificación

De acuerdo con la calificación final, el proveedor será clasificado de la siguiente manera:

| Calificación | Clasificación |
| -----------: | ------------- |
|     90 a 100 | Excelente     |
|   80 a 89.99 | Bueno         |
|   70 a 79.99 | Regular       |
|  Menor de 70 | Riesgo        |

---

## 7. Análisis mediante Inteligencia Artificial

El sistema deberá integrar un servicio independiente de Inteligencia Artificial desarrollado con Python y FastAPI.

El servicio recibirá los valores correspondientes a los indicadores de la evaluación:

* Cumplimiento de entregas.
* Calidad.
* Costos.
* Tiempo de respuesta.
* Incidencias.

A partir de estos datos, el servicio realizará un análisis y proporcionará información adicional sobre el desempeño del proveedor.

El resultado del análisis deberá incluir:

* Calificación analizada.
* Clasificación.
* Nivel de riesgo.
* Probabilidad de riesgo alto.
* Recomendación.

La integración deberá realizarse mediante una API entre el frontend, el backend y el servicio de Inteligencia Artificial.

---

## 8. Niveles de riesgo

El análisis inteligente deberá permitir identificar el nivel de riesgo asociado al desempeño del proveedor.

Los resultados contemplan niveles como:

* Bajo.
* Medio.
* Alto.

La información del riesgo deberá almacenarse junto con la evaluación para permitir su consulta posterior.

Cuando el análisis determine un nivel de riesgo elevado, el sistema deberá proporcionar información que ayude al usuario a identificar la situación y tomar una decisión.

---

## 9. Recomendaciones inteligentes

El sistema deberá generar recomendaciones relacionadas con el resultado de la evaluación.

Las recomendaciones deberán utilizar la información obtenida de los indicadores y del análisis inteligente para proporcionar orientación al usuario.

Estas recomendaciones tendrán como finalidad apoyar decisiones relacionadas con:

* Selección de proveedores.
* Seguimiento del desempeño.
* Identificación de proveedores con problemas.
* Prevención de riesgos.
* Gestión estratégica de proveedores.

---

## 10. Historial de evaluaciones

El sistema deberá almacenar las evaluaciones realizadas para permitir consultar el historial de desempeño de los proveedores.

Cada registro de evaluación deberá conservar:

* Proveedor evaluado.
* Cumplimiento de entregas.
* Calidad.
* Costos.
* Tiempo de respuesta.
* Incidencias.
* Calificación final.
* Clasificación.
* Recomendación.
* Nivel de riesgo.
* Probabilidad de riesgo alto.
* Fecha de evaluación.

El historial deberá permitir consultar las evaluaciones realizadas y dar seguimiento al comportamiento de los proveedores.

---

## 11. Persistencia de información

La información del sistema deberá almacenarse en una base de datos Microsoft SQL Server denominada:

`EvaluacionProveedores`

La base de datos contempla las siguientes entidades principales:

### Tabla Proveedores

Almacena la información general de los proveedores.

Campos principales:

* IdProveedor.
* Nombre.
* Contacto.
* Correo.
* Telefono.
* RFC.
* Estado.
* fotoUrl.

### Tabla Evaluaciones

Almacena los resultados de las evaluaciones realizadas.

Campos principales:

* idEvaluacion.
* idProveedor.
* cumplimientoEntregas.
* calidad.
* costos.
* tiempoRespuesta.
* incidencias.
* calificacionFinal.
* clasificacion.
* recomendacion.
* riesgoIA.
* probabilidadRiesgoAlto.
* fechaEvaluacion.

La tabla Evaluaciones mantiene una relación con Proveedores mediante el identificador del proveedor.

### Tabla Usuarios

Almacena la información necesaria para la autenticación.

Campos principales:

* IdUsuario.
* Usuario.
* Correo.
* Password.
* Nombre.
* Activo.

Los campos Usuario y Correo deberán ser únicos.

---

## 12. Arquitectura del producto

El sistema estará compuesto por cuatro elementos principales:

### Frontend

Desarrollado con React y Vite.

Su función será proporcionar la interfaz gráfica mediante la cual el usuario interactúa con el sistema.

### Backend

Desarrollado con Java y Spring Boot.

Será responsable de:

* Gestionar las solicitudes del frontend.
* Administrar proveedores.
* Registrar y consultar evaluaciones.
* Gestionar usuarios.
* Comunicarse con SQL Server.
* Integrar el análisis realizado por el servicio de Inteligencia Artificial.

### Servicio de Inteligencia Artificial

Desarrollado con Python y FastAPI.

Será responsable de procesar los indicadores de las evaluaciones y generar resultados relacionados con el análisis de riesgo y recomendaciones.

### Base de datos

Desarrollada en Microsoft SQL Server.

Será responsable de almacenar de manera persistente la información de usuarios, proveedores y evaluaciones.

---

## 13. Flujo principal del producto

El flujo principal de operación será el siguiente:

1. El usuario accede al sistema.
2. El usuario inicia sesión.
3. El sistema valida sus credenciales.
4. El usuario accede al sistema de evaluación.
5. El usuario consulta o selecciona un proveedor.
6. El usuario registra los valores correspondientes a los indicadores.
7. El sistema envía los datos al servicio de Inteligencia Artificial.
8. La Inteligencia Artificial analiza la información.
9. El sistema obtiene el nivel de riesgo y la recomendación.
10. Se calcula y registra la calificación final.
11. La evaluación se almacena en SQL Server.
12. El usuario puede consultar el resultado y el historial de evaluaciones.

---

## 14. Requisitos funcionales

### RF-01 — Inicio de sesión

El sistema deberá permitir iniciar sesión utilizando usuario y contraseña.

### RF-02 — Validación de usuario

El sistema deberá validar que el usuario exista y se encuentre activo.

### RF-03 — Cambio de contraseña

El sistema deberá permitir modificar la contraseña del usuario verificando previamente la contraseña actual.

### RF-04 — Gestión de proveedores

El sistema deberá permitir consultar y administrar información de proveedores.

### RF-05 — Registro de evaluación

El sistema deberá permitir registrar una evaluación asociada a un proveedor.

### RF-06 — Evaluación mediante indicadores

El sistema deberá permitir capturar los cinco indicadores definidos para evaluar al proveedor.

### RF-07 — Cálculo de calificación

El sistema deberá calcular una calificación final mediante los pesos establecidos.

### RF-08 — Clasificación

El sistema deberá asignar una clasificación de acuerdo con la calificación obtenida.

### RF-09 — Análisis inteligente

El sistema deberá enviar los indicadores al servicio de Inteligencia Artificial.

### RF-10 — Identificación de riesgo

El sistema deberá mostrar y almacenar el nivel de riesgo obtenido mediante el análisis inteligente.

### RF-11 — Probabilidad de riesgo

El sistema deberá almacenar la probabilidad de riesgo alto generada por el análisis.

### RF-12 — Recomendación

El sistema deberá mostrar y almacenar una recomendación relacionada con el resultado de la evaluación.

### RF-13 — Historial

El sistema deberá permitir consultar evaluaciones realizadas anteriormente.

### RF-14 — Fecha de evaluación

Cada evaluación deberá conservar la fecha y hora en que fue registrada.

---

## 15. Requisitos no funcionales

### RNF-01 — Usabilidad

La interfaz deberá ser clara y permitir que un usuario pueda realizar las operaciones principales sin conocimientos técnicos especializados.

### RNF-02 — Seguridad

Las contraseñas deberán almacenarse utilizando BCrypt y no deberán conservarse en texto plano.

### RNF-03 — Integridad de datos

Las evaluaciones deberán estar relacionadas con proveedores existentes mediante una clave foránea.

### RNF-04 — Disponibilidad

Los componentes del sistema deberán poder ejecutarse de manera independiente y comunicarse mediante APIs.

### RNF-05 — Compatibilidad

La aplicación web deberá poder utilizarse desde navegadores web modernos.

### RNF-06 — Mantenibilidad

El sistema deberá mantener separadas las responsabilidades del frontend, backend, servicio de Inteligencia Artificial y base de datos.

### RNF-07 — Persistencia

La información registrada deberá conservarse en SQL Server para permitir su consulta posterior.

---

## 16. API y comunicación entre componentes

La comunicación entre el frontend y el backend se realizará mediante servicios HTTP.

El backend expondrá endpoints relacionados con:

* Autenticación.
* Proveedores.
* Evaluaciones.

El servicio de Inteligencia Artificial expondrá un endpoint para realizar el análisis inteligente de una evaluación.

La arquitectura permitirá que cada componente tenga una responsabilidad específica y pueda comunicarse con los demás mediante solicitudes HTTP.

---

## 17. Tecnologías

| Componente                         | Tecnología           |
| ---------------------------------- | -------------------- |
| Frontend                           | React                |
| Herramienta de desarrollo frontend | Vite                 |
| Backend                            | Java                 |
| Framework backend                  | Spring Boot          |
| Persistencia                       | Spring Data JPA      |
| Base de datos                      | Microsoft SQL Server |
| Inteligencia Artificial            | Python               |
| API de IA                          | FastAPI              |
| Procesamiento de datos             | Pandas               |
| Machine Learning                   | Scikit-learn         |
| Modelo                             | Joblib               |
| Control de versiones               | Git / GitHub         |

---

## 18. Requisitos técnicos

Para ejecutar el sistema se requiere contar con:

* Java 21.
* Node.js y npm.
* Python.
* Microsoft SQL Server.
* Git.

Además, deberán instalarse las dependencias correspondientes de cada componente.

### Frontend

El frontend deberá contar con las dependencias definidas en `package.json`.

### Backend

El backend deberá ejecutarse mediante Maven y utilizar la configuración definida en `application.properties`.

### Inteligencia Artificial

El servicio deberá ejecutarse mediante un entorno virtual de Python.

El comando principal de ejecución será:

```text
venv\Scripts\activate
uvicorn main:app --reload
```

---

## 19. Seguridad

El sistema deberá proteger las credenciales de los usuarios mediante contraseñas cifradas.

La autenticación deberá verificar:

1. Existencia del usuario.
2. Estado activo del usuario.
3. Coincidencia de la contraseña.

El sistema no deberá almacenar contraseñas en texto plano.

La comunicación entre frontend y backend deberá estar restringida mediante las configuraciones CORS correspondientes.

---

## 20. Manejo de errores

El sistema deberá proporcionar mensajes que permitan identificar problemas durante las operaciones principales.

Entre los casos contemplados se encuentran:

* Usuario o contraseña incorrectos.
* Usuario desactivado.
* Campos obligatorios vacíos.
* Usuario inexistente.
* Contraseña actual incorrecta.
* Nueva contraseña con longitud insuficiente.
* Proveedor inexistente.
* Errores de comunicación con el backend.
* Errores de comunicación con el servicio de Inteligencia Artificial.

---

## 21. Criterios de aceptación

El producto se considerará funcional cuando se cumplan las siguientes condiciones:

* El usuario puede iniciar sesión correctamente.
* Las credenciales incorrectas son rechazadas.
* El usuario puede cambiar su contraseña.
* Los proveedores pueden ser consultados y administrados.
* Se puede registrar una evaluación para un proveedor.
* Los cinco indicadores pueden ser registrados.
* Se calcula correctamente la calificación final.
* Se asigna correctamente la clasificación.
* La evaluación puede ser analizada mediante Inteligencia Artificial.
* El sistema obtiene un nivel de riesgo.
* El sistema obtiene una probabilidad de riesgo alto.
* Se genera una recomendación.
* La evaluación se almacena en SQL Server.
* Las evaluaciones pueden consultarse posteriormente.
* El sistema conserva la fecha de cada evaluación.
* Los componentes frontend, backend, IA y base de datos pueden comunicarse correctamente.

---

## 22. Restricciones

El producto depende de la disponibilidad de:

* Microsoft SQL Server.
* Backend Spring Boot.
* Servicio de Inteligencia Artificial.
* Frontend React.
* Configuración de red local para la comunicación entre los servicios.

El funcionamiento del análisis inteligente depende de que el servicio FastAPI se encuentre disponible.

---

## 23. Alcance futuro

Después de la versión inicial, el producto podría ampliarse con funcionalidades como:

* Modelos de Inteligencia Artificial más avanzados.
* Predicción histórica del comportamiento de proveedores.
* Notificaciones automáticas.
* Alertas por correo electrónico.
* Generación de reportes en PDF.
* Exportación de información.
* Paneles estadísticos avanzados.
* Roles y permisos adicionales.
* Integración con sistemas empresariales.
* Despliegue en infraestructura empresarial o nube.
* Automatización de procesos de evaluación.


