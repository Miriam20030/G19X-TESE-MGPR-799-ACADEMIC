
import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import './Reportes.css'

function Reportes() {

    const [proveedores, setProveedores] = useState([])
    const [evaluaciones, setEvaluaciones] = useState([])
    const [cargando, setCargando] = useState(true)

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
                throw new Error('No se pudieron obtener los datos')
            }

            const datosProveedores =
                await respuestaProveedores.json()

            const datosEvaluaciones =
                await respuestaEvaluaciones.json()

            setProveedores(datosProveedores)
            setEvaluaciones(datosEvaluaciones)

        } catch (error) {

            console.error('Error al obtener los datos:', error)

        } finally {

            setCargando(false)

        }
    }


    const obtenerUltimaEvaluacion = (idProveedor) => {

        const evaluacionesProveedor =
            evaluaciones.filter(
                (e) => e.idProveedor === idProveedor
            )

        if (evaluacionesProveedor.length === 0) {
            return null
        }

        return [...evaluacionesProveedor].sort(
            (a, b) =>
                new Date(b.fechaEvaluacion) -
                new Date(a.fechaEvaluacion)
        )[0]
    }


    const ultimasEvaluaciones = proveedores
        .map((proveedor) => ({
            proveedor,
            evaluacion: obtenerUltimaEvaluacion(
                proveedor.idProveedor
            )
        }))
        .filter(
            (item) => item.evaluacion !== null
        )


    const promedioGeneral =
        evaluaciones.length > 0
            ? (
                evaluaciones.reduce(
                    (total, evaluacion) =>
                        total +
                        Number(
                            evaluacion.calificacionFinal || 0
                        ),
                    0
                ) / evaluaciones.length
            ).toFixed(1)
            : '0.0'


    const promedioPorProveedor =
        ultimasEvaluaciones
            .map((item) => ({
                nombre: item.proveedor.nombre,
                promedio: Number(
                    item.evaluacion.calificacionFinal || 0
                )
            }))
            .sort(
                (a, b) =>
                    b.promedio - a.promedio
            )


    const clasificaciones = {
        Excelente: 0,
        Bueno: 0,
        Regular: 0,
        Riesgo: 0
    }


    evaluaciones.forEach((evaluacion) => {

        if (
            clasificaciones[
                evaluacion.clasificacion
            ] !== undefined
        ) {

            clasificaciones[
                evaluacion.clasificacion
            ]++

        }

    })


    const totalClasificaciones =
        Object.values(clasificaciones).reduce(
            (total, cantidad) =>
                total + cantidad,
            0
        )


    const obtenerPorcentaje = (cantidad) => {

        if (totalClasificaciones === 0) {
            return 0
        }

        return (
            cantidad /
            totalClasificaciones
        ) * 100

    }


    const porcentajeExcelente =
        obtenerPorcentaje(
            clasificaciones.Excelente
        )

    const porcentajeBueno =
        obtenerPorcentaje(
            clasificaciones.Bueno
        )

    const porcentajeRegular =
        obtenerPorcentaje(
            clasificaciones.Regular
        )


    const proveedoresRiesgo =
        ultimasEvaluaciones.filter(
            (item) =>
                item.evaluacion.clasificacion ===
                'Riesgo'
        )


    const formatearFecha = (fecha) => {

        if (!fecha) {
            return 'Sin fecha'
        }

        return new Date(fecha).toLocaleDateString(
            'es-MX',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        )
    }


    const obtenerClaseCalificacion = (
        calificacion
    ) => {

        if (calificacion >= 90) {
            return 'calificacion-alta'
        }

        if (calificacion >= 75) {
            return 'calificacion-media'
        }

        return 'calificacion-baja'
    }


    const generarPDF = () => {

        const documento = new jsPDF()

        documento.setFontSize(20)

        documento.text(
            'Reporte de Evaluación de Proveedores',
            14,
            20
        )

        documento.setFontSize(10)

        documento.text(
            `Fecha del reporte: ${new Date().toLocaleDateString('es-MX')}`,
            14,
            28
        )

        documento.text(
            `Proveedores evaluados: ${ultimasEvaluaciones.length}`,
            14,
            36
        )

        documento.text(
            `Evaluaciones realizadas: ${evaluaciones.length}`,
            14,
            42
        )

        documento.text(
            `Promedio general: ${promedioGeneral}`,
            14,
            48
        )


        const filas =
            promedioPorProveedor.map(
                (item) => {

                    const evaluacion =
                        ultimasEvaluaciones.find(
                            (e) =>
                                e.proveedor.nombre ===
                                item.nombre
                        )?.evaluacion

                    return [
                        item.nombre,
                        item.promedio,
                        evaluacion?.clasificacion ||
                        'Sin clasificación',
                        formatearFecha(
                            evaluacion?.fechaEvaluacion
                        )
                    ]

                }
            )


        autoTable(documento, {

            startY: 58,

            head: [[
                'Proveedor',
                'Calificación',
                'Clasificación',
                'Fecha'
            ]],

            body: filas,

            styles: {
                fontSize: 9
            },

            headStyles: {
                fillColor: [22, 163, 74]
            }

        })


        const posicionFinal =
            documento.lastAutoTable.finalY + 15


        documento.setFontSize(14)

        documento.text(
            'Proveedores en riesgo',
            14,
            posicionFinal
        )


        const riesgos =
            proveedoresRiesgo.map(
                (item) => [
                    item.proveedor.nombre,
                    item.evaluacion.calificacionFinal,
                    item.evaluacion.recomendacion ||
                    'Requiere seguimiento'
                ]
            )


        if (riesgos.length > 0) {

            autoTable(documento, {

                startY:
                    posicionFinal + 6,

                head: [[
                    'Proveedor',
                    'Calificación',
                    'Recomendación'
                ]],

                body: riesgos,

                styles: {
                    fontSize: 8
                },

                headStyles: {
                    fillColor: [220, 38, 38]
                }

            })

        } else {

            documento.setFontSize(10)

            documento.text(
                'No existen proveedores clasificados como Riesgo.',
                14,
                posicionFinal + 8
            )

        }


        const fechaArchivo =
            new Date()
                .toISOString()
                .split('T')[0]


        documento.save(
            `Reporte-Proveedores-${fechaArchivo}.pdf`
        )
    }


    if (cargando) {

        return (

            <div className="reportes-loading">

                <div className="reportes-spinner"></div>

                <span>
                    Generando información del reporte...
                </span>

            </div>

        )

    }


    return (

        <div className="reportes-container">

            <header className="reportes-header">

                <div>

                    <span className="reportes-subtitulo">
                        ANÁLISIS DE DESEMPEÑO
                    </span>

                    <h1>
                        Reportes
                    </h1>

                    <div className="reportes-linea"></div>

                    <p>
                        Consulta el comportamiento y desempeño
                        general de los proveedores evaluados.
                    </p>

                </div>


                <button
                    className="btn-pdf"
                    onClick={generarPDF}
                >

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                        <path d="M8 13h8" />
                        <path d="M8 17h5" />
                    </svg>

                    Generar PDF

                </button>

            </header>


            <section className="reportes-resumen">

                <div className="resumen-item">

                    <span>
                        PROVEEDORES EVALUADOS
                    </span>

                    <strong>
                        {ultimasEvaluaciones.length}
                    </strong>

                </div>


                <div className="resumen-item">

                    <span>
                        EVALUACIONES REALIZADAS
                    </span>

                    <strong>
                        {evaluaciones.length}
                    </strong>

                </div>


                <div className="resumen-item">

                    <span>
                        PROMEDIO GENERAL
                    </span>

                    <strong>
                        {promedioGeneral}
                        <small>/100</small>
                    </strong>

                </div>

            </section>


            <section className="reportes-panel">

                <div className="panel-header">

                    <div>

                        <span className="panel-etiqueta">
                            DESEMPEÑO
                        </span>

                        <h2>
                            Calificación por proveedor
                        </h2>

                    </div>

                    <span className="panel-descripcion">
                        Última evaluación registrada
                    </span>

                </div>


                {promedioPorProveedor.length === 0 ? (

                    <div className="reporte-vacio">
                        No existen evaluaciones para mostrar.
                    </div>

                ) : (

                    <div className="grafica-proveedores">

                        {promedioPorProveedor.map(
                            (item, index) => {

                                const porcentaje =
                                    Math.min(
                                        item.promedio,
                                        100
                                    )

                                return (

                                    <div
                                        className="barra-proveedor"
                                        key={index}
                                    >

                                        <div className="barra-info">

                                            <span
                                                title={item.nombre}
                                            >
                                                {item.nombre}
                                            </span>

                                            <strong>
                                                {item.promedio.toFixed(1)}
                                            </strong>

                                        </div>


                                        <div className="barra-fondo">

                                            <div
                                                className={`barra-valor ${
                                                    obtenerClaseCalificacion(
                                                        item.promedio
                                                    )
                                                }`}
                                                style={{
                                                    width: `${porcentaje}%`
                                                }}
                                            ></div>

                                        </div>

                                    </div>

                                )

                            }
                        )}

                    </div>

                )}

            </section>


            <div className="reportes-dos-columnas">


                {/* GRÁFICA CIRCULAR */}

                <section className="reportes-panel">

                    <div className="panel-header">

                        <div>

                            <span className="panel-etiqueta">
                                DISTRIBUCIÓN
                            </span>

                            <h2>
                                Resultados de evaluación
                            </h2>

                        </div>

                    </div>


                    {totalClasificaciones === 0 ? (

                        <div className="reporte-vacio">
                            No existen evaluaciones para mostrar.
                        </div>

                    ) : (

                        <div className="grafica-circular-contenedor">


                            <div
                                className="grafica-circular"
                                style={{
                                    background: `conic-gradient(
                                        #16a34a 0% ${porcentajeExcelente}%,
                                        #65a30d ${porcentajeExcelente}% ${porcentajeExcelente + porcentajeBueno}%,
                                        #f59e0b ${porcentajeExcelente + porcentajeBueno}% ${porcentajeExcelente + porcentajeBueno + porcentajeRegular}%,
                                        #dc2626 ${porcentajeExcelente + porcentajeBueno + porcentajeRegular}% 100%
                                    )`
                                }}
                            >

                                <div className="grafica-circular-centro">

                                    <strong>
                                        {totalClasificaciones}
                                    </strong>

                                    <span>
                                        evaluaciones
                                    </span>

                                </div>

                            </div>


                            <div className="grafica-leyenda">


                                <div className="leyenda-item">

                                    <span className="leyenda-punto punto-excelente"></span>

                                    <div>

                                        <strong>
                                            Excelente
                                        </strong>

                                        <span>
                                            {clasificaciones.Excelente}
                                            {' '}
                                            (
                                            {porcentajeExcelente.toFixed(0)}
                                            %)
                                        </span>

                                    </div>

                                </div>


                                <div className="leyenda-item">

                                    <span className="leyenda-punto punto-bueno"></span>

                                    <div>

                                        <strong>
                                            Bueno
                                        </strong>

                                        <span>
                                            {clasificaciones.Bueno}
                                            {' '}
                                            (
                                            {porcentajeBueno.toFixed(0)}
                                            %)
                                        </span>

                                    </div>

                                </div>


                                <div className="leyenda-item">

                                    <span className="leyenda-punto punto-regular"></span>

                                    <div>

                                        <strong>
                                            Regular
                                        </strong>

                                        <span>
                                            {clasificaciones.Regular}
                                            {' '}
                                            (
                                            {porcentajeRegular.toFixed(0)}
                                            %)
                                        </span>

                                    </div>

                                </div>


                                <div className="leyenda-item">

                                    <span className="leyenda-punto punto-riesgo"></span>

                                    <div>

                                        <strong>
                                            Riesgo
                                        </strong>

                                        <span>
                                            {clasificaciones.Riesgo}
                                            {' '}
                                            (
                                            {obtenerPorcentaje(
                                                clasificaciones.Riesgo
                                            ).toFixed(0)}
                                            %)
                                        </span>

                                    </div>

                                </div>


                            </div>

                        </div>

                    )}

                </section>


                {/* TABLA */}

                <section className="reportes-panel">

                    <div className="panel-header">

                        <div>

                            <span className="panel-etiqueta">
                                EVALUACIONES
                            </span>

                            <h2>
                                Últimos resultados
                            </h2>

                        </div>

                    </div>


                    <div className="tabla-contenedor">

                        <table className="tabla-reportes">

                            <thead>

                                <tr>

                                    <th>
                                        Proveedor
                                    </th>

                                    <th>
                                        Calificación
                                    </th>

                                    <th>
                                        Estado
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {promedioPorProveedor
                                    .slice(0, 5)
                                    .map(
                                        (item, index) => {

                                            const evaluacion =
                                                ultimasEvaluaciones.find(
                                                    (e) =>
                                                        e.proveedor.nombre ===
                                                        item.nombre
                                                )?.evaluacion

                                            return (

                                                <tr
                                                    key={index}
                                                >

                                                    <td>
                                                        {item.nombre}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {item.promedio.toFixed(1)}
                                                        </strong>
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`tabla-estado estado-${evaluacion?.clasificacion?.toLowerCase()}`}
                                                        >
                                                            {
                                                                evaluacion?.clasificacion ||
                                                                'Sin datos'
                                                            }
                                                        </span>

                                                    </td>

                                                </tr>

                                            )

                                        }
                                    )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </div>


            <section className="reportes-panel reporte-riesgo">

                <div className="panel-header">

                    <div>

                        <span className="panel-etiqueta">
                            SEGUIMIENTO
                        </span>

                        <h2>
                            Proveedores que requieren atención
                        </h2>

                    </div>

                    <span className="riesgo-contador">
                        {proveedoresRiesgo.length}
                    </span>

                </div>


                {proveedoresRiesgo.length === 0 ? (

                    <div className="riesgo-vacio">

                        <strong>
                            No hay proveedores clasificados como Riesgo.
                        </strong>

                        <p>
                            Las evaluaciones actuales no muestran
                            proveedores que requieran seguimiento por riesgo.
                        </p>

                    </div>

                ) : (

                    <div className="riesgo-lista">

                        {proveedoresRiesgo.map(
                            (item) => (

                                <div
                                    className="riesgo-item"
                                    key={
                                        item.evaluacion.idEvaluacion
                                    }
                                >

                                    <div>

                                        <strong>
                                            {item.proveedor.nombre}
                                        </strong>

                                        <span>
                                            Evaluación del{' '}
                                            {formatearFecha(
                                                item.evaluacion.fechaEvaluacion
                                            )}
                                        </span>

                                    </div>


                                    <div className="riesgo-calificacion">

                                        <strong>
                                            {item.evaluacion.calificacionFinal}
                                        </strong>

                                        <span>
                                            /100
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>

    )
}

export default Reportes
