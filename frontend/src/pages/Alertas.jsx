
import { useEffect, useState } from 'react'
import './Alertas.css'

function Alertas() {

    const [evaluaciones, setEvaluaciones] = useState([])
    const [proveedores, setProveedores] = useState([])
    const [busqueda, setBusqueda] = useState('')

    useEffect(() => {
        obtenerDatos()
    }, [])

    const obtenerDatos = async () => {

        try {

            const respuestaEvaluaciones = await fetch(
                'http://localhost:8080/api/evaluaciones'
            )

            const respuestaProveedores = await fetch(
                'http://localhost:8080/api/proveedores'
            )

            if (
                !respuestaEvaluaciones.ok ||
                !respuestaProveedores.ok
            ) {
                throw new Error('Error al obtener los datos')
            }

            const datosEvaluaciones =
                await respuestaEvaluaciones.json()

            const datosProveedores =
                await respuestaProveedores.json()

            setEvaluaciones(datosEvaluaciones)
            setProveedores(datosProveedores)

        } catch (error) {

            console.error('Error al obtener los datos:', error)

        }
    }


    // Obtener el nombre del proveedor
    const obtenerNombreProveedor = (idProveedor) => {

        const proveedor = proveedores.find(
            (p) => p.idProveedor === idProveedor
        )

        return proveedor
            ? proveedor.nombre
            : 'Proveedor no encontrado'
    }


    // Formatear fecha y hora
    const formatearFecha = (fecha) => {

        if (!fecha) {
            return 'Fecha no disponible'
        }

        const fechaFormateada = new Date(fecha)

        if (isNaN(fechaFormateada.getTime())) {
            return 'Fecha no disponible'
        }

        return fechaFormateada.toLocaleString(
            'es-MX',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }
        )
    }


    // Obtener solamente las evaluaciones
    // clasificadas como Riesgo o Regular
    const alertas = evaluaciones.filter(
        (evaluacion) =>
            evaluacion.clasificacion === 'Riesgo' ||
            evaluacion.clasificacion === 'Regular'
    )


    // Filtrar por nombre del proveedor
    const alertasFiltradas = alertas.filter(
        (evaluacion) => {

            const nombreProveedor =
                obtenerNombreProveedor(
                    evaluacion.idProveedor
                ).toLowerCase()

            return nombreProveedor.includes(
                busqueda.toLowerCase()
            )
        }
    )


    return (

        <div className="alertas-container">

            {/* ENCABEZADO */}

            <header className="alertas-header">

                <span className="alertas-subtitulo">
                    MONITOREO DE PROVEEDORES
                </span>

                <h1>
                    Alertas
                </h1>

                <div className="titulo-linea"></div>

                <p>
                    Proveedores que requieren atención según los resultados
                    de sus evaluaciones.
                </p>

            </header>


            {/* BUSCADOR */}

            <div className="alertas-herramientas">

                <div className="buscador">

                    <span className="buscador-icono">
                        Buscar
                    </span>

                    <input
                        type="text"
                        placeholder="Buscar proveedor..."
                        value={busqueda}
                        onChange={(e) =>
                            setBusqueda(e.target.value)
                        }
                    />

                </div>

                <span className="resultado-texto">

                    {alertasFiltradas.length}

                    {' '}

                    proveedor
                    {alertasFiltradas.length !== 1
                        ? 'es'
                        : ''
                    }

                </span>

            </div>


            {/* SIN RESULTADOS */}

            {alertasFiltradas.length === 0 ? (

                <div className="sin-alertas">

                    <div className="estado-linea"></div>

                    <h2>

                        {busqueda
                            ? 'No se encontraron resultados'
                            : 'Todo está en orden'
                        }

                    </h2>

                    <p>

                        {busqueda
                            ? 'No existe una alerta para el proveedor que estás buscando.'
                            : 'Actualmente no existen proveedores con evaluaciones clasificadas como Riesgo o Regular.'
                        }

                    </p>

                </div>

            ) : (

                /* TARJETAS */

                <div className="alertas-grid">

                    {alertasFiltradas.map((evaluacion) => {

                        const esRiesgo =
                            evaluacion.clasificacion === 'Riesgo'

                        return (

                            <div
                                className={`alerta-card ${
                                    esRiesgo
                                        ? 'card-riesgo'
                                        : 'card-regular'
                                }`}
                                key={evaluacion.idEvaluacion}
                            >

                                {/* PARTE SUPERIOR */}

                                <div className="alerta-top">

                                    <span className="evaluacion-id">

                                        Evaluación #
                                        {evaluacion.idEvaluacion}

                                    </span>

                                    <span
                                        className={`estado-badge ${
                                            esRiesgo
                                                ? 'badge-riesgo'
                                                : 'badge-regular'
                                        }`}
                                    >

                                        {evaluacion.clasificacion}

                                    </span>

                                </div>


                                {/* PROVEEDOR */}

                                <div className="proveedor-info">

                                    <span>
                                        PROVEEDOR
                                    </span>

                                    <h2>

                                        {obtenerNombreProveedor(
                                            evaluacion.idProveedor
                                        )}

                                    </h2>

                                </div>


                                {/* INFORMACIÓN */}

                                <div className="datos-alerta">

                                    <div>

                                        <span>
                                            CALIFICACIÓN
                                        </span>

                                        <strong>

                                            {evaluacion.calificacionFinal}

                                            <small>
                                                /100
                                            </small>

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            FECHA DE EVALUACIÓN
                                        </span>

                                        <p>
                                            {formatearFecha(
                                                evaluacion.fechaEvaluacion
                                            )}
                                        </p>

                                    </div>

                                </div>


                                {/* BARRA DE CALIFICACIÓN */}

                                <div className="barra-calificacion">

                                    <div
                                        className={
                                            esRiesgo
                                                ? 'barra-riesgo'
                                                : 'barra-regular'
                                        }

                                        style={{
                                            width: `${Math.min(
                                                Number(
                                                    evaluacion.calificacionFinal
                                                ) || 0,
                                                100
                                            )}%`
                                        }}
                                    ></div>

                                </div>


                                {/* MENSAJE */}

                                <div className="alerta-mensaje">

                                    <strong>
                                        Requiere seguimiento
                                    </strong>

                                    <p>
                                        Se recomienda revisar el desempeño
                                        de este proveedor.
                                    </p>

                                </div>

                            </div>

                        )

                    })}

                </div>

            )}

        </div>

    )
}

export default Alertas
