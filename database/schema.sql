
/* =========================================================
   BASE DE DATOS: EvaluacionProveedores
   ========================================================= */

IF DB_ID(N'EvaluacionProveedores') IS NULL
BEGIN
    CREATE DATABASE EvaluacionProveedores;
END;
GO

USE EvaluacionProveedores;
GO

/* =========================================================
   1. TABLA: Proveedores
   ========================================================= */

IF OBJECT_ID(N'dbo.Proveedores', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Proveedores
    (
        IdProveedor INT IDENTITY(1,1) PRIMARY KEY,
        Nombre NVARCHAR(150) NOT NULL,
        Contacto NVARCHAR(150) NOT NULL,
        Correo NVARCHAR(150) NOT NULL,
        Telefono NVARCHAR(20) NOT NULL,
        RFC VARCHAR(13) NOT NULL,
        Estado NVARCHAR(20) NOT NULL,
        fotoUrl NVARCHAR(500) NULL
    );
END;
GO

/* =========================================================
   2. TABLA: Usuarios
   ========================================================= */

IF OBJECT_ID(N'dbo.Usuarios', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Usuarios
    (
        IdUsuario INT IDENTITY(1,1) PRIMARY KEY,
        Usuario NVARCHAR(100) NOT NULL UNIQUE,
        Correo NVARCHAR(150) NOT NULL UNIQUE,
        Password NVARCHAR(255) NOT NULL,
        Nombre NVARCHAR(150) NOT NULL,
        Activo BIT NOT NULL DEFAULT 1
    );
END;
GO

/* =========================================================
   3. TABLA: Evaluaciones
   ========================================================= */

IF OBJECT_ID(N'dbo.Evaluaciones', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Evaluaciones
    (
        idEvaluacion INT IDENTITY(1,1) PRIMARY KEY,
        idProveedor INT NOT NULL,
        cumplimientoEntregas DECIMAL(5,2) NOT NULL,
        calidad DECIMAL(5,2) NOT NULL,
        costos DECIMAL(5,2) NOT NULL,
        tiempoRespuesta DECIMAL(5,2) NOT NULL,
        incidencias DECIMAL(5,2) NOT NULL,
        calificacionFinal DECIMAL(5,2) NULL,
        clasificacion VARCHAR(30) NULL,
        fechaEvaluacion DATETIME NOT NULL DEFAULT GETDATE(),
        recomendacion NVARCHAR(1000) NULL,
        riesgoIA VARCHAR(20) NULL,
        probabilidadRiesgoAlto DECIMAL(5,2) NULL,

        CONSTRAINT FK_Evaluaciones_Proveedores
            FOREIGN KEY (idProveedor)
            REFERENCES dbo.Proveedores(IdProveedor)
    );
END;
GO

/* =========================================================
   4. DATOS SEMILLA: Administrador
   ========================================================= */

IF NOT EXISTS
(
    SELECT 1
    FROM dbo.Usuarios
    WHERE Usuario = N'admin'
       OR Correo = N'admin@evaluacion.com'
)
BEGIN
    INSERT INTO dbo.Usuarios
    (
        Usuario,
        Correo,
        Password,
        Nombre,
        Activo
    )
    VALUES
    (
        N'admin',
        N'admin@evaluacion.com',
        '$2a$10$RZ7rLzdFgKvSAYV43A1TOukbKpVcNeYWfcRUOT.eezU9ukjT0Sv/y',
        N'Administrador',
        1
    );
END;
GO
