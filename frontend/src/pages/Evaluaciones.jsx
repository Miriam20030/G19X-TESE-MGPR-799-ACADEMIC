
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Evaluaciones() {

    const navigate = useNavigate()

    const [evaluaciones, setEvaluaciones] = useState([])
    const [proveedores, setProveedores] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [filtro, setFiltro] = useState('Todas')

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
                throw new Error(
                    'Error al obtener los datos'
                )
            }

            const datosEvaluaciones =
                await respuestaEvaluaciones.json()

            const datosProveedores =
                await respuestaProveedores.json()

            setEvaluaciones(datosEvaluaciones)
            setProveedores(datosProveedores)

        } catch (error) {
            console.error(
                'Error al obtener datos:',
                error
            )
        }
    }


    // ==========================================
    // PROVEEDOR
    // ==========================================

    const obtenerNombreProveedor = (idProveedor) => {

        const proveedor = proveedores.find(
            (p) =>
                p.idProveedor === idProveedor
        )

        return proveedor
            ? proveedor.nombre
            : 'Proveedor no encontrado'
    }


    // ==========================================
    // COLORES
    // ==========================================

    const obtenerEstiloClasificacion = (
        clasificacion
    ) => {

        if (clasificacion === 'Excelente') {
            return {
                fondo: '#ecfdf5',
                texto: '#047857',
                borde: '#a7f3d0',
                barra: '#10b981'
            }
        }

        if (clasificacion === 'Bueno') {
            return {
                fondo: '#eff6ff',
                texto: '#1d4ed8',
                borde: '#bfdbfe',
                barra: '#3b82f6'
            }
        }

        if (clasificacion === 'Regular') {
            return {
                fondo: '#fffbeb',
                texto: '#b45309',
                borde: '#fde68a',
                barra: '#f59e0b'
            }
        }

        return {
            fondo: '#fef2f2',
            texto: '#b91c1c',
            borde: '#fecaca',
            barra: '#ef4444'
        }
    }


    // ==========================================
    // ESTADÍSTICAS
    // ==========================================

    const estadisticas = useMemo(() => {

        const total = evaluaciones.length

        if (total === 0) {
            return {
                total: 0,
                promedio: '0.00',
                excelentes: 0,
                riesgo: 0
            }
        }

        const suma =
            evaluaciones.reduce(
                (totalActual, evaluacion) =>
                    totalActual +
                    Number(
                        evaluacion.calificacionFinal
                    ),
                0
            )

        const excelentes =
            evaluaciones.filter(
                (evaluacion) =>
                    evaluacion.clasificacion ===
                    'Excelente'
            ).length

        const riesgo =
            evaluaciones.filter(
                (evaluacion) =>
                    evaluacion.clasificacion ===
                    'Riesgo'
            ).length

        return {
            total,
            promedio: (
                suma / total
            ).toFixed(1),
            excelentes,
            riesgo
        }

    }, [evaluaciones])


    // ==========================================
    // FILTROS
    // ==========================================

    const evaluacionesFiltradas =
        useMemo(() => {

            return evaluaciones.filter(
                (evaluacion) => {

                    const nombre =
                        obtenerNombreProveedor(
                            evaluacion.idProveedor
                        )

                    const textoBusqueda =
                        busqueda
                            .toLowerCase()
                            .trim()

                    const coincideBusqueda =
                        nombre
                            .toLowerCase()
                            .includes(
                                textoBusqueda
                            )

                    const coincideFiltro =
                        filtro === 'Todas' ||
                        evaluacion.clasificacion ===
                            filtro

                    return (
                        coincideBusqueda &&
                        coincideFiltro
                    )
                }
            )

        }, [
            evaluaciones,
            proveedores,
            busqueda,
            filtro
        ])


    return (

        <div
            style={{
                minHeight: '100vh',
                background: '#f5f7fb',
                padding: '28px 32px',
                boxSizing: 'border-box'
            }}
        >

            {/* ==========================================
                ENCABEZADO
            ========================================== */}

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '24px',
                    flexWrap: 'wrap'
                }}
            >

                <div>

                    <h1
                        style={{
                            margin: 0,
                            color: '#111827',
                            fontSize: '27px',
                            fontWeight: '800',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Evaluación de Proveedores
                    </h1>

                    <p
                        style={{
                            margin:
                                '6px 0 0',
                            color: '#6b7280',
                            fontSize: '14px'
                        }}
                    >
                        Consulta y analiza el desempeño
                        de tus proveedores.
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate(
                            '/nueva-evaluacion'
                        )
                    }
                    style={{
                        border: 'none',
                        background:
                            '#2563eb',
                        color: 'white',
                        padding:
                            '11px 17px',
                        borderRadius: '9px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow:
                            '0 4px 10px rgba(37,99,235,0.20)'
                    }}
                >
                    Nueva evaluación
                </button>

            </div>


            {/* ==========================================
                RESUMEN
            ========================================== */}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(4, minmax(0, 1fr))',
                    gap: '12px',
                    marginBottom: '20px'
                }}
            >

                <Resumen
                    titulo="Evaluaciones"
                    valor={estadisticas.total}
                    descripcion="Total registradas"
                />

                <Resumen
                    titulo="Promedio"
                    valor={estadisticas.promedio}
                    descripcion="Calificación general"
                />

                <Resumen
                    titulo="Excelentes"
                    valor={estadisticas.excelentes}
                    descripcion="Alto desempeño"
                />

                <Resumen
                    titulo="En riesgo"
                    valor={estadisticas.riesgo}
                    descripcion="Requieren atención"
                />

            </div>


            {/* ==========================================
                BUSCADOR
            ========================================== */}

            <div
                style={{
                    background: 'white',
                    border:
                        '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '13px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow:
                        '0 2px 8px rgba(0,0,0,0.03)'
                }}
            >

                <input
                    type="text"
                    placeholder="Buscar proveedor..."
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(
                            e.target.value
                        )
                    }
                    style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '13px',
                        color: '#374151',
                        background:
                            'transparent'
                    }}
                />


                <select
                    value={filtro}
                    onChange={(e) =>
                        setFiltro(
                            e.target.value
                        )
                    }
                    style={{
                        border:
                            '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding:
                            '8px 10px',
                        fontSize: '12px',
                        color: '#374151',
                        background:
                            'white',
                        cursor: 'pointer'
                    }}
                >

                    <option value="Todas">
                        Todas
                    </option>

                    <option value="Excelente">
                        Excelente
                    </option>

                    <option value="Bueno">
                        Bueno
                    </option>

                    <option value="Regular">
                        Regular
                    </option>

                    <option value="Riesgo">
                        Riesgo
                    </option>

                </select>

            </div>


            {/* ==========================================
                RESULTADOS
            ========================================== */}

            <div
                style={{
                    display: 'flex',
                    justifyContent:
                        'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                }}
            >

                <span
                    style={{
                        fontSize: '12px',
                        color: '#6b7280'
                    }}
                >
                    {evaluacionesFiltradas.length}{' '}
                    evaluación(es)
                </span>

            </div>


            {evaluaciones.length === 0 ? (

                <EstadoVacio
                    titulo="No hay evaluaciones registradas"
                    descripcion="Crea una nueva evaluación para comenzar."
                    boton={true}
                    onClick={() =>
                        navigate(
                            '/nueva-evaluacion'
                        )
                    }
                />

            ) : evaluacionesFiltradas.length === 0 ? (

                <EstadoVacio
                    titulo="No se encontraron resultados"
                    descripcion="Prueba con otro proveedor o clasificación."
                />

            ) : (

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fill, minmax(285px, 1fr))',
                        gap: '14px',
                        alignItems: 'start'
                    }}
                >

                    {evaluacionesFiltradas.map(
                        (evaluacion) => {

                            const estilo =
                                obtenerEstiloClasificacion(
                                    evaluacion.clasificacion
                                )

                            return (

                                <TarjetaEvaluacion
                                    key={
                                        evaluacion.idEvaluacion
                                    }
                                    evaluacion={
                                        evaluacion
                                    }
                                    nombreProveedor={
                                        obtenerNombreProveedor(
                                            evaluacion.idProveedor
                                        )
                                    }
                                    estilo={
                                        estilo
                                    }
                                />

                            )
                        }
                    )}

                </div>

            )}

        </div>
    )
}


// ==========================================
// RESUMEN
// ==========================================

function Resumen({
    titulo,
    valor,
    descripcion
}) {

    return (

        <div
            style={{
                background: 'white',
                border:
                    '1px solid #e5e7eb',
                borderRadius: '11px',
                padding:
                    '15px 17px',
                minWidth: 0
            }}
        >

            <span
                style={{
                    display: 'block',
                    fontSize: '11px',
                    color: '#6b7280',
                    fontWeight: '600',
                    marginBottom: '5px'
                }}
            >
                {titulo}
            </span>

            <strong
                style={{
                    display: 'block',
                    color: '#111827',
                    fontSize: '23px',
                    lineHeight: '1.1'
                }}
            >
                {valor}
            </strong>

            <span
                style={{
                    display: 'block',
                    marginTop: '4px',
                    color: '#9ca3af',
                    fontSize: '10px'
                }}
            >
                {descripcion}
            </span>

        </div>
    )
}


// ==========================================
// TARJETA DE EVALUACIÓN
// ==========================================

function TarjetaEvaluacion({
    evaluacion,
    nombreProveedor,
    estilo
}) {

    return (

        <div
            style={{
                background: 'white',
                border:
                    '1px solid #e5e7eb',
                borderRadius: '13px',
                padding: '16px',
                boxShadow:
                    '0 3px 10px rgba(15,23,42,0.05)',
                minWidth: 0
            }}
        >

            {/* CABECERA */}

            <div
                style={{
                    display: 'flex',
                    justifyContent:
                        'space-between',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '12px'
                }}
            >

                <div
                    style={{
                        minWidth: 0
                    }}
                >

                    <span
                        style={{
                            display: 'block',
                            color: '#9ca3af',
                            fontSize: '9px',
                            fontWeight: '700',
                            textTransform:
                                'uppercase',
                            marginBottom: '4px'
                        }}
                    >
                        Evaluación #
                        {
                            evaluacion.idEvaluacion
                        }
                    </span>

                    <h2
                        style={{
                            margin: 0,
                            color: '#111827',
                            fontSize: '16px',
                            fontWeight: '750',
                            overflow: 'hidden',
                            textOverflow:
                                'ellipsis',
                            whiteSpace:
                                'nowrap'
                        }}
                        title={nombreProveedor}
                    >
                        {nombreProveedor}
                    </h2>

                </div>


                <span
                    style={{
                        flexShrink: 0,
                        background:
                            estilo.fondo,
                        color:
                            estilo.texto,
                        border:
                            `1px solid ${estilo.borde}`,
                        padding:
                            '4px 8px',
                        borderRadius:
                            '20px',
                        fontSize: '9px',
                        fontWeight: '800'
                    }}
                >
                    {evaluacion.clasificacion}
                </span>

            </div>


            {/* CALIFICACIÓN */}

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                        'space-between',
                    padding:
                        '11px 13px',
                    borderRadius: '9px',
                    background:
                        estilo.fondo,
                    border:
                        `1px solid ${estilo.borde}`,
                    marginBottom: '14px'
                }}
            >

                <div>

                    <span
                        style={{
                            display: 'block',
                            color:
                                estilo.texto,
                            fontSize: '9px',
                            fontWeight: '700',
                            textTransform:
                                'uppercase'
                        }}
                    >
                        Calificación
                    </span>

                    <span
                        style={{
                            display: 'block',
                            color:
                                estilo.texto,
                            fontSize: '9px',
                            marginTop: '2px'
                        }}
                    >
                        Sobre 100 puntos
                    </span>

                </div>


                <strong
                    style={{
                        color:
                            estilo.texto,
                        fontSize: '27px',
                        lineHeight: 1
                    }}
                >
                    {
                        evaluacion.calificacionFinal
                    }
                </strong>

            </div>


            {/* INDICADORES */}

            <div
                style={{
                    display: 'flex',
                    flexDirection:
                        'column',
                    gap: '10px'
                }}
            >

                <IndicadorCompacto
                    nombre="Cumplimiento"
                    valor={
                        evaluacion.cumplimientoEntregas
                    }
                />

                <IndicadorCompacto
                    nombre="Calidad"
                    valor={
                        evaluacion.calidad
                    }
                />

                <IndicadorCompacto
                    nombre="Costos"
                    valor={
                        evaluacion.costos
                    }
                />

                <IndicadorCompacto
                    nombre="Tiempo de respuesta"
                    valor={
                        evaluacion.tiempoRespuesta
                    }
                />

                <IndicadorCompacto
                    nombre="Incidencias"
                    valor={
                        evaluacion.incidencias
                    }
                />

            </div>


            {/* IA */}

            <div
                style={{
                    marginTop: '14px',
                    padding: '11px',
                    background:
                        '#f8fafc',
                    border:
                        '1px solid #e2e8f0',
                    borderRadius: '9px'
                }}
            >

                <div
                    style={{
                        display: 'flex',
                        alignItems:
                            'center',
                        justifyContent:
                            'space-between',
                        marginBottom: '5px'
                    }}
                >

                    <strong
                        style={{
                            color: '#334155',
                            fontSize: '10px',
                            textTransform:
                                'uppercase',
                            letterSpacing:
                                '0.3px'
                        }}
                    >
                        Análisis de IA
                    </strong>

                    <span
                        style={{
                            color: '#64748b',
                            fontSize: '9px'
                        }}
                    >
                        Inteligente
                    </span>

                </div>


                <p
                    style={{
                        margin: 0,
                        color: '#64748b',
                        fontSize: '10px',
                        lineHeight: '1.5',
                        display:
                            '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient:
                            'vertical',
                        overflow: 'hidden'
                    }}
                    title={
                        evaluacion.recomendacion ||
                        ''
                    }
                >
                    {
                        evaluacion.recomendacion
                            ? evaluacion.recomendacion
                            : 'No hay una recomendación disponible.'
                    }
                </p>

            </div>

        </div>
    )
}


// ==========================================
// INDICADOR COMPACTO
// ==========================================

function IndicadorCompacto({
    nombre,
    valor
}) {

    const numero =
        Number(valor) || 0

    let color = '#3b82f6'

    if (numero >= 90) {
        color = '#10b981'
    } else if (numero >= 80) {
        color = '#3b82f6'
    } else if (numero >= 70) {
        color = '#f59e0b'
    } else {
        color = '#ef4444'
    }

    return (

        <div>

            <div
                style={{
                    display: 'flex',
                    justifyContent:
                        'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                }}
            >

                <span
                    style={{
                        color: '#64748b',
                        fontSize: '10px'
                    }}
                >
                    {nombre}
                </span>

                <strong
                    style={{
                        color: '#374151',
                        fontSize: '10px'
                    }}
                >
                    {numero}%
                </strong>

            </div>


            <div
                style={{
                    width: '100%',
                    height: '5px',
                    background:
                        '#e5e7eb',
                    borderRadius: '10px',
                    overflow: 'hidden'
                }}
            >

                <div
                    style={{
                        width:
                            `${Math.min(
                                Math.max(
                                    numero,
                                    0
                                ),
                                100
                            )}%`,
                        height: '100%',
                        background:
                            color,
                        borderRadius:
                            '10px'
                    }}
                />

            </div>

        </div>
    )
}


// ==========================================
// ESTADO VACÍO
// ==========================================

function EstadoVacio({
    titulo,
    descripcion,
    boton,
    onClick
}) {

    return (

        <div
            style={{
                background: 'white',
                border:
                    '1px solid #e5e7eb',
                borderRadius: '13px',
                padding: '45px 25px',
                textAlign: 'center'
            }}
        >

            <h3
                style={{
                    margin:
                        '0 0 7px',
                    color: '#1f2937',
                    fontSize: '16px'
                }}
            >
                {titulo}
            </h3>

            <p
                style={{
                    margin:
                        '0 0 18px',
                    color: '#6b7280',
                    fontSize: '12px'
                }}
            >
                {descripcion}
            </p>

            {boton && (

                <button
                    onClick={onClick}
                    style={{
                        border: 'none',
                        background:
                            '#2563eb',
                        color: 'white',
                        padding:
                            '9px 15px',
                        borderRadius:
                            '8px',
                        cursor:
                            'pointer',
                        fontSize:
                            '12px',
                        fontWeight:
                            '700'
                    }}
                >
                    Nueva evaluación
                </button>

            )}

        </div>
    )
}


export default Evaluaciones
