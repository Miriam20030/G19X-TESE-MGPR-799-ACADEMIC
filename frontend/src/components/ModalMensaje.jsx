import './ModalMensaje.css'

function ModalMensaje({
    abierto,
    tipo = 'info',
    titulo,
    mensaje,
    textoCancelar = 'Cancelar',
    textoAceptar = 'Aceptar',
    mostrarCancelar = false,
    onCancelar,
    onAceptar
}) {

    if (!abierto) return null

    const iconos = {
        exito: '✓',
        error: '!',
        advertencia: '!',
        info: 'i',
        eliminar: '🗑'
    }

    return (
        <div className="modal-overlay">

            <div className={`modal-mensaje modal-${tipo}`}>

                <div className="modal-icono">
                    {iconos[tipo] || 'i'}
                </div>

                <h2>{titulo}</h2>

                <p>{mensaje}</p>

                <div className="modal-botones">

                    {mostrarCancelar && (
                        <button
                            className="modal-btn cancelar"
                            onClick={onCancelar}
                        >
                            {textoCancelar}
                        </button>
                    )}

                    <button
                        className={`modal-btn ${tipo === 'eliminar' ? 'eliminar' : 'aceptar'}`}
                        onClick={onAceptar}
                    >
                        {textoAceptar}
                    </button>

                </div>

            </div>

        </div>
    )
}

export default ModalMensaje