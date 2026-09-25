import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Evaluaciones() {

    const navigate = useNavigate()

    const [evaluaciones, setEvaluaciones] = useState([])
    const [proveedores, setProveedores] = useState([])

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

            if (!respuestaEvaluaciones.ok || !respuestaProveedores.ok) {
                throw new Error('Error al obtener los datos')
            }

            const datosEvaluaciones = await respuestaEvaluaciones.json()
            const datosProveedores = await respuestaProveedores.json()

            setEvaluaciones(datosEvaluaciones)
            setProveedores(datosProveedores)

        } catch (error) {
            console.error('Error:', error)
        }
    }

    const obtenerNombreProveedor = (idProveedor) => {

        const proveedor = proveedores.find(
            (p) => p.idProveedor === idProveedor
        )

        return proveedor
            ? proveedor.nombre
            : 'Proveedor no encontrado'
    }

    // Color de acuerdo con la clasificación
    const obtenerColorClasificacion = (clasificacion) => {

        if (clasificacion === 'Excelente') {
            return {
                fondo: '#dcfce7',
                texto: '#166534'
            }
        }

        if (clasificacion === 'Bueno') {
            return {
                fondo: '#dbeafe',
                texto: '#1d4ed8'
            }
        }

        if (clasificacion === 'Regular') {
            return {
                fondo: '#fef3c7',
                texto: '#92400e'
            }
        }

        return {
            fondo: '#fee2e2',
            texto: '#991b1b'
        }
    }

    return (
        <div style={{ padding: '30px' }}>

            {/* ENCABEZADO */}

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px'
            }}>

                <div>

                    <h1 style={{ margin: 0 }}>
                        Evaluaciones de Proveedores
                    </h1>

                    <p style={{
                        marginTop: '8px',
                        color: '#777'
                    }}>
                        Consulta el desempeño de cada proveedor.
                    </p>

                </div>


                {/* BOTÓN NUEVA EVALUACIÓN */}

                <button
                    onClick={() => navigate('/nueva-evaluacion')}
                    style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                >
                    + Nueva evaluación
                </button>

            </div>


            {/* EVALUACIONES */}

            {evaluaciones.length === 0 ? (

                <p>No hay evaluaciones registradas.</p>

            ) : (

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                }}>

                    {evaluaciones.map((evaluacion) => {

                        const colores = obtenerColorClasificacion(
                            evaluacion.clasificacion
                        )

                        return (

                            <div
                                key={evaluacion.idEvaluacion}
                                style={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                }}
                            >

                                {/* ENCABEZADO DE TARJETA */}

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '20px'
                                }}>

                                    <span style={{
                                        color: '#777',
                                        fontSize: '14px'
                                    }}>
                                        Evaluación #{evaluacion.idEvaluacion}
                                    </span>

                                    <span style={{
                                        backgroundColor: colores.fondo,
                                        color: colores.texto,
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        fontWeight: 'bold'
                                    }}>
                                        {evaluacion.clasificacion}
                                    </span>

                                </div>


                                {/* PROVEEDOR */}

                                <div style={{
                                    backgroundColor: '#f8fafc',
                                    padding: '15px',
                                    borderRadius: '10px',
                                    marginBottom: '20px'
                                }}>

                                    <span style={{
                                        display: 'block',
                                        fontSize: '12px',
                                        color: '#777',
                                        marginBottom: '5px'
                                    }}>
                                        PROVEEDOR
                                    </span>

                                    <strong style={{
                                        fontSize: '18px'
                                    }}>
                                        {obtenerNombreProveedor(
                                            evaluacion.idProveedor
                                        )}
                                    </strong>

                                </div>


                                {/* INDICADORES */}

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '14px'
                                }}>

                                    <Indicador
                                        nombre="Cumplimiento de entregas"
                                        valor={evaluacion.cumplimientoEntregas}
                                    />

                                    <Indicador
                                        nombre="Calidad"
                                        valor={evaluacion.calidad}
                                    />

                                    <Indicador
                                        nombre="Costos"
                                        valor={evaluacion.costos}
                                    />

                                    <Indicador
                                        nombre="Tiempo de respuesta"
                                        valor={evaluacion.tiempoRespuesta}
                                    />

                                    <Indicador
                                        nombre="Incidencias"
                                        valor={evaluacion.incidencias}
                                    />

                                </div>


                                {/* CALIFICACIÓN FINAL */}

                                <div style={{
                                    borderTop: '1px solid #e5e7eb',
                                    marginTop: '22px',
                                    paddingTop: '20px',
                                    textAlign: 'center'
                                }}>

                                    <span style={{
                                        display: 'block',
                                        color: '#777',
                                        fontSize: '13px'
                                    }}>
                                        CALIFICACIÓN FINAL
                                    </span>

                                    <strong style={{
                                        display: 'block',
                                        fontSize: '36px',
                                        marginTop: '5px'
                                    }}>
                                        {evaluacion.calificacionFinal}
                                    </strong>

                                    <span style={{
                                        color: '#777',
                                        fontSize: '13px'
                                    }}>
                                        de 100 puntos
                                    </span>

                                </div>


                                {/* RECOMENDACIÓN DE IA */}

                                <div style={{
                                    marginTop: '22px',
                                    padding: '18px',
                                    backgroundColor: '#eff6ff',
                                    border: '1px solid #bfdbfe',
                                    borderRadius: '12px',
                                    textAlign: 'left'
                                }}>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '10px'
                                    }}>

                                        <span style={{
                                            fontSize: '20px'
                                        }}>
                                            🤖
                                        </span>

                                        <strong style={{
                                            color: '#1d4ed8',
                                            fontSize: '15px'
                                        }}>
                                            Recomendación de IA
                                        </strong>

                                    </div>

                                    <p style={{
                                        margin: 0,
                                        color: '#374151',
                                        fontSize: '14px',
                                        lineHeight: '1.6'
                                    }}>
                                        {evaluacion.recomendacion
                                            ? evaluacion.recomendacion
                                            : 'No hay una recomendación disponible para esta evaluación.'
                                        }
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


/* COMPONENTE PARA LOS INDICADORES */

function Indicador({ nombre, valor }) {

    return (

        <div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px'
            }}>

                <span style={{
                    fontSize: '13px',
                    color: '#555'
                }}>
                    {nombre}
                </span>

                <strong style={{
                    fontSize: '13px'
                }}>
                    {valor}%
                </strong>

            </div>


            {/* BARRA */}

            <div style={{
                width: '100%',
                height: '7px',
                backgroundColor: '#e5e7eb',
                borderRadius: '10px',
                overflow: 'hidden'
            }}>

                <div style={{
                    width: `${valor}%`,
                    height: '100%',
                    backgroundColor: '#2563eb',
                    borderRadius: '10px'
                }}>
                </div>

            </div>

        </div>

    )
}

export default Evaluaciones