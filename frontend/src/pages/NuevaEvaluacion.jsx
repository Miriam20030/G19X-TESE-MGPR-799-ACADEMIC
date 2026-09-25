import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


function NuevaEvaluacion() {

    const navigate = useNavigate()

    const [proveedores, setProveedores] = useState([])

    const [idProveedor, setIdProveedor] = useState('')
    const [cumplimientoEntregas, setCumplimientoEntregas] = useState('')
    const [calidad, setCalidad] = useState('')
    const [costos, setCostos] = useState('')
    const [tiempoRespuesta, setTiempoRespuesta] = useState('')
    const [incidencias, setIncidencias] = useState('')


    useEffect(() => {
        obtenerProveedores()
    }, [])


    const obtenerProveedores = async () => {

        try {

            const respuesta = await fetch(
                'http://localhost:8080/api/proveedores'
            )

            if (!respuesta.ok) {
                throw new Error('Error al obtener los proveedores')
            }

            const datos = await respuesta.json()

            setProveedores(datos)

        } catch (error) {

            console.error('Error:', error)

        }

    }


    // ==========================================
    // CALIFICACIÓN AUTOMÁTICA
    // ==========================================

    const calcularCalificacion = () => {

        const cumplimiento = Number(cumplimientoEntregas) || 0
        const calidadValor = Number(calidad) || 0
        const costosValor = Number(costos) || 0
        const tiempo = Number(tiempoRespuesta) || 0
        const incidenciasValor = Number(incidencias) || 0

        const resultado =
            (cumplimiento * 0.25) +
            (calidadValor * 0.25) +
            (costosValor * 0.20) +
            (tiempo * 0.15) +
            (incidenciasValor * 0.15)

        return resultado.toFixed(2)
    }


    // ==========================================
    // CLASIFICACIÓN AUTOMÁTICA
    // ==========================================

    const obtenerClasificacion = (calificacion) => {

        const valor = Number(calificacion)

        if (valor >= 90) {
            return 'Excelente'
        }

        if (valor >= 80) {
            return 'Bueno'
        }

        if (valor >= 70) {
            return 'Regular'
        }

        return 'Riesgo'
    }


    const calificacionActual = calcularCalificacion()

    const clasificacionActual =
        obtenerClasificacion(calificacionActual)


    // ==========================================
    // ANALIZAR EVALUACIÓN CON IA
    // ==========================================

    const analizarConIA = async () => {

        const datosEvaluacion = {

            cumplimientoEntregas:
                Number(cumplimientoEntregas),

            calidad:
                Number(calidad),

            costos:
                Number(costos),

            tiempoRespuesta:
                Number(tiempoRespuesta),

            incidencias:
                Number(incidencias)

        }


        try {

            const respuesta = await fetch(
                'http://localhost:8000/ia/analizar',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(datosEvaluacion)
                }
            )


            if (!respuesta.ok) {

                throw new Error(
                    'Error al comunicarse con la API de IA'
                )

            }


            const resultado = await respuesta.json()

            console.log(
                'Resultado de la IA:',
                resultado
            )

            return resultado


        } catch (error) {

            console.error(
                'Error al analizar con IA:',
                error
            )

            throw error

        }

    }


    // ==========================================
    // GUARDAR EVALUACIÓN
    // ==========================================

    const guardarEvaluacion = async (e) => {

        e.preventDefault()


        try {

            // Primero analizamos con la IA
            const resultadoIA = await analizarConIA()


            // Creamos la evaluación que se guardará
            const nuevaEvaluacion = {

                idProveedor:
                    Number(idProveedor),

                cumplimientoEntregas:
                    Number(cumplimientoEntregas),

                calidad:
                    Number(calidad),

                costos:
                    Number(costos),

                tiempoRespuesta:
                    Number(tiempoRespuesta),

                incidencias:
                    Number(incidencias),

                // Resultado obtenido de la IA
                calificacionFinal:
                    Number(resultadoIA.calificacion),

                clasificacion:
                    resultadoIA.clasificacion,

                // NUEVO: recomendación generada por la IA
                recomendacion:
                    resultadoIA.recomendacion

            }


            console.log(
                'Evaluación que se enviará al backend:',
                nuevaEvaluacion
            )


            const respuesta = await fetch(
                'http://localhost:8080/api/evaluaciones',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(nuevaEvaluacion)
                }
            )


            if (!respuesta.ok) {

                throw new Error(
                    'Error al guardar la evaluación'
                )

            }


            alert(
                'Evaluación registrada correctamente'
            )


            navigate('/evaluaciones')


        } catch (error) {

            console.error(
                'Error:',
                error
            )

            alert(
                'No se pudo registrar la evaluación'
            )

        }

    }


    return (

        <div style={{
            padding: '30px'
        }}>


            {/* ENCABEZADO */}

            <h1>
                Nueva evaluación
            </h1>


            <p style={{
                color: '#777',
                marginBottom: '25px'
            }}>
                Registra el desempeño de un proveedor.
            </p>


            <form
                onSubmit={guardarEvaluacion}
                style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '15px',
                    maxWidth: '650px',
                    boxShadow:
                        '0 4px 12px rgba(0,0,0,0.08)'
                }}
            >


                {/* PROVEEDOR */}

                <div style={{
                    marginBottom: '25px'
                }}>

                    <label>

                        <strong>
                            Proveedor
                        </strong>

                    </label>


                    <select
                        value={idProveedor}
                        onChange={(e) =>
                            setIdProveedor(e.target.value)
                        }
                        required
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginTop: '8px',
                            borderRadius: '8px',
                            border: '1px solid #ddd',
                            fontSize: '14px'
                        }}
                    >

                        <option value="">
                            Selecciona un proveedor
                        </option>


                        {proveedores.map((proveedor) => (

                            <option
                                key={proveedor.idProveedor}
                                value={proveedor.idProveedor}
                            >

                                {proveedor.nombre}

                            </option>

                        ))}

                    </select>

                </div>


                {/* INDICADORES */}

                <CampoEvaluacion
                    nombre="Cumplimiento de entregas"
                    valor={cumplimientoEntregas}
                    cambiarValor={setCumplimientoEntregas}
                    peso="25%"
                />


                <CampoEvaluacion
                    nombre="Calidad"
                    valor={calidad}
                    cambiarValor={setCalidad}
                    peso="25%"
                />


                <CampoEvaluacion
                    nombre="Costos"
                    valor={costos}
                    cambiarValor={setCostos}
                    peso="20%"
                />


                <CampoEvaluacion
                    nombre="Tiempo de respuesta"
                    valor={tiempoRespuesta}
                    cambiarValor={setTiempoRespuesta}
                    peso="15%"
                />


                <CampoEvaluacion
                    nombre="Incidencias"
                    valor={incidencias}
                    cambiarValor={setIncidencias}
                    peso="15%"
                />


                {/* RESULTADO */}

                <div style={{
                    marginTop: '30px',
                    padding: '25px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '1px solid #e5e7eb'
                }}>

                    <span style={{
                        display: 'block',
                        fontSize: '13px',
                        color: '#777',
                        marginBottom: '8px'
                    }}>

                        CALIFICACIÓN ESTIMADA

                    </span>


                    <strong style={{
                        display: 'block',
                        fontSize: '42px'
                    }}>

                        {calificacionActual}

                    </strong>


                    <span style={{

                        display: 'inline-block',

                        marginTop: '8px',

                        backgroundColor:
                            clasificacionActual === 'Excelente'
                                ? '#dcfce7'
                                : clasificacionActual === 'Bueno'
                                    ? '#dbeafe'
                                    : clasificacionActual === 'Regular'
                                        ? '#fef3c7'
                                        : '#fee2e2',

                        color:
                            clasificacionActual === 'Excelente'
                                ? '#166534'
                                : clasificacionActual === 'Bueno'
                                    ? '#1e40af'
                                    : clasificacionActual === 'Regular'
                                        ? '#92400e'
                                        : '#991b1b',

                        padding: '7px 15px',

                        borderRadius: '20px',

                        fontWeight: 'bold'

                    }}>

                        {clasificacionActual}

                    </span>

                </div>


                {/* BOTONES */}

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '25px'
                }}>


                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >

                        Guardar evaluación

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate('/evaluaciones')
                        }
                        style={{
                            backgroundColor: '#e5e7eb',
                            color: '#333',
                            border: 'none',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >

                        Cancelar

                    </button>


                </div>


            </form>

        </div>

    )
}


// ==========================================
// COMPONENTE DE CADA INDICADOR
// ==========================================

function CampoEvaluacion({
    nombre,
    valor,
    cambiarValor,
    peso
}) {

    return (

        <div style={{
            marginBottom: '22px'
        }}>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>

                <label>

                    <strong>
                        {nombre}
                    </strong>

                </label>


                <span style={{
                    fontSize: '13px',
                    color: '#777'
                }}>

                    Peso: {peso}

                </span>

            </div>


            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginTop: '8px'
            }}>


                <input
                    type="range"
                    min="0"
                    max="100"
                    value={valor}
                    onChange={(e) =>
                        cambiarValor(e.target.value)
                    }
                    style={{
                        flex: 1
                    }}
                    required
                />


                <strong style={{
                    minWidth: '45px',
                    textAlign: 'right'
                }}>

                    {valor || 0}%

                </strong>


            </div>

        </div>

    )
}


export default NuevaEvaluacion