import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import { autoTable } from 'jspdf-autotable'


function Reportes() {

    const [proveedores, setProveedores] = useState([])
    const [evaluaciones, setEvaluaciones] = useState([])


    // =========================================
    // OBTENER DATOS
    // =========================================

    useEffect(() => {
        obtenerDatos()
    }, [])


    const obtenerDatos = async () => {

        try {

            const respuestaProveedores = await fetch(
                'http://localhost:8080/api/proveedores'
            )

            const respuestaEvaluaciones = await fetch(
                'http://localhost:8080/api/evaluaciones'
            )


            if (
                !respuestaProveedores.ok ||
                !respuestaEvaluaciones.ok
            ) {
                throw new Error('Error al obtener los datos')
            }


            const datosProveedores =
                await respuestaProveedores.json()

            const datosEvaluaciones =
                await respuestaEvaluaciones.json()


            setProveedores(datosProveedores)
            setEvaluaciones(datosEvaluaciones)

        } catch (error) {

            console.error('Error:', error)

        }

    }


    // =========================================
    // OBTENER NOMBRE DEL PROVEEDOR
    // =========================================

    const obtenerNombreProveedor = (idProveedor) => {

        const proveedor = proveedores.find(
            (p) => p.idProveedor === idProveedor
        )


        return proveedor
            ? proveedor.nombre
            : 'Proveedor no encontrado'

    }


    // =========================================
    // OBTENER ÚLTIMA EVALUACIÓN
    // =========================================

    const obtenerUltimaEvaluacion = (idProveedor) => {

        const evaluacionesProveedor = evaluaciones.filter(
            (evaluacion) =>
                evaluacion.idProveedor === idProveedor
        )


        if (evaluacionesProveedor.length === 0) {
            return null
        }


        return evaluacionesProveedor[
            evaluacionesProveedor.length - 1
        ]

    }


    // =========================================
    // PROMEDIO GENERAL
    // =========================================

    const promedioGeneral =
        evaluaciones.length > 0
            ? (
                evaluaciones.reduce(
                    (total, evaluacion) =>
                        total +
                        (Number(evaluacion.calificacionFinal) || 0),
                    0
                ) / evaluaciones.length
            ).toFixed(2)
            : '0.00'


    // =========================================
    // PROVEEDORES ACTIVOS
    // =========================================

    const proveedoresActivos = proveedores.filter(
        (proveedor) =>
            proveedor.estado?.toLowerCase() === 'activo'
    ).length


    // =========================================
    // PROVEEDORES EN RIESGO
    // =========================================

    const proveedoresRiesgo = evaluaciones.filter(
        (evaluacion) =>
            evaluacion.clasificacion?.toLowerCase() === 'riesgo'
    )


    // =========================================
    // GENERAR PDF
    // =========================================

    const generarPDF = () => {

        const doc = new jsPDF()


        // -----------------------------------------
        // TÍTULO
        // -----------------------------------------

        doc.setFontSize(20)

        doc.text(
            'Reporte de Evaluacion de Proveedores',
            20,
            20
        )


        // -----------------------------------------
        // FECHA
        // -----------------------------------------

        const fecha = new Date()

        const fechaTexto =
            fecha.toLocaleDateString('es-MX')


        doc.setFontSize(10)

        doc.text(
            `Fecha del reporte: ${fechaTexto}`,
            20,
            28
        )


        // -----------------------------------------
        // RESUMEN
        // -----------------------------------------

        doc.setFontSize(14)

        doc.text(
            'Resumen general',
            20,
            42
        )


        doc.setFontSize(11)


        doc.text(
            `Total de proveedores: ${proveedores.length}`,
            20,
            52
        )


        doc.text(
            `Proveedores activos: ${proveedoresActivos}`,
            20,
            60
        )


        doc.text(
            `Evaluaciones realizadas: ${evaluaciones.length}`,
            20,
            68
        )


        doc.text(
            `Promedio general: ${promedioGeneral} / 100`,
            20,
            76
        )


        // -----------------------------------------
        // TABLA DE PROVEEDORES
        // -----------------------------------------

        const filas = proveedores.map((proveedor) => {

            const evaluacion =
                obtenerUltimaEvaluacion(
                    proveedor.idProveedor
                )


            return [

                proveedor.nombre,

                proveedor.estado || 'Sin estado',

                evaluacion
                    ? `${evaluacion.calificacionFinal} / 100`
                    : 'Sin evaluacion',

                evaluacion
                    ? evaluacion.clasificacion
                    : 'Sin evaluacion'

            ]

        })


        autoTable(doc, {

            startY: 88,

            head: [[
                'Proveedor',
                'Estado',
                'Calificacion',
                'Clasificacion'
            ]],

            body: filas,

            theme: 'grid',

            styles: {
                fontSize: 9
            },

            headStyles: {
                fontSize: 9
            }

        })


        // -----------------------------------------
        // PROVEEDORES EN RIESGO
        // -----------------------------------------

        doc.addPage()


        doc.setFontSize(16)

        doc.text(
            'Proveedores en riesgo',
            20,
            20
        )


        if (proveedoresRiesgo.length === 0) {

            doc.setFontSize(11)

            doc.text(
                'No existen proveedores clasificados en riesgo.',
                20,
                32
            )

        } else {

            let posicionY = 35


            proveedoresRiesgo.forEach(
                (evaluacion, index) => {

                    const nombreProveedor =
                        obtenerNombreProveedor(
                            evaluacion.idProveedor
                        )


                    doc.setFontSize(12)

                    doc.text(
                        `${index + 1}. ${nombreProveedor}`,
                        20,
                        posicionY
                    )


                    doc.setFontSize(10)


                    doc.text(
                        `Calificacion: ${evaluacion.calificacionFinal} / 100`,
                        25,
                        posicionY + 8
                    )


                    doc.text(
                        `Clasificacion: ${evaluacion.clasificacion}`,
                        25,
                        posicionY + 16
                    )


                    const recomendacion =
                        evaluacion.recomendacion ||
                        'No hay una recomendacion disponible.'


                    const lineas =
                        doc.splitTextToSize(
                            `Recomendacion: ${recomendacion}`,
                            165
                        )


                    doc.text(
                        lineas,
                        25,
                        posicionY + 24
                    )


                    posicionY += 45


                    // Crear nueva página si hace falta

                    if (posicionY > 260) {

                        doc.addPage()

                        posicionY = 25

                    }

                }
            )

        }


        // -----------------------------------------
        // DESCARGAR PDF
        // -----------------------------------------

        const nombreArchivo =
            `Reporte_Proveedores_${fechaTexto.replaceAll('/', '-')}.pdf`


        doc.save(nombreArchivo)

    }


    // =========================================
    // INTERFAZ
    // =========================================

    return (

        <div style={{
            padding: '30px'
        }}>


            {/* ================================= */}
            {/* ENCABEZADO */}
            {/* ================================= */}

            <div style={{
                marginBottom: '30px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap'
            }}>


                <div>

                    <h1 style={{
                        margin: 0,
                        color: '#1e293b'
                    }}>
                        Reportes
                    </h1>


                    <p style={{
                        color: '#777',
                        marginTop: '8px'
                    }}>
                        Reporte general del desempeño de los proveedores.
                    </p>

                </div>


                {/* BOTÓN PDF */}

                <button
                    onClick={generarPDF}
                    style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(37,99,235,0.25)'
                    }}
                >
                    📄 Generar PDF
                </button>


            </div>


            {/* ================================= */}
            {/* RESUMEN */}
            {/* ================================= */}

            <div style={{
                display: 'grid',
                gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>


                {/* TOTAL */}

                <div style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow:
                        '0 4px 15px rgba(0,0,0,0.06)',
                    border:
                        '1px solid #f1f5f9'
                }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>

                        <div>

                            <span style={{
                                color: '#64748b',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>
                                Total de proveedores
                            </span>


                            <strong style={{
                                display: 'block',
                                fontSize: '34px',
                                marginTop: '8px',
                                color: '#1e293b'
                            }}>
                                {proveedores.length}
                            </strong>

                        </div>


                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            backgroundColor: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '25px'
                        }}>
                            👥
                        </div>

                    </div>

                </div>


                {/* ACTIVOS */}

                <div style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow:
                        '0 4px 15px rgba(0,0,0,0.06)',
                    border:
                        '1px solid #f1f5f9'
                }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>

                        <div>

                            <span style={{
                                color: '#64748b',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>
                                Proveedores activos
                            </span>


                            <strong style={{
                                display: 'block',
                                fontSize: '34px',
                                marginTop: '8px',
                                color: '#16a34a'
                            }}>
                                {proveedoresActivos}
                            </strong>

                        </div>


                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            backgroundColor: '#f0fdf4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '25px'
                        }}>
                            ✅
                        </div>

                    </div>

                </div>


                {/* EVALUACIONES */}

                <div style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow:
                        '0 4px 15px rgba(0,0,0,0.06)',
                    border:
                        '1px solid #f1f5f9'
                }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>

                        <div>

                            <span style={{
                                color: '#64748b',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>
                                Evaluaciones realizadas
                            </span>


                            <strong style={{
                                display: 'block',
                                fontSize: '34px',
                                marginTop: '8px',
                                color: '#1e293b'
                            }}>
                                {evaluaciones.length}
                            </strong>

                        </div>


                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            backgroundColor: '#fefce8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '25px'
                        }}>
                            📊
                        </div>

                    </div>

                </div>


                {/* PROMEDIO */}

                <div style={{
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow:
                        '0 4px 15px rgba(0,0,0,0.06)',
                    border:
                        '1px solid #f1f5f9'
                }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>

                        <div>

                            <span style={{
                                color: '#64748b',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>
                                Promedio general
                            </span>


                            <strong style={{
                                display: 'block',
                                fontSize: '34px',
                                marginTop: '8px',
                                color: '#2563eb'
                            }}>
                                {promedioGeneral}
                            </strong>


                            <span style={{
                                color: '#94a3b8',
                                fontSize: '12px'
                            }}>
                                de 100 puntos
                            </span>

                        </div>


                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            backgroundColor: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '25px'
                        }}>
                            📈
                        </div>

                    </div>

                </div>

            </div>


            {/* ================================= */}
            {/* TABLA DE PROVEEDORES */}
            {/* ================================= */}

            <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '16px',
                boxShadow:
                    '0 4px 15px rgba(0,0,0,0.06)',
                border:
                    '1px solid #f1f5f9',
                marginBottom: '30px'
            }}>


                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>

                    <div>

                        <h2 style={{
                            margin: 0,
                            color: '#1e293b'
                        }}>
                            Desempeño de proveedores
                        </h2>


                        <p style={{
                            margin: '6px 0 0',
                            color: '#64748b',
                            fontSize: '14px'
                        }}>
                            Resumen de la evaluación más reciente de cada proveedor.
                        </p>

                    </div>


                    <div style={{
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        padding: '8px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600'
                    }}>
                        {proveedores.length} proveedores
                    </div>

                </div>


                {proveedores.length === 0 ? (

                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#64748b'
                    }}>

                        <div style={{
                            fontSize: '40px',
                            marginBottom: '10px'
                        }}>
                            👥
                        </div>


                        <p>
                            No hay proveedores registrados.
                        </p>

                    </div>

                ) : (

                    <div style={{
                        overflowX: 'auto'
                    }}>

                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse'
                        }}>

                            <thead>

                                <tr style={{
                                    backgroundColor: '#f8fafc',
                                    borderBottom:
                                        '2px solid #e2e8f0'
                                }}>

                                    <th style={{
                                        padding: '14px',
                                        textAlign: 'left',
                                        color: '#475569',
                                        fontSize: '13px'
                                    }}>
                                        Proveedor
                                    </th>


                                    <th style={{
                                        padding: '14px',
                                        textAlign: 'left',
                                        color: '#475569',
                                        fontSize: '13px'
                                    }}>
                                        Estado
                                    </th>


                                    <th style={{
                                        padding: '14px',
                                        textAlign: 'center',
                                        color: '#475569',
                                        fontSize: '13px'
                                    }}>
                                        Calificación
                                    </th>


                                    <th style={{
                                        padding: '14px',
                                        textAlign: 'center',
                                        color: '#475569',
                                        fontSize: '13px'
                                    }}>
                                        Clasificación
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {proveedores.map((proveedor) => {

                                    const evaluacion =
                                        obtenerUltimaEvaluacion(
                                            proveedor.idProveedor
                                        )


                                    return (

                                        <tr
                                            key={proveedor.idProveedor}
                                            style={{
                                                borderBottom:
                                                    '1px solid #e5e7eb'
                                            }}
                                        >

                                            <td style={{
                                                padding: '16px'
                                            }}>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px'
                                                }}>

                                                    <div style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        borderRadius: '50%',
                                                        backgroundColor:
                                                            '#eff6ff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                        fontSize: '18px'
                                                    }}>
                                                        👤
                                                    </div>


                                                    <div>

                                                        <strong style={{
                                                            color:
                                                                '#1e293b'
                                                        }}>
                                                            {proveedor.nombre}
                                                        </strong>


                                                        <div style={{
                                                            fontSize: '12px',
                                                            color:
                                                                '#94a3b8',
                                                            marginTop:
                                                                '3px'
                                                        }}>
                                                            ID: {proveedor.idProveedor}
                                                        </div>

                                                    </div>

                                                </div>

                                            </td>


                                            <td style={{
                                                padding: '16px'
                                            }}>

                                                <span style={{
                                                    display:
                                                        'inline-block',
                                                    padding:
                                                        '6px 12px',
                                                    borderRadius:
                                                        '20px',
                                                    fontSize:
                                                        '12px',
                                                    fontWeight:
                                                        '600',
                                                    backgroundColor:
                                                        proveedor.estado?.toLowerCase() === 'activo'
                                                            ? '#dcfce7'
                                                            : '#f1f5f9',
                                                    color:
                                                        proveedor.estado?.toLowerCase() === 'activo'
                                                            ? '#166534'
                                                            : '#475569'
                                                }}>
                                                    {proveedor.estado}
                                                </span>

                                            </td>


                                            <td style={{
                                                padding: '16px',
                                                textAlign: 'center'
                                            }}>

                                                {evaluacion ? (

                                                    <div>

                                                        <strong style={{
                                                            fontSize:
                                                                '16px',
                                                            color:
                                                                '#1e293b'
                                                        }}>
                                                            {evaluacion.calificacionFinal}
                                                        </strong>


                                                        <span style={{
                                                            color:
                                                                '#94a3b8',
                                                            fontSize:
                                                                '12px'
                                                        }}>
                                                            {' '} / 100
                                                        </span>

                                                    </div>

                                                ) : (

                                                    <span style={{
                                                        color:
                                                            '#94a3b8',
                                                        fontSize:
                                                            '13px'
                                                    }}>
                                                        Sin evaluación
                                                    </span>

                                                )}

                                            </td>


                                            <td style={{
                                                padding: '16px',
                                                textAlign: 'center'
                                            }}>

                                                {evaluacion ? (

                                                    <span style={{
                                                        display:
                                                            'inline-block',
                                                        padding:
                                                            '7px 14px',
                                                        borderRadius:
                                                            '20px',
                                                        fontSize:
                                                            '12px',
                                                        fontWeight:
                                                            '700',
                                                        backgroundColor:
                                                            evaluacion.clasificacion === 'Excelente'
                                                                ? '#dcfce7'
                                                                : evaluacion.clasificacion === 'Bueno'
                                                                    ? '#dbeafe'
                                                                    : evaluacion.clasificacion === 'Regular'
                                                                        ? '#fef3c7'
                                                                        : '#fee2e2',
                                                        color:
                                                            evaluacion.clasificacion === 'Excelente'
                                                                ? '#166534'
                                                                : evaluacion.clasificacion === 'Bueno'
                                                                    ? '#1d4ed8'
                                                                    : evaluacion.clasificacion === 'Regular'
                                                                        ? '#92400e'
                                                                        : '#991b1b'
                                                    }}>
                                                        {evaluacion.clasificacion}
                                                    </span>

                                                ) : (

                                                    <span style={{
                                                        color:
                                                            '#94a3b8',
                                                        fontSize:
                                                            '13px'
                                                    }}>
                                                        Sin evaluación
                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    )

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ================================= */}
            {/* PROVEEDORES EN RIESGO */}
            {/* ================================= */}

            <div style={{
                backgroundColor: 'white',
                padding: '25px',
                borderRadius: '16px',
                boxShadow:
                    '0 4px 15px rgba(0,0,0,0.06)',
                border:
                    '1px solid #f1f5f9'
            }}>


                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                }}>

                    <div style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '12px',
                        backgroundColor: '#fef2f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px'
                    }}>
                        ⚠️
                    </div>


                    <div>

                        <h2 style={{
                            margin: 0,
                            color: '#1e293b'
                        }}>
                            Proveedores en riesgo
                        </h2>


                        <p style={{
                            margin: '5px 0 0',
                            color: '#64748b',
                            fontSize: '14px'
                        }}>
                            Proveedores que requieren seguimiento y acciones de mejora.
                        </p>

                    </div>

                </div>


                {proveedoresRiesgo.length === 0 ? (

                    <div style={{
                        padding: '25px',
                        backgroundColor: '#f0fdf4',
                        border:
                            '1px solid #bbf7d0',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>

                        <div style={{
                            fontSize: '35px',
                            marginBottom: '8px'
                        }}>
                            ✅
                        </div>


                        <strong style={{
                            color: '#166534'
                        }}>
                            No existen proveedores clasificados en riesgo.
                        </strong>


                        <p style={{
                            margin: '8px 0 0',
                            color: '#4b5563',
                            fontSize: '13px'
                        }}>
                            Todos los proveedores cuentan actualmente con una clasificación diferente a riesgo.
                        </p>

                    </div>

                ) : (

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '18px'
                    }}>

                        {proveedoresRiesgo.map(
                            (evaluacion) => (

                                <div
                                    key={
                                        evaluacion.idEvaluacion
                                    }
                                    style={{
                                        padding: '20px',
                                        backgroundColor:
                                            '#fff7f7',
                                        border:
                                            '1px solid #fecaca',
                                        borderRadius:
                                            '14px'
                                    }}
                                >


                                    {/* PROVEEDOR */}

                                    <div style={{
                                        display: 'flex',
                                        alignItems:
                                            'center',
                                        gap: '12px',
                                        marginBottom:
                                            '15px'
                                    }}>

                                        <div style={{
                                            width: '42px',
                                            height: '42px',
                                            borderRadius:
                                                '50%',
                                            backgroundColor:
                                                '#fee2e2',
                                            display: 'flex',
                                            alignItems:
                                                'center',
                                            justifyContent:
                                                'center',
                                            fontSize: '19px'
                                        }}>
                                            👤
                                        </div>


                                        <div>

                                            <strong style={{
                                                display:
                                                    'block',
                                                fontSize:
                                                    '17px',
                                                color:
                                                    '#991b1b'
                                            }}>
                                                {obtenerNombreProveedor(
                                                    evaluacion.idProveedor
                                                )}
                                            </strong>


                                            <span style={{
                                                fontSize:
                                                    '12px',
                                                color:
                                                    '#7f1d1d'
                                            }}>
                                                Proveedor en riesgo
                                            </span>

                                        </div>

                                    </div>


                                    {/* CALIFICACIÓN */}

                                    <div style={{
                                        backgroundColor:
                                            'white',
                                        padding: '12px',
                                        borderRadius:
                                            '10px',
                                        marginBottom:
                                            '15px',
                                        border:
                                            '1px solid #fee2e2'
                                    }}>

                                        <span style={{
                                            fontSize:
                                                '13px',
                                            color:
                                                '#64748b'
                                        }}>
                                            Calificación obtenida
                                        </span>


                                        <strong style={{
                                            display:
                                                'block',
                                            fontSize:
                                                '24px',
                                            color:
                                                '#dc2626',
                                            marginTop:
                                                '3px'
                                        }}>

                                            {
                                                evaluacion.calificacionFinal
                                            }


                                            <span style={{
                                                fontSize:
                                                    '13px',
                                                color:
                                                    '#94a3b8'
                                            }}>
                                                {' '} / 100
                                            </span>

                                        </strong>

                                    </div>


                                    {/* RECOMENDACIÓN IA */}

                                    <div style={{
                                        backgroundColor:
                                            '#eff6ff',
                                        border:
                                            '1px solid #bfdbfe',
                                        borderRadius:
                                            '10px',
                                        padding: '15px'
                                    }}>

                                        <div style={{
                                            display:
                                                'flex',
                                            alignItems:
                                                'center',
                                            gap: '7px',
                                            marginBottom:
                                                '8px'
                                        }}>

                                            <span style={{
                                                fontSize:
                                                    '18px'
                                            }}>
                                                🤖
                                            </span>


                                            <strong style={{
                                                color:
                                                    '#1d4ed8',
                                                fontSize:
                                                    '14px'
                                            }}>
                                                Recomendación de IA
                                            </strong>

                                        </div>


                                        <p style={{
                                            margin: 0,
                                            color:
                                                '#374151',
                                            lineHeight:
                                                '1.5',
                                            fontSize:
                                                '13px'
                                        }}>

                                            {
                                                evaluacion.recomendacion
                                                    ? evaluacion.recomendacion
                                                    : 'No hay una recomendación disponible para esta evaluación.'
                                            }

                                        </p>

                                    </div>


                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


        </div>

    )

}


export default Reportes