import { useEffect } from 'react'

function Configuracion({
modoOscuro,
setModoOscuro
}) {


/*
 * Aplica el modo oscuro a toda la aplicación.
 */
useEffect(() => {

    document.body.classList.toggle(
        'dark-mode',
        modoOscuro
    )

}, [modoOscuro])


/*
 * Guarda la configuración del modo oscuro.
 */
useEffect(() => {

    localStorage.setItem(
        'modoOscuro',
        modoOscuro
    )

}, [modoOscuro])


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

                border: 1px solid var(--cfg-border);

                border-radius: 14px;

                padding: 25px;

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

                border: 1px solid var(--cfg-border);

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

                border-color: var(--cfg-primary);

                background: var(--cfg-primary);

                color: white;

            }


            .btn-modo:active {

                transform: scale(0.97);

            }


            /* ==========================================
               ESTADO ACTUAL
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
                Personaliza la apariencia del sistema.
            </p>

        </div>


        {/* ==========================================
            TARJETA
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
                        Cambia entre una apariencia clara y una
                        apariencia oscura para toda la interfaz.
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

    </div>
)


}

export default Configuracion
