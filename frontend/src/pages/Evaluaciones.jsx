import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NuevaEvaluacion from './NuevaEvaluacion'

function Evaluaciones() {

    const navigate = useNavigate()

    const [evaluaciones, setEvaluaciones] = useState([])
    const [proveedores, setProveedores] = useState([])
    const [cargando, setCargando] = useState(true)

    const [filtroProveedor, setFiltroProveedor] = useState('')
    const [filtroClasificacion, setFiltroClasificacion] = useState('')

    const [mostrarNuevaEvaluacion, setMostrarNuevaEvaluacion] = useState(false)

    // =========================================================
    // OBTENER DATOS
    // =========================================================

    useEffect(() => {
        obtenerDatos()
    }, [])

    const obtenerDatos = async () => {

        try {

            const [
                respuestaEvaluaciones,
                respuestaProveedores
            ] = await Promise.all([

                fetch(
                    'http://localhost:8080/api/evaluaciones'
                ),

                fetch(
                    'http://localhost:8080/api/proveedores'
                )

            ])

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
                'Error:',
                error
            )

        } finally {

            setCargando(false)

        }

    }

    // =========================================================
    // OBTENER NOMBRE DEL PROVEEDOR
    // =========================================================

    const obtenerNombreProveedor = (idProveedor) => {

        const proveedor = proveedores.find(
            p =>
                Number(p.idProveedor) ===
                Number(idProveedor)
        )

        return proveedor
            ? proveedor.nombre
            : `Proveedor #${idProveedor}`

    }

    // =========================================================
    // ESTILO DE CLASIFICACIÓN
    // =========================================================

    const obtenerEstiloClasificacion = (clasificacion) => {

        const valor =
            (clasificacion || '').toLowerCase()

        if (valor === 'excelente') {

            return {
                clase: 'clasificacion-excelente',
                texto: 'Excelente'
            }

        }

        if (valor === 'bueno') {

            return {
                clase: 'clasificacion-bueno',
                texto: 'Bueno'
            }

        }

        if (valor === 'regular') {

            return {
                clase: 'clasificacion-regular',
                texto: 'Regular'
            }

        }

        return {
            clase: 'clasificacion-riesgo',
            texto: 'Riesgo'
        }

    }

    // =========================================================
    // INDICADOR COMPACTO
    // =========================================================

    const IndicadorCompacto = ({ nombre, valor }) => {

        let clase = 'bajo'

        if (valor >= 90) {

            clase = 'alto'

        } else if (valor >= 80) {

            clase = 'bueno'

        } else if (valor >= 70) {

            clase = 'regular'

        }

        return (

            <div className="indicador-compacto">

                <div className="indicador-header">

                    <span className="indicador-nombre">
                        {nombre}
                    </span>

                    <span className="indicador-valor">
                        {valor}%
                    </span>

                </div>

                <div className="indicador-progress">

                    <div
                        className={
                            `indicador-progress-bar ${clase}`
                        }
                        style={{
                            width:
                                `${Math.min(
                                    Math.max(valor, 0),
                                    100
                                )}%`
                        }}
                    />

                </div>

            </div>

        )

    }

    // =========================================================
    // ESTADÍSTICAS
    // =========================================================

    const estadisticas = useMemo(() => {

        const total = evaluaciones.length

        if (total === 0) {

            return {
                total: 0,
                promedio: 0,
                excelentes: 0,
                riesgo: 0
            }

        }

        const suma = evaluaciones.reduce(
            (acumulado, evaluacion) =>
                acumulado +
                Number(
                    evaluacion.calificacionFinal || 0
                ),
            0
        )

        const excelentes =
            evaluaciones.filter(
                evaluacion =>
                    (
                        evaluacion.clasificacion || ''
                    ).toLowerCase() === 'excelente'
            ).length

        const riesgo =
            evaluaciones.filter(
                evaluacion =>
                    (
                        evaluacion.clasificacion || ''
                    ).toLowerCase() === 'riesgo'
            ).length

        return {

            total,

            promedio:
                (suma / total).toFixed(1),

            excelentes,

            riesgo

        }

    }, [evaluaciones])

    // =========================================================
    // FILTRAR EVALUACIONES
    // =========================================================

    const evaluacionesFiltradas = useMemo(() => {

        return evaluaciones.filter(
            evaluacion => {

                const coincideProveedor =
                    filtroProveedor === '' ||
                    String(
                        evaluacion.idProveedor
                    ) ===
                    String(
                        filtroProveedor
                    )

                const coincideClasificacion =
                    filtroClasificacion === '' ||
                    (
                        evaluacion.clasificacion || ''
                    ).toLowerCase() ===
                    filtroClasificacion.toLowerCase()

                return (
                    coincideProveedor &&
                    coincideClasificacion
                )

            }
        )

    }, [
        evaluaciones,
        filtroProveedor,
        filtroClasificacion
    ])

    // =========================================================
    // FECHA
    // =========================================================

    const formatearFecha = (fecha) => {

        if (!fecha) {

            return 'Sin fecha'

        }

        const fechaObj =
            new Date(fecha)

        if (
            isNaN(
                fechaObj.getTime()
            )
        ) {

            return fecha

        }

        return fechaObj.toLocaleDateString(
            'es-MX',
            {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }
        )

    }

    // =========================================================
    // CERRAR NUEVA EVALUACIÓN
    // =========================================================

    const cerrarNuevaEvaluacion = () => {

        setMostrarNuevaEvaluacion(false)

    }

    // =========================================================
    // EVALUACIÓN GUARDADA
    // =========================================================

    const evaluacionGuardada = async () => {

        setMostrarNuevaEvaluacion(false)

        setCargando(true)

        await obtenerDatos()

    }

    // =========================================================
    // CARGANDO
    // =========================================================

    if (cargando) {

        return (

            <div className="evaluaciones-page">

                <div className="evaluaciones-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Cargando evaluaciones...
                    </p>

                </div>

                <style>{`

                    .evaluaciones-page {

                        min-height: 100vh;

                        padding: 28px;

                        background: var(--ev-bg);

                        color: var(--ev-text);

                    }

                    .evaluaciones-loading {

                        min-height: 60vh;

                        display: flex;

                        flex-direction: column;

                        align-items: center;

                        justify-content: center;

                        gap: 12px;

                        color: var(--ev-muted);

                    }

                    .loading-spinner {

                        width: 30px;

                        height: 30px;

                        border: 3px solid var(--ev-border);

                        border-top-color:
                            var(--ev-primary);

                        border-radius: 50%;

                        animation:
                            ev-spin
                            0.8s
                            linear
                            infinite;

                    }

                    @keyframes ev-spin {

                        to {
                            transform: rotate(360deg);
                        }

                    }

                `}</style>

            </div>

        )

    }

    return (

        <div className="evaluaciones-page">

            {/* =====================================================
                ENCABEZADO
            ====================================================== */}

            <div className="evaluaciones-header">

                <div className="evaluaciones-header-text">

                    <h1>
                        Evaluaciones de proveedores
                    </h1>

                    <p>
                        Consulta el desempeño y las evaluaciones realizadas a cada proveedor.
                    </p>

                </div>

                <button
                    className="btn-nueva-evaluacion-top"
                    onClick={() =>
                        setMostrarNuevaEvaluacion(true)
                    }
                >
                    Nueva evaluación
                </button>

            </div>

            {/* =====================================================
                ESTADÍSTICAS
            ====================================================== */}

            <div className="estadisticas-grid">

                <div className="estadistica-card">

                    <span className="estadistica-label">
                        Total evaluaciones
                    </span>

                    <strong className="estadistica-valor">
                        {estadisticas.total}
                    </strong>

                </div>

                <div className="estadistica-card">

                    <span className="estadistica-label">
                        Promedio general
                    </span>

                    <strong className="estadistica-valor">
                        {estadisticas.promedio}
                    </strong>

                    <span className="estadistica-extra">
                        sobre 100
                    </span>

                </div>

                <div className="estadistica-card">

                    <span className="estadistica-label">
                        Excelentes
                    </span>

                    <strong
                        className="
                            estadistica-valor
                            estadistica-verde
                        "
                    >
                        {estadisticas.excelentes}
                    </strong>

                </div>

                <div className="estadistica-card">

                    <span className="estadistica-label">
                        En riesgo
                    </span>

                    <strong
                        className="
                            estadistica-valor
                            estadistica-rojo
                        "
                    >
                        {estadisticas.riesgo}
                    </strong>

                </div>

            </div>

            {/* =====================================================
                FILTROS
            ====================================================== */}

            <div className="filtros-container">

                <div className="filtro-grupo">

                    <label>
                        Proveedor
                    </label>

                    <select
                        value={filtroProveedor}
                        onChange={(e) =>
                            setFiltroProveedor(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Todos los proveedores
                        </option>

                        {proveedores.map(
                            proveedor => (

                                <option
                                    key={
                                        proveedor.idProveedor
                                    }
                                    value={
                                        proveedor.idProveedor
                                    }
                                >
                                    {proveedor.nombre}
                                </option>

                            )
                        )}

                    </select>

                </div>

                <div className="filtro-grupo">

                    <label>
                        Clasificación
                    </label>

                    <select
                        value={filtroClasificacion}
                        onChange={(e) =>
                            setFiltroClasificacion(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Todas
                        </option>

                        <option value="excelente">
                            Excelente
                        </option>

                        <option value="bueno">
                            Bueno
                        </option>

                        <option value="regular">
                            Regular
                        </option>

                        <option value="riesgo">
                            Riesgo
                        </option>

                    </select>

                </div>

            </div>

            {/* =====================================================
                LISTA DE EVALUACIONES
            ====================================================== */}

            <div className="evaluaciones-lista">

                {evaluacionesFiltradas.length === 0 ? (

                    <div className="sin-evaluaciones">

                        <h3>
                            No hay evaluaciones
                        </h3>

                        <p>
                            No se encontraron evaluaciones con los filtros seleccionados.
                        </p>

                    </div>

                ) : (

                    evaluacionesFiltradas.map(
                        evaluacion => {

                            const estilo =
                                obtenerEstiloClasificacion(
                                    evaluacion.clasificacion
                                )

                            return (

                                <div
                                    className="evaluacion-card"
                                    key={
                                        evaluacion.idEvaluacion
                                    }
                                >

                                    {/* =====================================
                                        CABECERA
                                    ====================================== */}

                                    <div
                                        className="
                                            evaluacion-card-header
                                        "
                                    >

                                        <div
                                            className="
                                                evaluacion-proveedor
                                            "
                                        >

                                            <h3>
                                                {
                                                    obtenerNombreProveedor(
                                                        evaluacion.idProveedor
                                                    )
                                                }
                                            </h3>

                                            <span
                                                className="
                                                    evaluacion-fecha
                                                "
                                            >
                                                Evaluación realizada el{' '}
                                                {
                                                    formatearFecha(
                                                        evaluacion.fechaEvaluacion
                                                    )
                                                }
                                            </span>

                                        </div>

                                        <span
                                            className={
                                                `
                                                clasificacion-badge
                                                ${estilo.clase}
                                                `
                                            }
                                        >
                                            {estilo.texto}
                                        </span>

                                    </div>

                                    {/* =====================================
                                        CONTENIDO
                                    ====================================== */}

                                    <div
                                        className="
                                            evaluacion-contenido
                                        "
                                    >

                                        {/* CALIFICACIÓN */}

                                        <div
                                            className="
                                                calificacion-final
                                            "
                                        >

                                            <span className="numero">

                                                {Number(
                                                    evaluacion.calificacionFinal || 0
                                                ).toFixed(1)}

                                            </span>

                                            <span className="texto">
                                                Calificación final
                                            </span>

                                        </div>

                                        {/* INDICADORES */}

                                        <div
                                            className="
                                                indicadores-grid
                                            "
                                        >

                                            <IndicadorCompacto
                                                nombre="Entregas"
                                                valor={Number(
                                                    evaluacion.cumplimientoEntregas || 0
                                                )}
                                            />

                                            <IndicadorCompacto
                                                nombre="Calidad"
                                                valor={Number(
                                                    evaluacion.calidad || 0
                                                )}
                                            />

                                            <IndicadorCompacto
                                                nombre="Costos"
                                                valor={Number(
                                                    evaluacion.costos || 0
                                                )}
                                            />

                                            <IndicadorCompacto
                                                nombre="Respuesta"
                                                valor={Number(
                                                    evaluacion.tiempoRespuesta || 0
                                                )}
                                            />

                                            <IndicadorCompacto
                                                nombre="Incidencias"
                                                valor={Number(
                                                    evaluacion.incidencias || 0
                                                )}
                                            />

                                        </div>

                                    </div>

                                    {/* =====================================
                                        RECOMENDACIÓN IA
                                    ====================================== */}

                                    {evaluacion.recomendacion && (

                                        <div
                                            className="
                                                recomendacion-ia
                                            "
                                        >

                                            <h4>
                                                Recomendación de IA
                                            </h4>

                                            <p>
                                                {
                                                    evaluacion.recomendacion
                                                }
                                            </p>

                                        </div>

                                    )}

                                    {/* =====================================
                                        ACCIONES
                                    ====================================== */}

                                    

                                </div>

                            )

                        }
                    )

                )}

            </div>

            

            {/* =====================================================
                MODAL NUEVA EVALUACIÓN
            ====================================================== */}

            {mostrarNuevaEvaluacion && (

                <div
                    className="modal-overlay"
                    onClick={cerrarNuevaEvaluacion}
                >

                    <div
                        className="modal-nueva-evaluacion"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="modal-cerrar"
                            onClick={
                                cerrarNuevaEvaluacion
                            }
                            aria-label="Cerrar"
                        >
                            ×
                        </button>

                        <NuevaEvaluacion
                            proveedores={proveedores}
                            onCancelar={
                                cerrarNuevaEvaluacion
                            }
                            onGuardado={
                                evaluacionGuardada
                            }
                        />

                    </div>

                </div>

            )}

            {/* =====================================================
                ESTILOS
            ====================================================== */}

            <style>{`

                /* =====================================================
                   VARIABLES
                ====================================================== */

                .evaluaciones-page {

                    --ev-bg: #f5f7fb;
                    --ev-card: #ffffff;
                    --ev-soft: #f8fafc;
                    --ev-border: #e2e8f0;

                    --ev-text: #1e293b;
                    --ev-muted: #64748b;

                    --ev-primary: #2563eb;
                    --ev-primary-hover: #1d4ed8;

                    --ev-shadow:
                        rgba(15, 23, 42, 0.07);

                    --ev-progress-bg: #e5e7eb;

                    --ev-ai-bg: #eff6ff;
                    --ev-ai-border: #bfdbfe;
                    --ev-ai-title: #1d4ed8;

                    --ev-excelente-bg: #dcfce7;
                    --ev-excelente-text: #166534;
                    --ev-excelente-border: #bbf7d0;

                    --ev-bueno-bg: #dbeafe;
                    --ev-bueno-text: #1d4ed8;
                    --ev-bueno-border: #bfdbfe;

                    --ev-regular-bg: #fef3c7;
                    --ev-regular-text: #92400e;
                    --ev-regular-border: #fde68a;

                    --ev-riesgo-bg: #fee2e2;
                    --ev-riesgo-text: #b91c1c;
                    --ev-riesgo-border: #fecaca;

                    min-height: 100vh;

                    padding: 24px;

                    background:
                        var(--ev-bg);

                    color:
                        var(--ev-text);

                    box-sizing: border-box;

                    transition:
                        background 0.25s ease,
                        color 0.25s ease;

                }


                /* =====================================================
                   MODO OSCURO
                ====================================================== */

                body.dark .evaluaciones-page,
                body.dark-mode .evaluaciones-page,
                body[data-theme="dark"] .evaluaciones-page {

                    --ev-bg: #0f172a;
                    --ev-card: #1e293b;
                    --ev-soft: #162033;
                    --ev-border: #334155;

                    --ev-text: #f1f5f9;
                    --ev-muted: #94a3b8;

                    --ev-primary: #60a5fa;
                    --ev-primary-hover: #93c5fd;

                    --ev-shadow:
                        rgba(0, 0, 0, 0.25);

                    --ev-progress-bg:
                        #334155;

                    --ev-ai-bg:
                        #172554;

                    --ev-ai-border:
                        #1e40af;

                    --ev-ai-title:
                        #93c5fd;

                    --ev-excelente-bg:
                        #14532d;

                    --ev-excelente-text:
                        #bbf7d0;

                    --ev-excelente-border:
                        #166534;

                    --ev-bueno-bg:
                        #1e3a8a;

                    --ev-bueno-text:
                        #bfdbfe;

                    --ev-bueno-border:
                        #1d4ed8;

                    --ev-regular-bg:
                        #78350f;

                    --ev-regular-text:
                        #fde68a;

                    --ev-regular-border:
                        #92400e;

                    --ev-riesgo-bg:
                        #7f1d1d;

                    --ev-riesgo-text:
                        #fecaca;

                    --ev-riesgo-border:
                        #991b1b;

                }


                /* =====================================================
                   ENCABEZADO
                ====================================================== */

                .evaluaciones-header {

                    display: flex;

                    justify-content:
                        space-between;

                    align-items: center;

                    gap: 20px;

                    margin-bottom: 18px;

                }

                .evaluaciones-header-text {

                    flex: 1;

                }

                .evaluaciones-header h1 {

                    margin:
                        0 0 5px;

                    font-size:
                        25px;

                    font-weight:
                        700;

                    color:
                        var(--ev-text);

                }

                .evaluaciones-header p {

                    margin: 0;

                    font-size:
                        13px;

                    color:
                        var(--ev-muted);

                }


                /* =====================================================
                   BOTÓN NUEVA EVALUACIÓN
                ====================================================== */

                .btn-nueva-evaluacion-top {

                    border: none;

                    background:
                        var(--ev-primary);

                    color: white;

                    padding:
                        9px 15px;

                    border-radius:
                        7px;

                    font-size:
                        12px;

                    font-weight:
                        600;

                    cursor:
                        pointer;

                    white-space:
                        nowrap;

                    transition:
                        background 0.2s ease,
                        transform 0.2s ease;

                }

                .btn-nueva-evaluacion-top:hover {

                    background:
                        var(--ev-primary-hover);

                    transform:
                        translateY(-1px);

                }


                /* =====================================================
                   ESTADÍSTICAS PEQUEÑAS
                ====================================================== */

                .estadisticas-grid {

                    display: grid;

                    grid-template-columns:
                        repeat(
                            4,
                            minmax(0, 1fr)
                        );

                    gap:
                        10px;

                    margin-bottom:
                        16px;

                }

                .estadistica-card {

                    background:
                        var(--ev-card);

                    border:
                        1px solid
                        var(--ev-border);

                    border-radius:
                        9px;

                    padding:
                        11px 13px;

                    min-height:
                        70px;

                    box-shadow:
                        0 2px 7px
                        var(--ev-shadow);

                    box-sizing:
                        border-box;

                }

                .estadistica-label {

                    display:
                        block;

                    font-size:
                        10px;

                    color:
                        var(--ev-muted);

                    margin-bottom:
                        3px;

                }

                .estadistica-valor {

                    display:
                        inline-block;

                    font-size:
                        20px;

                    line-height:
                        1;

                    font-weight:
                        700;

                    color:
                        var(--ev-text);

                }

                .estadistica-extra {

                    display:
                        inline-block;

                    margin-left:
                        4px;

                    font-size:
                        9px;

                    color:
                        var(--ev-muted);

                }

                .estadistica-verde {

                    color:
                        #10b981;

                }

                .estadistica-rojo {

                    color:
                        #ef4444;

                }


                /* =====================================================
                   FILTROS
                ====================================================== */

                .filtros-container {

                    display:
                        flex;

                    gap:
                        12px;

                    background:
                        var(--ev-card);

                    border:
                        1px solid
                        var(--ev-border);

                    border-radius:
                        10px;

                    padding:
                        13px;

                    margin-bottom:
                        16px;

                    box-shadow:
                        0 2px 7px
                        var(--ev-shadow);

                }

                .filtro-grupo {

                    display:
                        flex;

                    flex-direction:
                        column;

                    gap:
                        4px;

                    min-width:
                        190px;

                }

                .filtro-grupo label {

                    font-size:
                        10px;

                    font-weight:
                        600;

                    color:
                        var(--ev-muted);

                }

                .filtro-grupo select {

                    width:
                        100%;

                    padding:
                        7px 9px;

                    border-radius:
                        6px;

                    border:
                        1px solid
                        var(--ev-border);

                    background:
                        var(--ev-soft);

                    color:
                        var(--ev-text);

                    font-size:
                        11px;

                    outline:
                        none;

                }

                .filtro-grupo select:focus {

                    border-color:
                        var(--ev-primary);

                }


                /* =====================================================
                   LISTA
                ====================================================== */

                .evaluaciones-lista {

                    width:
                        100%;

                }


                /* =====================================================
                   CUADRO DE EVALUACIÓN
                ====================================================== */

                .evaluacion-card {

                    background:
                        var(--ev-card);

                    border:
                        1px solid
                        var(--ev-border);

                    border-radius:
                        10px;

                    padding:
                        14px 16px;

                    margin-bottom:
                        10px;

                    box-shadow:
                        0 2px 7px
                        var(--ev-shadow);

                    transition:
                        transform 0.2s ease,
                        box-shadow 0.2s ease;

                    box-sizing:
                        border-box;

                }

                .evaluacion-card:hover {

                    transform:
                        translateY(-1px);

                    box-shadow:
                        0 4px 12px
                        var(--ev-shadow);

                }


                /* =====================================================
                   CABECERA
                ====================================================== */

                .evaluacion-card-header {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    align-items:
                        center;

                    gap:
                        12px;

                    margin-bottom:
                        10px;

                }

                .evaluacion-proveedor {

                    display:
                        flex;

                    flex-direction:
                        column;

                    gap:
                        2px;

                    min-width:
                        0;

                }

                .evaluacion-proveedor h3 {

                    margin:
                        0;

                    font-size:
                        15px;

                    font-weight:
                        650;

                    color:
                        var(--ev-text);

                }

                .evaluacion-fecha {

                    font-size:
                        10px;

                    color:
                        var(--ev-muted);

                }


                /* =====================================================
                   CLASIFICACIÓN
                ====================================================== */

                .clasificacion-badge {

                    display:
                        inline-flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    padding:
                        5px 9px;

                    border-radius:
                        999px;

                    font-size:
                        9px;

                    font-weight:
                        700;

                    border:
                        1px solid;

                    white-space:
                        nowrap;

                }

                .clasificacion-excelente {

                    background:
                        var(--ev-excelente-bg);

                    color:
                        var(--ev-excelente-text);

                    border-color:
                        var(--ev-excelente-border);

                }

                .clasificacion-bueno {

                    background:
                        var(--ev-bueno-bg);

                    color:
                        var(--ev-bueno-text);

                    border-color:
                        var(--ev-bueno-border);

                }

                .clasificacion-regular {

                    background:
                        var(--ev-regular-bg);

                    color:
                        var(--ev-regular-text);

                    border-color:
                        var(--ev-regular-border);

                }

                .clasificacion-riesgo {

                    background:
                        var(--ev-riesgo-bg);

                    color:
                        var(--ev-riesgo-text);

                    border-color:
                        var(--ev-riesgo-border);

                }


                /* =====================================================
                   CONTENIDO
                ====================================================== */

                .evaluacion-contenido {

                    display:
                        grid;

                    grid-template-columns:
                        125px 1fr;

                    gap:
                        14px;

                    align-items:
                        center;

                }


                /* =====================================================
                   CALIFICACIÓN
                ====================================================== */

                .calificacion-final {

                    display:
                        flex;

                    flex-direction:
                        column;

                    justify-content:
                        center;

                    align-items:
                        center;

                    min-height:
                        82px;

                    padding:
                        9px;

                    border-radius:
                        8px;

                    background:
                        var(--ev-soft);

                    border:
                        1px solid
                        var(--ev-border);

                    box-sizing:
                        border-box;

                }

                .calificacion-final .numero {

                    font-size:
                        25px;

                    font-weight:
                        700;

                    line-height:
                        1;

                    color:
                        var(--ev-primary);

                }

                .calificacion-final .texto {

                    font-size:
                        9px;

                    color:
                        var(--ev-muted);

                    margin-top:
                        4px;

                    text-align:
                        center;

                }


                /* =====================================================
                   INDICADORES
                ====================================================== */

                .indicadores-grid {

                    display:
                        grid;

                    grid-template-columns:
                        repeat(
                            5,
                            minmax(0, 1fr)
                        );

                    gap:
                        7px;

                }

                .indicador-compacto {

                    background:
                        var(--ev-soft);

                    border:
                        1px solid
                        var(--ev-border);

                    border-radius:
                        7px;

                    padding:
                        7px;

                    min-width:
                        0;

                    box-sizing:
                        border-box;

                }

                .indicador-header {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    align-items:
                        center;

                    gap:
                        4px;

                    margin-bottom:
                        5px;

                }

                .indicador-nombre {

                    font-size:
                        9px;

                    line-height:
                        1.2;

                    color:
                        var(--ev-muted);

                    overflow:
                        hidden;

                    text-overflow:
                        ellipsis;

                    white-space:
                        nowrap;

                }

                .indicador-valor {

                    font-size:
                        9px;

                    font-weight:
                        700;

                    color:
                        var(--ev-text);

                    white-space:
                        nowrap;

                }

                .indicador-progress {

                    width:
                        100%;

                    height:
                        4px;

                    background:
                        var(--ev-progress-bg);

                    border-radius:
                        10px;

                    overflow:
                        hidden;

                }

                .indicador-progress-bar {

                    height:
                        100%;

                    border-radius:
                        10px;

                    transition:
                        width 0.3s ease;

                }

                .indicador-progress-bar.alto {

                    background:
                        #10b981;

                }

                .indicador-progress-bar.bueno {

                    background:
                        #3b82f6;

                }

                .indicador-progress-bar.regular {

                    background:
                        #f59e0b;

                }

                .indicador-progress-bar.bajo {

                    background:
                        #ef4444;

                }


                /* =====================================================
                   RECOMENDACIÓN IA
                ====================================================== */

                .recomendacion-ia {

                    margin-top:
                        9px;

                    padding:
                        9px 11px;

                    border-radius:
                        8px;

                    background:
                        var(--ev-ai-bg);

                    border:
                        1px solid
                        var(--ev-ai-border);

                }

                .recomendacion-ia h4 {

                    margin:
                        0 0 3px;

                    font-size:
                        10px;

                    color:
                        var(--ev-ai-title);

                }

                .recomendacion-ia p {

                    margin:
                        0;

                    font-size:
                        10px;

                    line-height:
                        1.4;

                    color:
                        var(--ev-text);

                }


                /* =====================================================
                   ACCIONES
                ====================================================== */

                .evaluacion-acciones {

                    display:
                        flex;

                    justify-content:
                        flex-end;

                    gap:
                        7px;

                    margin-top:
                        9px;

                }

                .btn-ver-detalle {

                    border:
                        1px solid
                        var(--ev-border);

                    background:
                        var(--ev-soft);

                    color:
                        var(--ev-text);

                    padding:
                        6px 10px;

                    border-radius:
                        6px;

                    font-size:
                        10px;

                    font-weight:
                        600;

                    cursor:
                        pointer;

                    transition:
                        background 0.2s ease,
                        border-color 0.2s ease;

                }

                .btn-ver-detalle:hover {

                    border-color:
                        var(--ev-primary);

                    color:
                        var(--ev-primary);

                }


                /* =====================================================
                   SIN EVALUACIONES
                ====================================================== */

                .sin-evaluaciones {

                    background:
                        var(--ev-card);

                    border:
                        1px solid
                        var(--ev-border);

                    border-radius:
                        10px;

                    padding:
                        35px 20px;

                    text-align:
                        center;

                }

                .sin-evaluaciones h3 {

                    margin:
                        0 0 5px;

                    font-size:
                        15px;

                    color:
                        var(--ev-text);

                }

                .sin-evaluaciones p {

                    margin:
                        0;

                    font-size:
                        11px;

                    color:
                        var(--ev-muted);

                }


                /* =====================================================
                   BOTÓN REGRESAR
                ====================================================== */

                .acciones-finales {

                    margin-top:
                        16px;

                }

                .btn-regresar {

                    border:
                        1px solid
                        var(--ev-border);

                    background:
                        var(--ev-card);

                    color:
                        var(--ev-text);

                    padding:
                        8px 13px;

                    border-radius:
                        7px;

                    font-size:
                        11px;

                    font-weight:
                        600;

                    cursor:
                        pointer;

                    transition:
                        border-color 0.2s ease,
                        color 0.2s ease;

                }

                .btn-regresar:hover {

                    border-color:
                        var(--ev-primary);

                    color:
                        var(--ev-primary);

                }


                /* =====================================================
                   MODAL
                ====================================================== */

                .modal-overlay {

                    position:
                        fixed;

                    inset:
                        0;

                    z-index:
                        9999;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    padding:
                        20px;

                    background:
                        rgba(
                            15,
                            23,
                            42,
                            0.60
                        );

                    backdrop-filter:
                        blur(4px);

                    box-sizing:
                        border-box;

                }

                .modal-nueva-evaluacion {

                    position:
                        relative;

                    width:
                        100%;

                    max-width:
                        850px;

                    max-height:
                        92vh;

                    overflow-y:
                        auto;

                    background:
                        var(--ev-card);

                    border:
                        1px solid
                        var(--ev-border);

                    border-radius:
                        12px;

                    box-shadow:
                        0 20px 60px
                        rgba(
                            0,
                            0,
                            0,
                            0.30
                        );

                    box-sizing:
                        border-box;

                }

                .modal-cerrar {

                    position:
                        absolute;

                    top:
                        12px;

                    right:
                        14px;

                    z-index:
                        100;

                    width:
                        30px;

                    height:
                        30px;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    border:
                        1px solid
                        var(--ev-border);

                    border-radius:
                        6px;

                    background:
                        var(--ev-soft);

                    color:
                        var(--ev-text);

                    font-size:
                        20px;

                    line-height:
                        1;

                    cursor:
                        pointer;

                    transition:
                        background 0.2s ease,
                        color 0.2s ease,
                        border-color 0.2s ease;

                }

                .modal-cerrar:hover {

                    background:
                        var(--ev-riesgo-bg);

                    color:
                        var(--ev-riesgo-text);

                    border-color:
                        var(--ev-riesgo-border);

                }


                /* =====================================================
                   MODO OSCURO MODAL
                ====================================================== */

                body.dark .modal-overlay,
                body.dark-mode .modal-overlay,
                body[data-theme="dark"] .modal-overlay {

                    background:
                        rgba(
                            2,
                            6,
                            23,
                            0.72
                        );

                }


                /* =====================================================
                   RESPONSIVE
                ====================================================== */

                @media (max-width: 1000px) {

                    .indicadores-grid {

                        grid-template-columns:
                            repeat(
                                3,
                                minmax(0, 1fr)
                            );

                    }

                    .evaluacion-contenido {

                        grid-template-columns:
                            110px 1fr;

                    }

                }


                @media (max-width: 750px) {

                    .evaluaciones-page {

                        padding:
                            16px;

                    }

                    .evaluaciones-header {

                        flex-direction:
                            column;

                        align-items:
                            stretch;

                    }

                    .btn-nueva-evaluacion-top {

                        width:
                            100%;

                    }

                    .estadisticas-grid {

                        grid-template-columns:
                            repeat(
                                2,
                                minmax(0, 1fr)
                            );

                    }

                    .filtros-container {

                        flex-direction:
                            column;

                    }

                    .filtro-grupo {

                        width:
                            100%;

                        min-width:
                            0;

                    }

                    .evaluacion-contenido {

                        grid-template-columns:
                            1fr;

                    }

                    .calificacion-final {

                        min-height:
                            70px;

                    }

                    .indicadores-grid {

                        grid-template-columns:
                            repeat(
                                2,
                                minmax(0, 1fr)
                            );

                    }

                    .modal-overlay {

                        padding:
                            10px;

                    }

                    .modal-nueva-evaluacion {

                        max-height:
                            95vh;

                        border-radius:
                            10px;

                    }

                }


                @media (max-width: 450px) {

                    .estadisticas-grid {

                        grid-template-columns:
                            1fr;

                    }

                    .indicadores-grid {

                        grid-template-columns:
                            1fr;

                    }

                    .evaluacion-card-header {

                        align-items:
                            flex-start;

                        flex-direction:
                            column;

                    }

                    .clasificacion-badge {

                        align-self:
                            flex-start;

                    }

                }

            `}</style>

        </div>

    )

}

export default Evaluaciones