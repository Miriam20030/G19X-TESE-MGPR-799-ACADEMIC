import { useEffect, useState } from 'react'

function Configuracion({
    modoOscuro,
    setModoOscuro
}) {

    // ==========================================
    // ESTADOS CAMBIO DE CONTRASEÑA
    // ==========================================

    const [passwordActual, setPasswordActual] = useState('')
    const [nuevaPassword, setNuevaPassword] = useState('')
    const [confirmarPassword, setConfirmarPassword] = useState('')

    const [mensajePassword, setMensajePassword] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [cargandoPassword, setCargandoPassword] = useState(false)


    // ==========================================
    // MODO OSCURO
    // ==========================================

    useEffect(() => {

        document.body.classList.toggle(
            'dark-mode',
            modoOscuro
        )

    }, [modoOscuro])


    // ==========================================
    // GUARDAR MODO OSCURO
    // ==========================================

    useEffect(() => {

        localStorage.setItem(
            'modoOscuro',
            modoOscuro
        )

    }, [modoOscuro])


    // ==========================================
    // CAMBIAR CONTRASEÑA
    // ==========================================

    const cambiarPassword = async (e) => {

        e.preventDefault()

        // Limpiar mensajes anteriores

        setMensajePassword('')
        setErrorPassword('')


        // ==========================================
        // VALIDAR CAMPOS
        // ==========================================

        if (
            !passwordActual ||
            !nuevaPassword ||
            !confirmarPassword
        ) {

            setErrorPassword(
                'Todos los campos son obligatorios.'
            )

            return
        }


        // ==========================================
        // VALIDAR LONGITUD
        // ==========================================

        if (nuevaPassword.length < 8) {

            setErrorPassword(
                'La nueva contraseña debe tener al menos 8 caracteres.'
            )

            return
        }


        // ==========================================
        // CONFIRMAR CONTRASEÑA
        // ==========================================

        if (nuevaPassword !== confirmarPassword) {

            setErrorPassword(
                'Las nuevas contraseñas no coinciden.'
            )

            return
        }


        // ==========================================
        // OBTENER USUARIO
        // ==========================================

        const usuario =
            localStorage.getItem('usuario') ||
            localStorage.getItem('username')

            console.log('Usuario guardado:', usuario)


        if (!usuario) {

            setErrorPassword(
                'No se encontró el usuario de la sesión.'
            )

            return
        }


        // ==========================================
        // ACTIVAR CARGANDO
        // ==========================================

        setCargandoPassword(true)


        try {

            // ==========================================
            // ENVIAR AL BACKEND
            // ==========================================

            const respuesta = await fetch(
                'http://localhost:8080/api/auth/cambiar-password',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({

                        usuario: usuario,

                        passwordActual:
                            passwordActual,

                        nuevaPassword:
                            nuevaPassword

                    })
                }
            )


            const datos = await respuesta.json()


            // ==========================================
            // ERROR DEL SERVIDOR
            // ==========================================

            if (!respuesta.ok) {

                setErrorPassword(
                    datos.mensaje ||
                    'No fue posible cambiar la contraseña.'
                )

                return
            }


            // ==========================================
            // CAMBIO EXITOSO
            // ==========================================

            setMensajePassword(
                'Contraseña actualizada correctamente.'
            )


            // Limpiar formulario

            setPasswordActual('')
            setNuevaPassword('')
            setConfirmarPassword('')


        } catch (error) {

            console.error(
                'Error al cambiar contraseña:',
                error
            )

            setErrorPassword(
                'No se pudo conectar con el servidor.'
            )


        } finally {

            setCargandoPassword(false)

        }

    }


    return (

        <div
            className="configuracion-page"
        >

            <style>{`

                /* ==========================================
                   VARIABLES
                ========================================== */

                .configuracion-page {

                    --cfg-bg: #f8fafc;
                    --cfg-card: #ffffff;
                    --cfg-text: #1e293b;
                    --cfg-text-secondary: #64748b;
                    --cfg-border: #e2e8f0;
                    --cfg-soft: #f1f5f9;
                    --cfg-primary: #2563eb;
                    --cfg-danger: #dc2626;
                    --cfg-success: #16a34a;

                    min-height: 100vh;

                    padding: 30px;

                    background: var(--cfg-bg);

                    color: var(--cfg-text);

                    transition:
                        background 0.3s ease,
                        color 0.3s ease;

                    box-sizing: border-box;

                }


                /* ==========================================
                   MODO OSCURO
                ========================================== */

                body.dark .configuracion-page,
                body.dark-mode .configuracion-page,
                body[data-theme="dark"] .configuracion-page {

                    --cfg-bg: #0f172a;
                    --cfg-card: #1e293b;
                    --cfg-text: #f8fafc;
                    --cfg-text-secondary: #cbd5e1;
                    --cfg-border: #334155;
                    --cfg-soft: #0f172a;
                    --cfg-primary: #60a5fa;
                    --cfg-danger: #f87171;
                    --cfg-success: #4ade80;

                }


                /* ==========================================
                   ENCABEZADO
                ========================================== */

                .configuracion-header {

                    margin-bottom: 30px;

                }


                .configuracion-header h1 {

                    margin: 0;

                    font-size: 28px;

                    font-weight: 700;

                    color: var(--cfg-text);

                }


                .configuracion-header p {

                    margin: 8px 0 0;

                    color: var(--cfg-text-secondary);

                    font-size: 15px;

                }


                /* ==========================================
                   TARJETA
                ========================================== */

                .configuracion-card {

                    width: 100%;

                    max-width: 700px;

                    background: var(--cfg-card);

                    border:
                        1px solid var(--cfg-border);

                    border-radius: 14px;

                    padding: 25px;

                    margin-bottom: 25px;

                    box-shadow:
                        0 4px 12px rgba(0, 0, 0, 0.06);

                    box-sizing: border-box;

                    transition:
                        background 0.3s ease,
                        border-color 0.3s ease;

                }


                body.dark .configuracion-card,
                body.dark-mode .configuracion-card,
                body[data-theme="dark"] .configuracion-card {

                    box-shadow:
                        0 8px 25px rgba(0, 0, 0, 0.20);

                }


                /* ==========================================
                   TITULO DE SECCION
                ========================================== */

                .configuracion-card h2 {

                    margin: 0;

                    font-size: 20px;

                    font-weight: 700;

                    color: var(--cfg-text);

                }


                .configuracion-card-subtitle {

                    margin: 7px 0 0;

                    color: var(--cfg-text-secondary);

                    font-size: 14px;

                }


                /* ==========================================
                   OPCION MODO OSCURO
                ========================================== */

                .configuracion-opcion {

                    display: flex;

                    justify-content: space-between;

                    align-items: center;

                    gap: 20px;

                    margin-top: 25px;

                    padding: 20px 0;

                    border-top:
                        1px solid var(--cfg-border);

                }


                .configuracion-opcion-info {

                    min-width: 0;

                }


                .configuracion-opcion-titulo {

                    display: block;

                    margin-bottom: 5px;

                    font-size: 16px;

                    font-weight: 600;

                    color: var(--cfg-text);

                }


                .configuracion-opcion-descripcion {

                    margin: 0;

                    color: var(--cfg-text-secondary);

                    font-size: 14px;

                    line-height: 1.5;

                }


                /* ==========================================
                   BOTON MODO OSCURO
                ========================================== */

                .btn-modo {

                    flex-shrink: 0;

                    min-width: 110px;

                    padding: 10px 18px;

                    border:
                        1px solid var(--cfg-border);

                    border-radius: 8px;

                    cursor: pointer;

                    background: var(--cfg-soft);

                    color: var(--cfg-text);

                    font-size: 14px;

                    font-weight: 600;

                    transition:
                        background 0.2s ease,
                        border-color 0.2s ease,
                        transform 0.2s ease;

                }


                .btn-modo:hover {

                    border-color:
                        var(--cfg-primary);

                    background:
                        var(--cfg-primary);

                    color: white;

                }


                .btn-modo:active {

                    transform:
                        scale(0.97);

                }


                /* ==========================================
                   FORMULARIO CONTRASEÑA
                ========================================== */

                .password-form {

                    margin-top: 25px;

                    padding-top: 25px;

                    border-top:
                        1px solid var(--cfg-border);

                }


                .password-group {

                    margin-bottom: 18px;

                }


                .password-group label {

                    display: block;

                    margin-bottom: 7px;

                    color: var(--cfg-text);

                    font-size: 14px;

                    font-weight: 600;

                }


                .password-group input {

                    width: 100%;

                    padding: 11px 13px;

                    box-sizing: border-box;

                    border:
                        1px solid var(--cfg-border);

                    border-radius: 8px;

                    outline: none;

                    background:
                        var(--cfg-soft);

                    color:
                        var(--cfg-text);

                    font-size: 14px;

                    transition:
                        border-color 0.2s ease,
                        box-shadow 0.2s ease;

                }


                .password-group input::placeholder {

                    color:
                        var(--cfg-text-secondary);

                }


                .password-group input:focus {

                    border-color:
                        var(--cfg-primary);

                    box-shadow:
                        0 0 0 3px
                        rgba(37, 99, 235, 0.12);

                }


                /* ==========================================
                   BOTON CAMBIAR CONTRASEÑA
                ========================================== */

                .btn-password {

                    width: 100%;

                    padding: 12px 18px;

                    margin-top: 5px;

                    border: none;

                    border-radius: 8px;

                    cursor: pointer;

                    background:
                        var(--cfg-primary);

                    color: white;

                    font-size: 14px;

                    font-weight: 600;

                    transition:
                        opacity 0.2s ease,
                        transform 0.2s ease;

                }


                .btn-password:hover {

                    opacity: 0.9;

                }


                .btn-password:active {

                    transform:
                        scale(0.98);

                }


                .btn-password:disabled {

                    opacity: 0.6;

                    cursor: not-allowed;

                }


                /* ==========================================
                   MENSAJES
                ========================================== */

                .password-error {

                    margin-top: 15px;

                    padding: 11px 13px;

                    border-radius: 8px;

                    background:
                        rgba(220, 38, 38, 0.10);

                    color:
                        var(--cfg-danger);

                    border:
                        1px solid
                        rgba(220, 38, 38, 0.20);

                    font-size: 14px;

                }


                .password-success {

                    margin-top: 15px;

                    padding: 11px 13px;

                    border-radius: 8px;

                    background:
                        rgba(22, 163, 74, 0.10);

                    color:
                        var(--cfg-success);

                    border:
                        1px solid
                        rgba(22, 163, 74, 0.20);

                    font-size: 14px;

                }


                /* ==========================================
                   CONFIGURACION ACTUAL
                ========================================== */

                .configuracion-actual {

                    margin-top: 10px;

                    padding-top: 20px;

                    border-top:
                        1px solid var(--cfg-border);

                }


                .configuracion-actual-titulo {

                    display: block;

                    margin-bottom: 8px;

                    font-size: 15px;

                    font-weight: 600;

                    color: var(--cfg-text);

                }


                .configuracion-actual p {

                    margin: 0;

                    color: var(--cfg-text-secondary);

                    font-size: 14px;

                }


                /* ==========================================
                   RESPONSIVE
                ========================================== */

                @media (max-width: 700px) {

                    .configuracion-page {

                        padding: 20px;

                    }


                    .configuracion-header h1 {

                        font-size: 24px;

                    }


                    .configuracion-card {

                        padding: 20px;

                    }


                    .configuracion-opcion {

                        align-items: flex-start;

                        flex-direction: column;

                    }


                    .btn-modo {

                        width: 100%;

                    }

                }

            `}</style>


            {/* ==========================================
                ENCABEZADO
            ========================================== */}

            <div className="configuracion-header">

                <h1>
                    Configuración
                </h1>

                <p>
                    Personaliza la apariencia y seguridad
                    del sistema.
                </p>

            </div>


            {/* ==========================================
                TARJETA APARIENCIA
            ========================================== */}

            <div className="configuracion-card">

                <h2>
                    Apariencia
                </h2>

                <p className="configuracion-card-subtitle">
                    Configura cómo deseas visualizar el sistema.
                </p>


                {/* ======================================
                    MODO OSCURO
                ====================================== */}

                <div className="configuracion-opcion">

                    <div className="configuracion-opcion-info">

                        <span className="configuracion-opcion-titulo">
                            Modo oscuro
                        </span>

                        <p className="configuracion-opcion-descripcion">
                            Cambia entre una apariencia clara
                            y una apariencia oscura para toda
                            la interfaz.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="btn-modo"
                        onClick={() =>
                            setModoOscuro(!modoOscuro)
                        }
                    >

                        {modoOscuro
                            ? 'Modo claro'
                            : 'Modo oscuro'}

                    </button>

                </div>


                {/* ======================================
                    CONFIGURACION ACTUAL
                ====================================== */}

                <div className="configuracion-actual">

                    <span className="configuracion-actual-titulo">
                        Configuración actual
                    </span>

                    <p>
                        Tema: {modoOscuro ? 'Oscuro' : 'Claro'}
                    </p>

                </div>

            </div>


            {/* ==========================================
                TARJETA SEGURIDAD
            ========================================== */}

            <div className="configuracion-card">

                <h2>
                    Seguridad
                </h2>

                <p className="configuracion-card-subtitle">
                    Cambia la contraseña utilizada para
                    iniciar sesión en el sistema.
                </p>


                {/* ======================================
                    FORMULARIO CAMBIO DE CONTRASEÑA
                ====================================== */}

                <form
                    className="password-form"
                    onSubmit={cambiarPassword}
                >


                    {/* CONTRASEÑA ACTUAL */}

                    <div className="password-group">

                        <label htmlFor="passwordActual">
                            Contraseña actual
                        </label>

                        <input
                            id="passwordActual"
                            type="password"
                            value={passwordActual}
                            onChange={(e) =>
                                setPasswordActual(
                                    e.target.value
                                )
                            }
                            placeholder="Ingresa tu contraseña actual"
                            autoComplete="current-password"
                        />

                    </div>


                    {/* NUEVA CONTRASEÑA */}

                    <div className="password-group">

                        <label htmlFor="nuevaPassword">
                            Nueva contraseña
                        </label>

                        <input
                            id="nuevaPassword"
                            type="password"
                            value={nuevaPassword}
                            onChange={(e) =>
                                setNuevaPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Mínimo 8 caracteres"
                            autoComplete="new-password"
                        />

                    </div>


                    {/* CONFIRMAR CONTRASEÑA */}

                    <div className="password-group">

                        <label htmlFor="confirmarPassword">
                            Confirmar nueva contraseña
                        </label>

                        <input
                            id="confirmarPassword"
                            type="password"
                            value={confirmarPassword}
                            onChange={(e) =>
                                setConfirmarPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Repite la nueva contraseña"
                            autoComplete="new-password"
                        />

                    </div>


                    {/* MENSAJE ERROR */}

                    {errorPassword && (

                        <div className="password-error">
                            {errorPassword}
                        </div>

                    )}


                    {/* MENSAJE EXITOSO */}

                    {mensajePassword && (

                        <div className="password-success">
                            {mensajePassword}
                        </div>

                    )}


                    {/* BOTON */}

                    <button
                        type="submit"
                        className="btn-password"
                        disabled={cargandoPassword}
                    >

                        {cargandoPassword
                            ? 'Actualizando...'
                            : 'Cambiar contraseña'}

                    </button>

                </form>

            </div>

        </div>
    )
}


export default Configuracion