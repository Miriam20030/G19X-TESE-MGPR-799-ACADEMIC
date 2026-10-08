CREATE DATABASE EvaluacionProveedores;
GO

USE EvaluacionProveedores;
GO


CREATE TABLE Proveedores (
    IdProveedor INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    Contacto NVARCHAR(150) NOT NULL,
    Correo NVARCHAR(150) NOT NULL,
    Telefono NVARCHAR(20) NOT NULL,
    RFC NVARCHAR(13) NOT NULL,
    Estado NVARCHAR(20) NOT NULL
);
GO

SELECT * FROM Proveedores;



USE EvaluacionProveedores;
GO

INSERT INTO Proveedores
    (Nombre, Contacto, Correo, Telefono, RFC, Estado)
VALUES
    ('Proveedor Prueba', 'María López', 'prueba@gmail.com', '5512345678', 'PRO123456ABC', 'Activo');
GO


ALTER TABLE Proveedores
ALTER COLUMN RFC VARCHAR(13);

USE EvaluacionProveedores;

EXEC sp_help 'Proveedores';



CREATE TABLE Evaluaciones (
    idEvaluacion INT IDENTITY(1,1) PRIMARY KEY,
    idProveedor INT NOT NULL,

    cumplimientoEntregas DECIMAL(5,2) NOT NULL,
    calidad DECIMAL(5,2) NOT NULL,
    costos DECIMAL(5,2) NOT NULL,
    tiempoRespuesta DECIMAL(5,2) NOT NULL,
    incidencias DECIMAL(5,2) NOT NULL,

    calificacionFinal DECIMAL(5,2),
    clasificacion VARCHAR(30),
    fechaEvaluacion DATETIME DEFAULT GETDATE(),
   

    CONSTRAINT FK_Evaluaciones_Proveedores
    FOREIGN KEY (idProveedor)
    REFERENCES Proveedores(idProveedor)
);

ALTER TABLE Evaluaciones
ADD recomendacion NVARCHAR(1000) NULL;
GO


SELECT * FROM Evaluaciones;


SELECT * FROM Proveedores;

INSERT INTO Evaluaciones (
    idProveedor,
    cumplimientoEntregas,
    calidad,
    costos,
    tiempoRespuesta,
    incidencias,
    calificacionFinal,
    clasificacion
)
VALUES (
    13,
    90,
    85,
    80,
    95,
    90,
    87.50,
    'Bueno'
);



USE EvaluacionProveedores;
GO

SELECT IdProveedor, Nombre
FROM Proveedores;


USE EvaluacionProveedores;
GO

SELECT IdProveedor, Nombre, Contacto, Correo
FROM Proveedores;




SELECT TOP 1 *
FROM Evaluaciones
ORDER BY idEvaluacion DESC;



ALTER TABLE Proveedores
ADD fotoUrl NVARCHAR(500) NULL;



USE EvaluacionProveedores;
GO

SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Proveedores';


USE EvaluacionProveedores;
GO

SELECT IdProveedor, Nombre, fotoUrl
FROM Proveedores;




CREATE TABLE Usuarios (
    IdUsuario INT IDENTITY(1,1) PRIMARY KEY,
    Usuario NVARCHAR(100) NOT NULL UNIQUE,
    Correo NVARCHAR(150) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Nombre NVARCHAR(150) NOT NULL,
    Activo BIT NOT NULL DEFAULT 1
);
GO

SELECT * FROM Usuarios;



INSERT INTO Usuarios
    (Usuario, Correo, Password, Nombre, Activo)
VALUES
    (
        'admin',
        'admin@evaluacion.com',
        '$2a$10$RZ7rLzdFgKvSAYV43A1TOukbKpVcNeYWfcRUOT.eezU9ukjT0Sv/y',
        'Administrador',
        1
    );
GO

SELECT
    IdUsuario,
    Usuario,
    Correo,
    Nombre,
    Activo
FROM Usuarios;


SELECT 
    TABLE_SCHEMA,
    TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'Usuarios';



SELECT DB_NAME() AS BaseActual;

SELECT 
    OBJECT_ID('dbo.Usuarios') AS IdTabla,
    COUNT(*) AS CantidadUsuarios
FROM dbo.Usuarios;


USE EvaluacionProveedores;
GO

SELECT DB_NAME() AS BaseActual;

SELECT 
    OBJECT_SCHEMA_NAME(OBJECT_ID('dbo.Usuarios')) AS Esquema,
    OBJECT_NAME(OBJECT_ID('dbo.Usuarios')) AS Tabla;

SELECT 
    IdUsuario,
    Usuario,
    Correo,
    Nombre,
    Activo
FROM dbo.Usuarios;


SELECT 
    DB_NAME() AS BaseActual,
    DB_ID() AS IdBase;
GO

SELECT name
FROM sys.databases
ORDER BY name;


DECLARE @sql NVARCHAR(MAX) = N'';

SELECT @sql += '
USE [' + name + '];

IF EXISTS (
    SELECT 1
    FROM sys.tables
    WHERE name = ''Usuarios''
)
BEGIN
    SELECT
        DB_NAME() AS BaseDatos,
        SCHEMA_NAME(schema_id) AS Esquema,
        name AS Tabla
    FROM sys.tables
    WHERE name = ''Usuarios'';
END;
'
FROM sys.databases
WHERE state_desc = 'ONLINE';

EXEC sp_executesql @sql;


USE EvaluacionProveedores;
GO

CREATE TABLE dbo.Usuarios (
    IdUsuario INT IDENTITY(1,1) PRIMARY KEY,
    Usuario NVARCHAR(100) NOT NULL UNIQUE,
    Correo NVARCHAR(150) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Nombre NVARCHAR(150) NOT NULL,
    Activo BIT NOT NULL DEFAULT 1
);
GO


SELECT 
    IdUsuario,
    Usuario,
    Correo,
    Nombre,
    Activo
FROM dbo.Usuarios;


USE EvaluacionProveedores;
GO

INSERT INTO dbo.Usuarios
    (Usuario, Correo, Password, Nombre, Activo)
VALUES
    (
        'admin',
        'admin@evaluacion.com',
        '$2a$10$RZ7rLzdFgKvSAYV43A1TOukbKpVcNeYWfcRUOT.eezU9ukjT0Sv/y',
        'Administrador',
        1
    );
GO



SELECT
    IdUsuario,
    Usuario,
    Correo,
    Nombre,
    Activo
FROM dbo.Usuarios;


USE EvaluacionProveedores;
GO

SELECT 
    DB_NAME() AS BaseDatos,
    SUSER_SNAME() AS UsuarioSQL;

SELECT 
    OBJECT_ID('dbo.Usuarios') AS IdUsuarios;

SELECT COUNT(*) AS Cantidad
FROM dbo.Usuarios;


SELECT
    @@SERVERNAME AS Servidor,
    DB_NAME() AS BaseActual,
    SUSER_SNAME() AS UsuarioSQL;

USE EvaluacionProveedores;
GO

SELECT
    DB_NAME() AS BaseActual,
    OBJECT_ID('dbo.Usuarios') AS IdTabla;

SELECT COUNT(*) AS CantidadUsuarios
FROM dbo.Usuarios;



SELECT COUNT(*) AS TotalEvaluaciones
FROM Evaluaciones;



USE EvaluacionProveedores;
GO

ALTER TABLE Evaluaciones
ADD riesgoIA VARCHAR(20) NULL;

ALTER TABLE Evaluaciones
ADD probabilidadRiesgoAlto DECIMAL(5,2) NULL;
GO


SELECT 
    idEvaluacion,
    riesgoIA,
    probabilidadRiesgoAlto
FROM Evaluaciones;


USE EvaluacionProveedores;
GO

SELECT TOP 1
    idEvaluacion,
    idProveedor,
    cumplimientoEntregas,
    calidad,
    costos,
    tiempoRespuesta,
    incidencias,
    calificacionFinal,
    clasificacion,
    recomendacion,
    riesgoIA,
    probabilidadRiesgoAlto,
    fechaEvaluacion
FROM Evaluaciones
ORDER BY idEvaluacion DESC;




SELECT
    local_net_address,
    local_tcp_port
FROM sys.dm_exec_connections
WHERE session_id = @@SPID;