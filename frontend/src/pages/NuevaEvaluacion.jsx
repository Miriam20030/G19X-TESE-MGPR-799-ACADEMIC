
import { useEffect, useState } from 'react'
import ModalMensaje from '../components/ModalMensaje'

function NuevaEvaluacion({
    proveedores = [],
    onCancelar,
    onGuardado
}) {

    const [idProveedor, setIdProveedor] = useState('')
    const [busquedaProveedor, setBusquedaProveedor] = useState('')
    const [mostrarProveedores, setMostrarProveedores] = useState(false)

    const [cumplimientoEntregas, setCumplimientoEntregas] = useState(0)
    const [calidad, setCalidad] = useState(0)
    const [costos, setCostos] = useState(0)
    const [tiempoRespuesta, setTiempoRespuesta] = useState(0)
    const [incidencias, setIncidencias] = useState(0)

    const [calificacionFinal, setCalificacionFinal] = useState(0)
    const [clasificacion, setClasificacion] = useState('Riesgo')
    const [recomendacion, setRecomendacion] = useState('')

    const [guardando, setGuardando] = useState(false)


    // =========================================================
    // MODAL
    // =========================================================

    const [modal, setModal] = useState({
        abierto: false,
        tipo: 'info',
        titulo: '',
        mensaje: '',
        mostrarCancelar: false,
        textoCancelar: 'Cancelar',
        textoAceptar: 'Aceptar',
        onAceptar: null
    })


    const cerrarModal = () => {

        setModal({
            abierto: false,
            tipo: 'info',
            titulo: '',
            mensaje: '',
            mostrarCancelar: false,
            textoCancelar: 'Cancelar',
            textoAceptar: 'Aceptar',
            onAceptar: null
        })

    }


    // =========================================================
    // CALCULAR CALIFICACIÓN
    // =========================================================

    useEffect(() => {

        const resultado =
            Number(cumplimientoEntregas) * 0.25 +
            Number(calidad) * 0.25 +
            Number(costos) * 0.20 +
            Number(tiempoRespuesta) * 0.15 +
            Number(incidencias) * 0.15

        const resultadoFinal = Number(
            resultado.toFixed(2)
        )

        setCalificacionFinal(resultadoFinal)

        if (resultadoFinal >= 90) {

            setClasificacion('Excelente')

        } else if (resultadoFinal >= 80) {

            setClasificacion('Bueno')

        } else if (resultadoFinal >= 70) {

            setClasificacion('Regular')

        } else {

            setClasificacion('Riesgo')

        }

    }, [
        cumplimientoEntregas,
        calidad,
        costos,
        tiempoRespuesta,
        incidencias
    ])


    // =========================================================
    // PROVEEDORES FILTRADOS
    // =========================================================

    const proveedoresFiltrados = proveedores.filter(
        proveedor => {

            const nombre =
                String(
                    proveedor.nombre || ''
                ).toLowerCase()

            const busqueda =
                busquedaProveedor
                    .toLowerCase()
                    .trim()

            return nombre.includes(busqueda)

        }
    )


    // =========================================================
    // SELECCIONAR PROVEEDOR
    // =========================================================

    const seleccionarProveedor = (proveedor) => {

        setIdProveedor(
            proveedor.idProveedor
        )

        setBusquedaProveedor(
            proveedor.nombre
        )

        setMostrarProveedores(false)

        cerrarModal()

    }


    // =========================================================
    // CAMBIAR BÚSQUEDA
    // =========================================================

    const cambiarBusquedaProveedor = (e) => {

        const valor = e.target.value

        setBusquedaProveedor(valor)

        setIdProveedor('')

        setMostrarProveedores(true)

    }


    // =========================================================
    // MOSTRAR PROVEEDORES
    // =========================================================

    const abrirListaProveedores = () => {

        setMostrarProveedores(true)

    }


    // =========================================================
    // RECOMENDACIÓN LOCAL
    // =========================================================

    const obtenerRecomendacion = (clasificacion) => {

        if (clasificacion === 'Excelente') {

            return 'El proveedor presenta un desempeño excelente. Se recomienda mantener la relación comercial y continuar con el seguimiento periódico.'

        }

        if (clasificacion === 'Bueno') {

            return 'El proveedor presenta un buen desempeño. Se recomienda mantener el seguimiento para conservar y mejorar sus resultados.'

        }

        if (clasificacion === 'Regular') {

            return 'El proveedor presenta áreas de oportunidad. Se recomienda establecer acciones de mejora y realizar un seguimiento más frecuente.'

        }

        return 'El proveedor presenta un nivel de riesgo. Se recomienda revisar los principales indicadores y establecer acciones correctivas.'

    }


    // =========================================================
    // GUARDAR EVALUACIÓN
    // =========================================================

    const guardarEvaluacion = async (e) => {

        e.preventDefault()

        if (!idProveedor) {

            setModal({
                abierto: true,
                tipo: 'advertencia',
                titulo: 'Selecciona un proveedor',
                mensaje: 'Debes seleccionar un proveedor de la lista antes de guardar la evaluación.',
                mostrarCancelar: false,
                textoAceptar: 'Aceptar',
                onAceptar: cerrarModal
            })

            setMostrarProveedores(true)

            return

        }

        setGuardando(true)

        try {

            // =====================================================
            // ANALIZAR CON IA
            // =====================================================

            let recomendacionIA = ''

            let riesgoIA = null
            let probabilidadRiesgoAlto = null

            try {

                const respuestaIA = await fetch(
                    'http://localhost:8000/ia/analizar',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify({

                            cumplimientoEntregas:
                                Number(
                                    cumplimientoEntregas
                                ),

                            calidad:
                                Number(
                                    calidad
                                ),

                            costos:
                                Number(
                                    costos
                                ),

                            tiempoRespuesta:
                                Number(
                                    tiempoRespuesta
                                ),

                            incidencias:
                                Number(
                                    incidencias
                                )

                        })
                    }
                )

                if (respuestaIA.ok) {

                    const datosIA =
                        await respuestaIA.json()

                    recomendacionIA =
                        datosIA.recomendacion ||
                        obtenerRecomendacion(
                            clasificacion
                        )

                    riesgoIA =
                        datosIA.riesgoIA || null

                    probabilidadRiesgoAlto =
                        datosIA.probabilidadRiesgoAlto ?? null

                } else {

                    recomendacionIA =
                        obtenerRecomendacion(
                            clasificacion
                        )

                }

            } catch (errorIA) {

                console.warn(
                    'No se pudo consultar la IA:',
                    errorIA
                )

                recomendacionIA =
                    obtenerRecomendacion(
                        clasificacion
                    )

            }


            // =====================================================
            // DATOS PARA BACKEND
            // =====================================================

            const datosEvaluacion = {

                idProveedor:
                    Number(idProveedor),

                cumplimientoEntregas:
                    Number(
                        cumplimientoEntregas
                    ),

                calidad:
                    Number(
                        calidad
                    ),

                costos:
                    Number(
                        costos
                    ),

                tiempoRespuesta:
                    Number(
                        tiempoRespuesta
                    ),

                incidencias:
                    Number(
                        incidencias
                    ),

                calificacionFinal:
                    Number(
                        calificacionFinal
                    ),

                clasificacion:
                    clasificacion,

                recomendacion:
                    recomendacionIA,

                riesgoIA:
                    riesgoIA,

                probabilidadRiesgoAlto:
                    probabilidadRiesgoAlto

            }


            // =====================================================
            // GUARDAR EN SPRING BOOT
            // =====================================================

            const respuesta = await fetch(
                'http://localhost:8080/api/evaluaciones',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body:
                        JSON.stringify(
                            datosEvaluacion
                        )

                }
            )

            if (!respuesta.ok) {

                const textoError =
                    await respuesta.text()

                throw new Error(
                    textoError ||
                    'No se pudo guardar la evaluación.'
                )

            }


            // =====================================================
            // MODAL DE ÉXITO
            // =====================================================

            setModal({
                abierto: true,
                tipo: 'exito',
                titulo: 'Evaluación registrada',
                mensaje:
                    `La evaluación del proveedor se registró correctamente. ` +
                    `Calificación final: ${calificacionFinal.toFixed(1)} puntos. ` +
                    `Clasificación: ${clasificacion}.`,
                mostrarCancelar: false,
                textoAceptar: 'Continuar',
                onAceptar: () => {

                    cerrarModal()

                    if (onGuardado) {
                        onGuardado()
                    }

                }
            })


        } catch (error) {

            console.error(
                'Error al guardar:',
                error
            )

            // =====================================================
            // MODAL DE ERROR
            // =====================================================

            setModal({
                abierto: true,
                tipo: 'error',
                titulo: 'No se pudo registrar',
                mensaje:
                    error.message ||
                    'No se pudo guardar la evaluación. Verifica que el backend esté funcionando.',
                mostrarCancelar: false,
                textoAceptar: 'Aceptar',
                onAceptar: cerrarModal
            })

        } finally {

            setGuardando(false)

        }

    }


    // =========================================================
    // CAMBIO DE INDICADORES
    // =========================================================

    const obtenerClaseValor = (valor) => {

        if (valor >= 90) {

            return 'valor-excelente'

        }

        if (valor >= 80) {

            return 'valor-bueno'

        }

        if (valor >= 70) {

            return 'valor-regular'

        }

        return 'valor-riesgo'

    }


    return (

        <div className="nueva-evaluacion-page">

            {/* =================================================
                ENCABEZADO
            ================================================== */}

            <div className="nueva-evaluacion-header">

                <div>

                    <h1>
                        Nueva evaluación
                    </h1>

                    <p>
                        Evalúa el desempeño del proveedor mediante los indicadores establecidos.
                    </p>

                </div>

            </div>


            <form
                className="formulario-evaluacion"
                onSubmit={guardarEvaluacion}
            >


                {/* =================================================
                    PROVEEDOR
                ================================================== */}

                <div className="seccion-formulario">

                    <div className="seccion-titulo">

                        <h2>
                            Proveedor
                        </h2>

                        <p>
                            Escribe el nombre o selecciona un proveedor registrado.
                        </p>

                    </div>


                    <div className="campo">

                        <label>
                            Proveedor
                        </label>


                        <div className="buscador-proveedor">

                            <input
                                type="text"
                                value={
                                    busquedaProveedor
                                }
                                onChange={
                                    cambiarBusquedaProveedor
                                }
                                onFocus={
                                    abrirListaProveedores
                                }
                                placeholder="Escribe el nombre del proveedor..."
                                autoComplete="off"
                            />

                            {busquedaProveedor && (

                                <button
                                    type="button"
                                    className="btn-limpiar-proveedor"
                                    onClick={() => {

                                        setBusquedaProveedor('')
                                        setIdProveedor('')
                                        setMostrarProveedores(true)

                                    }}
                                    aria-label="Limpiar proveedor"
                                >
                                    ×
                                </button>

                            )}

                        </div>


                        {/* =================================================
                            LISTA DE PROVEEDORES
                        ================================================== */}

                        {mostrarProveedores &&
                            proveedoresFiltrados.length > 0 && (

                                <div className="resultados-proveedores">

                                    <div className="resultados-titulo">

                                        Proveedores registrados

                                    </div>


                                    {proveedoresFiltrados
                                        .slice(0, 8)
                                        .map(
                                            proveedor => (

                                                <button
                                                    type="button"
                                                    className="resultado-proveedor"
                                                    key={
                                                        proveedor.idProveedor
                                                    }
                                                    onClick={() =>
                                                        seleccionarProveedor(
                                                            proveedor
                                                        )
                                                    }
                                                >

                                                    <span className="resultado-nombre">

                                                        {
                                                            proveedor.nombre
                                                        }

                                                    </span>

                                                    <span className="resultado-id">

                                                        ID #
                                                        {
                                                            proveedor.idProveedor
                                                        }

                                                    </span>

                                                </button>

                                            )
                                        )}

                                </div>

                            )}


                        {/* =================================================
                            SIN RESULTADOS
                        ================================================== */}

                        {mostrarProveedores &&
                            busquedaProveedor &&
                            proveedoresFiltrados.length === 0 && (

                                <div className="sin-resultados">

                                    No se encontró ningún proveedor con ese nombre.

                                </div>

                            )}


                        {/* =================================================
                            PROVEEDOR SELECCIONADO
                        ================================================== */}

                        {idProveedor && (

                            <div className="proveedor-seleccionado">

                                <span>
                                    Proveedor seleccionado:
                                </span>

                                <strong>
                                    {busquedaProveedor}
                                </strong>

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    INDICADORES
                ================================================== */}

                <div className="seccion-formulario">

                    <div className="seccion-titulo">

                        <h2>
                            Indicadores de desempeño
                        </h2>

                        <p>
                            Asigna una calificación de 0 a 100 para cada indicador.
                        </p>

                    </div>


                    <div className="indicadores-formulario">


                        {/* ENTREGAS */}

                        <div className="indicador-formulario">

                            <div className="indicador-formulario-header">

                                <label>
                                    Cumplimiento de entregas
                                </label>

                                <span
                                    className={
                                        `valor-indicador ${
                                            obtenerClaseValor(
                                                cumplimientoEntregas
                                            )
                                        }`
                                    }
                                >
                                    {cumplimientoEntregas}
                                </span>

                            </div>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={
                                    cumplimientoEntregas
                                }
                                onChange={(e) =>
                                    setCumplimientoEntregas(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                            <div className="rango-labels">

                                <span>
                                    0
                                </span>

                                <span>
                                    100
                                </span>

                            </div>

                        </div>


                        {/* CALIDAD */}

                        <div className="indicador-formulario">

                            <div className="indicador-formulario-header">

                                <label>
                                    Calidad
                                </label>

                                <span
                                    className={
                                        `valor-indicador ${
                                            obtenerClaseValor(
                                                calidad
                                            )
                                        }`
                                    }
                                >
                                    {calidad}
                                </span>

                            </div>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={calidad}
                                onChange={(e) =>
                                    setCalidad(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                            <div className="rango-labels">

                                <span>
                                    0
                                </span>

                                <span>
                                    100
                                </span>

                            </div>

                        </div>


                        {/* COSTOS */}

                        <div className="indicador-formulario">

                            <div className="indicador-formulario-header">

                                <label>
                                    Costos
                                </label>

                                <span
                                    className={
                                        `valor-indicador ${
                                            obtenerClaseValor(
                                                costos
                                            )
                                        }`
                                    }
                                >
                                    {costos}
                                </span>

                            </div>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={
                                    costos
                                }
                                onChange={(e) =>
                                    setCostos(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                            <div className="rango-labels">

                                <span>
                                    0
                                </span>

                                <span>
                                    100
                                </span>

                            </div>

                        </div>


                        {/* TIEMPO DE RESPUESTA */}

                        <div className="indicador-formulario">

                            <div className="indicador-formulario-header">

                                <label>
                                    Tiempo de respuesta
                                </label>

                                <span
                                    className={
                                        `valor-indicador ${
                                            obtenerClaseValor(
                                                tiempoRespuesta
                                            )
                                        }`
                                    }
                                >
                                    {tiempoRespuesta}
                                </span>

                            </div>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={
                                    tiempoRespuesta
                                }
                                onChange={(e) =>
                                    setTiempoRespuesta(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                            <div className="rango-labels">

                                <span>
                                    0
                                </span>

                                <span>
                                    100
                                </span>

                            </div>

                        </div>


                        {/* INCIDENCIAS */}

                        <div className="indicador-formulario">

                            <div className="indicador-formulario-header">

                                <label>
                                    Incidencias
                                </label>

                                <span
                                    className={
                                        `valor-indicador ${
                                            obtenerClaseValor(
                                                incidencias
                                            )
                                        }`
                                    }
                                >
                                    {incidencias}
                                </span>

                            </div>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={
                                    incidencias
                                }
                                onChange={(e) =>
                                    setIncidencias(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                            />

                            <div className="rango-labels">

                                <span>
                                    0
                                </span>

                                <span>
                                    100
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RESULTADO
                ================================================== */}

                <div className="resultado-evaluacion">

                    <div className="resultado-calificacion">

                        <span className="resultado-label">
                            Calificación final
                        </span>

                        <strong>
                            {calificacionFinal.toFixed(1)}
                        </strong>

                        <span>
                            sobre 100
                        </span>

                    </div>


                    <div
                        className={
                            `resultado-clasificacion ${
                                clasificacion
                                    .toLowerCase()
                                    .replace('í', 'i')
                            }`
                        }
                    >

                        <span className="resultado-label">
                            Clasificación
                        </span>

                        <strong>
                            {clasificacion}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    RECOMENDACIÓN
                ================================================== */}

                <div className="recomendacion-preview">

                    <div>

                        <h3>
                            Recomendación
                        </h3>

                        <p>
                            {recomendacion ||
                                obtenerRecomendacion(
                                    clasificacion
                                )}
                        </p>

                    </div>

                </div>


                {/* =================================================
                    BOTONES
                ================================================== */}

                <div className="acciones-formulario">

                    <button
                        type="button"
                        className="btn-cancelar"
                        onClick={onCancelar}
                        disabled={guardando}
                    >
                        Cancelar
                    </button>


                    <button
                        type="submit"
                        className="btn-guardar"
                        disabled={guardando}
                    >

                        {guardando
                            ? 'Guardando...'
                            : 'Guardar evaluación'}

                    </button>

                </div>

            </form>


            {/* =================================================
                MODAL
            ================================================== */}

            <ModalMensaje
                abierto={modal.abierto}
                tipo={modal.tipo}
                titulo={modal.titulo}
                mensaje={modal.mensaje}
                mostrarCancelar={modal.mostrarCancelar}
                textoCancelar={modal.textoCancelar}
                textoAceptar={modal.textoAceptar}
                onCancelar={cerrarModal}
                onAceptar={
                    modal.onAceptar ||
                    cerrarModal
                }
            />


            <style>{`

                /* =================================================
                   VARIABLES
                ================================================= */

                .nueva-evaluacion-page {

                    --ne-bg: #ffffff;
                    --ne-card: #ffffff;
                    --ne-soft: #f8fafc;
                    --ne-border: #e2e8f0;

                    --ne-text: #1e293b;
                    --ne-muted: #64748b;

                    --ne-primary: #2563eb;
                    --ne-primary-hover: #1d4ed8;

                    --ne-shadow:
                        rgba(15, 23, 42, 0.06);

                    --ne-green: #10b981;
                    --ne-blue: #3b82f6;
                    --ne-yellow: #f59e0b;
                    --ne-red: #ef4444;

                    --ne-excelente-bg: #dcfce7;
                    --ne-excelente-text: #166534;

                    --ne-bueno-bg: #dbeafe;
                    --ne-bueno-text: #1d4ed8;

                    --ne-regular-bg: #fef3c7;
                    --ne-regular-text: #92400e;

                    --ne-riesgo-bg: #fee2e2;
                    --ne-riesgo-text: #b91c1c;

                    background:
                        var(--ne-bg);

                    color:
                        var(--ne-text);

                    padding:
                        25px;

                    box-sizing:
                        border-box;

                }


                /* =================================================
                   MODO OSCURO
                ================================================= */

                body.dark .nueva-evaluacion-page,
                body.dark-mode .nueva-evaluacion-page,
                body[data-theme="dark"] .nueva-evaluacion-page {

                    --ne-bg: #1e293b;
                    --ne-card: #1e293b;
                    --ne-soft: #162033;
                    --ne-border: #334155;

                    --ne-text: #f1f5f9;
                    --ne-muted: #94a3b8;

                    --ne-primary: #60a5fa;
                    --ne-primary-hover: #93c5fd;

                    --ne-shadow:
                        rgba(0, 0, 0, 0.25);

                    --ne-excelente-bg: #14532d;
                    --ne-excelente-text: #bbf7d0;

                    --ne-bueno-bg: #1e3a8a;
                    --ne-bueno-text: #bfdbfe;

                    --ne-regular-bg: #78350f;
                    --ne-regular-text: #fde68a;

                    --ne-riesgo-bg: #7f1d1d;
                    --ne-riesgo-text: #fecaca;

                }


                /* =================================================
                   ENCABEZADO
                ================================================= */

                .nueva-evaluacion-header {

                    padding-right:
                        35px;

                    margin-bottom:
                        20px;

                }

                .nueva-evaluacion-header h1 {

                    margin:
                        0 0 5px;

                    font-size:
                        22px;

                    color:
                        var(--ne-text);

                }

                .nueva-evaluacion-header p {

                    margin:
                        0;

                    font-size:
                        11px;

                    color:
                        var(--ne-muted);

                    line-height:
                        1.5;

                }


                /* =================================================
                   FORMULARIO
                ================================================= */

                .formulario-evaluacion {

                    display:
                        flex;

                    flex-direction:
                        column;

                    gap:
                        14px;

                }

                .seccion-formulario {

                    padding:
                        14px;

                    border:
                        1px solid
                        var(--ne-border);

                    border-radius:
                        9px;

                    background:
                        var(--ne-card);

                }

                .seccion-titulo {

                    margin-bottom:
                        12px;

                }

                .seccion-titulo h2 {

                    margin:
                        0 0 3px;

                    font-size:
                        14px;

                    color:
                        var(--ne-text);

                }

                .seccion-titulo p {

                    margin:
                        0;

                    font-size:
                        10px;

                    color:
                        var(--ne-muted);

                }


                /* =================================================
                   CAMPOS
                ================================================= */

                .campo {

                    position:
                        relative;

                }

                .campo label {

                    display:
                        block;

                    margin-bottom:
                        5px;

                    font-size:
                        10px;

                    font-weight:
                        600;

                    color:
                        var(--ne-text);

                }

                .buscador-proveedor {

                    position:
                        relative;

                }

                .campo input[type="text"] {

                    width:
                        100%;

                    padding:
                        9px 36px 9px 10px;

                    border:
                        1px solid
                        var(--ne-border);

                    border-radius:
                        6px;

                    background:
                        var(--ne-soft);

                    color:
                        var(--ne-text);

                    font-size:
                        11px;

                    outline:
                        none;

                    box-sizing:
                        border-box;

                }

                .campo input[type="text"]:focus {

                    border-color:
                        var(--ne-primary);

                }

                .campo input::placeholder {

                    color:
                        var(--ne-muted);

                }

                .btn-limpiar-proveedor {

                    position:
                        absolute;

                    right:
                        8px;

                    top:
                        50%;

                    transform:
                        translateY(-50%);

                    width:
                        22px;

                    height:
                        22px;

                    display:
                        flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    border:
                        none;

                    border-radius:
                        5px;

                    background:
                        transparent;

                    color:
                        var(--ne-muted);

                    font-size:
                        18px;

                    line-height:
                        1;

                    cursor:
                        pointer;

                }

                .btn-limpiar-proveedor:hover {

                    background:
                        var(--ne-border);

                    color:
                        var(--ne-text);

                }


                /* =================================================
                   RESULTADOS
                ================================================= */

                .resultados-proveedores {

                    position:
                        absolute;

                    top:
                        100%;

                    left:
                        0;

                    right:
                        0;

                    z-index:
                        100;

                    margin-top:
                        4px;

                    max-height:
                        240px;

                    overflow-y:
                        auto;

                    background:
                        var(--ne-card);

                    border:
                        1px solid
                        var(--ne-border);

                    border-radius:
                        7px;

                    box-shadow:
                        0 10px 25px
                        var(--ne-shadow);

                    overflow-x:
                        hidden;

                }

                .resultados-titulo {

                    padding:
                        8px 11px;

                    font-size:
                        9px;

                    font-weight:
                        700;

                    color:
                        var(--ne-muted);

                    background:
                        var(--ne-soft);

                    border-bottom:
                        1px solid
                        var(--ne-border);

                    text-transform:
                        uppercase;

                    letter-spacing:
                        0.3px;

                }

                .resultado-proveedor {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    align-items:
                        center;

                    width:
                        100%;

                    padding:
                        9px 11px;

                    border:
                        none;

                    border-bottom:
                        1px solid
                        var(--ne-border);

                    background:
                        transparent;

                    color:
                        var(--ne-text);

                    text-align:
                        left;

                    cursor:
                        pointer;

                }

                .resultado-proveedor:last-child {

                    border-bottom:
                        none;

                }

                .resultado-proveedor:hover {

                    background:
                        var(--ne-soft);

                }

                .resultado-nombre {

                    font-size:
                        11px;

                    font-weight:
                        600;

                }

                .resultado-id {

                    font-size:
                        9px;

                    color:
                        var(--ne-muted);

                }

                .sin-resultados {

                    position:
                        absolute;

                    top:
                        100%;

                    left:
                        0;

                    right:
                        0;

                    z-index:
                        100;

                    margin-top:
                        4px;

                    padding:
                        11px;

                    background:
                        var(--ne-card);

                    border:
                        1px solid
                        var(--ne-border);

                    border-radius:
                        7px;

                    color:
                        var(--ne-muted);

                    font-size:
                        10px;

                    box-shadow:
                        0 8px 20px
                        var(--ne-shadow);

                }

                .proveedor-seleccionado {

                    display:
                        flex;

                    align-items:
                        center;

                    gap:
                        5px;

                    margin-top:
                        7px;

                    padding:
                        7px 9px;

                    border-radius:
                        6px;

                    background:
                        var(--ne-soft);

                    color:
                        var(--ne-muted);

                    font-size:
                        9px;

                }

                .proveedor-seleccionado strong {

                    color:
                        var(--ne-text);

                    font-size:
                        10px;

                }


                /* =================================================
                   INDICADORES
                ================================================= */

                .indicadores-formulario {

                    display:
                        grid;

                    grid-template-columns:
                        repeat(
                            2,
                            minmax(0, 1fr)
                        );

                    gap:
                        10px;

                }

                .indicador-formulario {

                    padding:
                        10px;

                    border:
                        1px solid
                        var(--ne-border);

                    border-radius:
                        8px;

                    background:
                        var(--ne-soft);

                }

                .indicador-formulario-header {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    align-items:
                        center;

                    gap:
                        10px;

                    margin-bottom:
                        8px;

                }

                .indicador-formulario-header label {

                    font-size:
                        10px;

                    font-weight:
                        600;

                    color:
                        var(--ne-text);

                }

                .valor-indicador {

                    min-width:
                        28px;

                    text-align:
                        center;

                    font-size:
                        11px;

                    font-weight:
                        700;

                }

                .valor-excelente {

                    color:
                        var(--ne-green);

                }

                .valor-bueno {

                    color:
                        var(--ne-blue);

                }

                .valor-regular {

                    color:
                        var(--ne-yellow);

                }

                .valor-riesgo {

                    color:
                        var(--ne-red);

                }

                .indicador-formulario input[type="range"] {

                    width:
                        100%;

                    height:
                        4px;

                    accent-color:
                        var(--ne-primary);

                    cursor:
                        pointer;

                }

                .rango-labels {

                    display:
                        flex;

                    justify-content:
                        space-between;

                    margin-top:
                        4px;

                    font-size:
                        8px;

                    color:
                        var(--ne-muted);

                }


                /* =================================================
                   RESULTADO
                ================================================= */

                .resultado-evaluacion {

                    display:
                        grid;

                    grid-template-columns:
                        1fr 1fr;

                    gap:
                        10px;

                }

                .resultado-calificacion,
                .resultado-clasificacion {

                    display:
                        flex;

                    flex-direction:
                        column;

                    align-items:
                        center;

                    justify-content:
                        center;

                    min-height:
                        85px;

                    padding:
                        12px;

                    border:
                        1px solid
                        var(--ne-border);

                    border-radius:
                        9px;

                    background:
                        var(--ne-soft);

                    text-align:
                        center;

                }

                .resultado-label {

                    margin-bottom:
                        5px;

                    font-size:
                        9px;

                    color:
                        var(--ne-muted);

                }

                .resultado-calificacion strong {

                    font-size:
                        27px;

                    line-height:
                        1;

                    color:
                        var(--ne-primary);

                }

                .resultado-calificacion > span:last-child {

                    margin-top:
                        4px;

                    font-size:
                        8px;

                    color:
                        var(--ne-muted);

                }

                .resultado-clasificacion strong {

                    font-size:
                        18px;

                }

                .resultado-clasificacion.excelente strong {

                    color:
                        var(--ne-green);

                }

                .resultado-clasificacion.bueno strong {

                    color:
                        var(--ne-blue);

                }

                .resultado-clasificacion.regular strong {

                    color:
                        var(--ne-yellow);

                }

                .resultado-clasificacion.riesgo strong {

                    color:
                        var(--ne-red);

                }


                /* =================================================
                   RECOMENDACIÓN
                ================================================= */

                .recomendacion-preview {

                    padding:
                        10px 12px;

                    border:
                        1px solid
                        var(--ne-border);

                    border-radius:
                        8px;

                    background:
                        var(--ne-soft);

                }

                .recomendacion-preview h3 {

                    margin:
                        0 0 4px;

                    font-size:
                        10px;

                    color:
                        var(--ne-primary);

                }

                .recomendacion-preview p {

                    margin:
                        0;

                    font-size:
                        10px;

                    line-height:
                        1.45;

                    color:
                        var(--ne-text);

                }


                /* =================================================
                   BOTONES
                ================================================= */

                .acciones-formulario {

                    display:
                        flex;

                    justify-content:
                        flex-end;

                    gap:
                        8px;

                    padding-top:
                        2px;

                }

                .btn-cancelar,
                .btn-guardar {

                    padding:
                        8px 13px;

                    border-radius:
                        6px;

                    font-size:
                        10px;

                    font-weight:
                        600;

                    cursor:
                        pointer;

                }

                .btn-cancelar {

                    border:
                        1px solid
                        var(--ne-border);

                    background:
                        var(--ne-soft);

                    color:
                        var(--ne-text);

                }

                .btn-cancelar:hover {

                    border-color:
                        var(--ne-primary);

                    color:
                        var(--ne-primary);

                }

                .btn-guardar {

                    border:
                        none;

                    background:
                        var(--ne-primary);

                    color:
                        white;

                }

                .btn-guardar:hover {

                    background:
                        var(--ne-primary-hover);

                }

                .btn-cancelar:disabled,
                .btn-guardar:disabled {

                    opacity:
                        0.6;

                    cursor:
                        not-allowed;

                }


                /* =================================================
                   RESPONSIVE
                ================================================= */

                @media (max-width: 700px) {

                    .nueva-evaluacion-page {

                        padding:
                            18px;

                    }

                    .indicadores-formulario {

                        grid-template-columns:
                            1fr;

                    }

                    .resultado-evaluacion {

                        grid-template-columns:
                            1fr;

                    }

                }

            `}</style>

        </div>

    )
}

export default NuevaEvaluacion
