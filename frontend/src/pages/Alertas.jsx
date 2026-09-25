import { useEffect, useState } from 'react'

function Alertas() {

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


    const alertas = evaluaciones.filter(
        (evaluacion) =>
            evaluacion.clasificacion === 'Riesgo' ||
            evaluacion.clasificacion === 'Regular'
    )


    return (

        <div style={{ padding: '30px' }}>

            <h1>
                Alertas
            </h1>

            <p style={{
                color: '#777',
                marginBottom: '30px'
            }}>
                Proveedores que requieren atención según su evaluación.
            </p>


            {alertas.length === 0 ? (

                <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    padding: '25px',
                    borderRadius: '12px'
                }}>

                    <h2 style={{
                        marginTop: 0,
                        color: '#166534'
                    }}>
                        ✓ Todo está en orden
                    </h2>

                    <p>
                        No existen proveedores con evaluaciones
                        clasificadas como Riesgo o Regular.
                    </p>

                </div>

            ) : (

                <div style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px'
                }}>

                    {alertas.map((evaluacion) => (

                        <div
                            key={evaluacion.idEvaluacion}
                            style={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '16px',
                                padding: '24px',
                                boxShadow:
                                    '0 4px 12px rgba(0,0,0,0.08)'
                            }}
                        >

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>

                                <span style={{
                                    fontSize: '13px',
                                    color: '#777'
                                }}>
                                    Evaluación #{evaluacion.idEvaluacion}
                                </span>

                                <span style={{
                                    backgroundColor:
                                        evaluacion.clasificacion === 'Riesgo'
                                            ? '#fee2e2'
                                            : '#fef3c7',

                                    color:
                                        evaluacion.clasificacion === 'Riesgo'
                                            ? '#991b1b'
                                            : '#92400e',

                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    fontSize: '13px'
                                }}>
                                    {evaluacion.clasificacion}
                                </span>

                            </div>


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


                            <div style={{
                                textAlign: 'center',
                                marginBottom: '20px'
                            }}>

                                <span style={{
                                    display: 'block',
                                    color: '#777',
                                    fontSize: '13px'
                                }}>
                                    CALIFICACIÓN
                                </span>

                                <strong style={{
                                    fontSize: '38px'
                                }}>
                                    {evaluacion.calificacionFinal}
                                </strong>

                                <span style={{
                                    color: '#777'
                                }}>
                                    /100
                                </span>

                            </div>


                            <div style={{
                                borderTop: '1px solid #e5e7eb',
                                paddingTop: '15px'
                            }}>

                                <strong>
                                    ⚠️ Atención requerida
                                </strong>

                                <p style={{
                                    color: '#666',
                                    fontSize: '14px'
                                }}>
                                    Se recomienda revisar el desempeño
                                    de este proveedor.
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    )
}

export default Alertas