
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ModalMensaje from '../components/ModalMensaje'

function EditarProveedor() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [proveedor, setProveedor] = useState({
    nombre: '',
    contacto: '',
    correo: '',
    telefono: '',
    rfc: '',
    estado: ''
  })

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  // ==========================================
  // MODAL
  // ==========================================

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


  // ==========================================
  // OBTENER PROVEEDOR
  // ==========================================

  useEffect(() => {

    const obtenerProveedor = async () => {

      try {

        const respuesta = await fetch(
          `http://localhost:8080/api/proveedores/${id}`
        )

        if (!respuesta.ok) {
          throw new Error('Error al cargar el proveedor')
        }

        const datos = await respuesta.json()

        setProveedor({
          nombre: datos.nombre || '',
          contacto: datos.contacto || '',
          correo: datos.correo || '',
          telefono: datos.telefono || '',
          rfc: datos.rfc || '',
          estado: datos.estado || ''
        })

      } catch (error) {

        console.error(error)

        setModal({
          abierto: true,
          tipo: 'error',
          titulo: 'No se pudo cargar',
          mensaje: 'Ocurrió un error al cargar la información del proveedor.',
          mostrarCancelar: false,
          textoAceptar: 'Aceptar',
          onAceptar: cerrarModal
        })

      } finally {

        setCargando(false)

      }

    }

    obtenerProveedor()

  }, [id])


  // ==========================================
  // MANEJAR CAMBIOS
  // ==========================================

  const manejarCambio = (e) => {

    setProveedor({
      ...proveedor,
      [e.target.name]: e.target.value
    })

  }


  // ==========================================
  // GUARDAR CAMBIOS
  // ==========================================

  const guardarCambios = async (e) => {

    e.preventDefault()

    setGuardando(true)

    try {

      const respuesta = await fetch(
        `http://localhost:8080/api/proveedores/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(proveedor)
        }
      )

      if (!respuesta.ok) {

        const mensaje = await respuesta.text()

        throw new Error(mensaje)

      }

      setModal({
        abierto: true,
        tipo: 'exito',
        titulo: 'Proveedor actualizado',
        mensaje: 'La información del proveedor se actualizó correctamente.',
        mostrarCancelar: false,
        textoAceptar: 'Continuar',
        onAceptar: () => {
          cerrarModal()
          navigate('/proveedores')
        }
      })

    } catch (error) {

      console.error(error)

      setModal({
        abierto: true,
        tipo: 'error',
        titulo: 'No se pudo actualizar',
        mensaje: error.message || 'Ocurrió un error al actualizar el proveedor.',
        mostrarCancelar: false,
        textoAceptar: 'Aceptar',
        onAceptar: cerrarModal
      })

    } finally {

      setGuardando(false)

    }

  }


  // ==========================================
  // INTERFAZ
  // ==========================================

  if (cargando) {

    return (
      <>
        <style>{`

          .editar-loading {

            min-height: 100vh;

            display: flex;

            justify-content: center;

            align-items: center;

            background: #f6f7f9;

            color: #687386;

            font-size: 14px;

          }


          body.dark .editar-loading,
          body.dark-mode .editar-loading,
          body[data-theme="dark"] .editar-loading {

            background: #111827;

            color: #9ca3af;

          }

        `}</style>

        <div className="editar-loading">
          Cargando información del proveedor...
        </div>
      </>
    )

  }


  return (

    <>

      <style>{`

        /* ==================================================
           VARIABLES
        ================================================== */

        .editar-page {

          --ep-bg: #f6f7f9;
          --ep-card: #ffffff;
          --ep-input: #ffffff;

          --ep-border: #e3e7ed;
          --ep-border-light: #edf0f3;
          --ep-border-input: #d7dce4;

          --ep-title: #202938;
          --ep-text: #273142;
          --ep-secondary: #465164;
          --ep-muted: #8a94a6;

          --ep-avatar-bg: #eef2f7;
          --ep-avatar-text: #334155;

          --ep-footer: #fafbfc;

          --ep-button-bg: #202938;
          --ep-button-text: #ffffff;

          --ep-active-border: #86efac;
          --ep-active-bg: #f0fdf4;

          --ep-inactive-border: #fca5a5;
          --ep-inactive-bg: #fef2f2;

          width: 100%;

          min-height: 100vh;

          padding: 32px;

          box-sizing: border-box;

          background: var(--ep-bg);

          transition:
            background 0.25s ease,
            color 0.25s ease;

        }


        /* ==================================================
           MODO OSCURO
        ================================================== */

        body.dark .editar-page,
        body.dark-mode .editar-page,
        body[data-theme="dark"] .editar-page {

          --ep-bg: #111827;
          --ep-card: #1f2937;
          --ep-input: #111827;

          --ep-border: #374151;
          --ep-border-light: #303b4d;
          --ep-border-input: #4b5563;

          --ep-title: #f9fafb;
          --ep-text: #e5e7eb;
          --ep-secondary: #d1d5db;
          --ep-muted: #9ca3af;

          --ep-avatar-bg: #374151;
          --ep-avatar-text: #f3f4f6;

          --ep-footer: #18212f;

          --ep-button-bg: #6675e8;
          --ep-button-text: #ffffff;

          --ep-active-border: #22c55e;
          --ep-active-bg: #052e16;

          --ep-inactive-border: #ef4444;
          --ep-inactive-bg: #450a0a;

        }


        /* ==================================================
           ENCABEZADO
        ================================================== */

        .editar-header {

          max-width: 950px;

          margin: 0 auto 24px;

          display: flex;

          justify-content: space-between;

          align-items: flex-end;

          gap: 20px;

        }


        .editar-breadcrumb {

          margin-bottom: 8px;

          color: var(--ep-muted);

          font-size: 13px;

        }


        .editar-title {

          margin: 0;

          color: var(--ep-title);

          font-size: 29px;

          font-weight: 700;

        }


        .editar-subtitle {

          margin: 6px 0 0;

          color: var(--ep-secondary);

          font-size: 14px;

        }


        /* ==================================================
           BOTÓN REGRESAR
        ================================================== */

        .editar-back {

          padding: 10px 17px;

          border:
            1px solid var(--ep-border);

          border-radius: 8px;

          background: var(--ep-card);

          color: var(--ep-secondary);

          font-size: 14px;

          font-weight: 600;

          cursor: pointer;

          white-space: nowrap;

          transition: 0.18s ease;

        }


        .editar-back:hover {

          border-color: #4f63d8;

        }


        /* ==================================================
           TARJETA
        ================================================== */

        .editar-card {

          max-width: 950px;

          margin: 0 auto;

          background: var(--ep-card);

          border:
            1px solid var(--ep-border);

          border-radius: 14px;

          box-shadow:
            0 5px 20px
            rgba(31, 41, 55, 0.08);

          overflow: hidden;

          transition:
            background 0.25s ease,
            border-color 0.25s ease;

        }


        /* ==================================================
           CABECERA DEL PROVEEDOR
        ================================================== */

        .editar-card-header {

          display: flex;

          align-items: center;

          gap: 15px;

          padding: 24px 30px;

          border-bottom:
            1px solid var(--ep-border-light);

        }


        .editar-avatar {

          width: 52px;

          height: 52px;

          border-radius: 12px;

          background: var(--ep-avatar-bg);

          color: var(--ep-avatar-text);

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 20px;

          font-weight: 700;

          flex-shrink: 0;

        }


        .editar-card-title {

          margin: 0;

          color: var(--ep-title);

          font-size: 18px;

          font-weight: 700;

        }


        .editar-card-subtitle {

          margin: 4px 0 0;

          color: var(--ep-muted);

          font-size: 13px;

        }


        /* ==================================================
           SECCIONES
        ================================================== */

        .editar-section {

          padding: 25px 30px 5px;

        }


        .editar-section-title {

          margin: 0;

          color: var(--ep-text);

          font-size: 15px;

          font-weight: 700;

        }


        .editar-line {

          height: 1px;

          background: var(--ep-border-light);

          margin: 12px 0 20px;

        }


        /* ==================================================
           FORMULARIO
        ================================================== */

        .editar-grid {

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 18px 22px;

        }


        .editar-field {

          display: flex;

          flex-direction: column;

        }


        .editar-field-full {

          grid-column: 1 / -1;

          display: flex;

          flex-direction: column;

        }


        .editar-label {

          margin-bottom: 7px;

          color: var(--ep-secondary);

          font-size: 13px;

          font-weight: 600;

        }


        .editar-input {

          width: 100%;

          box-sizing: border-box;

          padding: 11px 12px;

          border:
            1px solid var(--ep-border-input);

          border-radius: 7px;

          background: var(--ep-input);

          color: var(--ep-text);

          font-size: 14px;

          outline: none;

          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            background 0.25s ease;

        }


        .editar-input::placeholder {

          color: var(--ep-muted);

        }


        .editar-input:hover {

          border-color: #4f63d8;

        }


        .editar-input:focus {

          border-color: #4f63d8;

          box-shadow:
            0 0 0 3px
            rgba(79, 99, 216, 0.12);

        }


        /* ==================================================
           ESTADO
        ================================================== */

        .editar-estado-container {

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 15px;

        }


        .editar-estado-option {

          display: flex;

          align-items: flex-start;

          gap: 11px;

          padding: 15px;

          border:
            1px solid var(--ep-border);

          border-radius: 9px;

          cursor: pointer;

          background: var(--ep-card);

          color: var(--ep-text);

          transition:
            background 0.2s ease,
            border-color 0.2s ease;

        }


        .editar-estado-option strong {

          display: block;

          color: var(--ep-text);

          margin-bottom: 4px;

        }


        .editar-estado-option span {

          display: block;

          color: var(--ep-secondary);

          font-size: 13px;

          line-height: 1.4;

        }


        .editar-estado-activo {

          border-color: var(--ep-active-border);

          background: var(--ep-active-bg);

        }


        .editar-estado-inactivo {

          border-color: var(--ep-inactive-border);

          background: var(--ep-inactive-bg);

        }


        /* ==================================================
           FOOTER
        ================================================== */

        .editar-footer {

          display: flex;

          justify-content: flex-end;

          gap: 10px;

          padding: 25px 30px;

          margin-top: 25px;

          background: var(--ep-footer);

          border-top:
            1px solid var(--ep-border-light);

          transition:
            background 0.25s ease;

        }


        /* ==================================================
           CANCELAR
        ================================================== */

        .editar-cancel {

          padding: 11px 20px;

          border:
            1px solid var(--ep-border-input);

          border-radius: 7px;

          background: var(--ep-input);

          color: var(--ep-secondary);

          font-size: 14px;

          font-weight: 600;

          cursor: pointer;

        }


        .editar-cancel:hover {

          border-color: #4f63d8;

        }


        /* ==================================================
           GUARDAR
        ================================================== */

        .editar-save {

          padding: 11px 22px;

          border: none;

          border-radius: 7px;

          background: var(--ep-button-bg);

          color: var(--ep-button-text);

          font-size: 14px;

          font-weight: 600;

          cursor: pointer;

          transition: 0.18s ease;

        }


        .editar-save:hover {

          background: #4054c4;

        }


        .editar-save:disabled,

        .editar-cancel:disabled {

          opacity: 0.6;

          cursor: not-allowed;

        }


        /* ==================================================
           RESPONSIVE
        ================================================== */

        @media (max-width: 700px) {

          .editar-page {

            padding: 22px 18px 40px;

          }


          .editar-header {

            align-items: flex-start;

            flex-direction: column;

          }


          .editar-back {

            width: 100%;

          }


          .editar-grid {

            grid-template-columns: 1fr;

          }


          .editar-field-full {

            grid-column: auto;

          }


          .editar-section {

            padding: 25px 20px 5px;

          }


          .editar-estado-container {

            grid-template-columns: 1fr;

          }


          .editar-footer {

            padding: 20px;

            flex-direction: column-reverse;

          }


          .editar-cancel,

          .editar-save {

            width: 100%;

          }

        }

      `}</style>


      {/* ==================================================
          PÁGINA
      ================================================== */}

      <div className="editar-page">


        {/* ==================================================
            ENCABEZADO
        ================================================== */}

        <div className="editar-header">

          <div>

            <div className="editar-breadcrumb">
              Proveedores / Editar
            </div>

            <h1 className="editar-title">
              Editar proveedor
            </h1>

            <p className="editar-subtitle">
              Actualiza la información registrada del proveedor.
            </p>

          </div>


          <button
            type="button"
            onClick={() => navigate('/proveedores')}
            className="editar-back"
          >
            ← Regresar
          </button>

        </div>


        {/* ==================================================
            TARJETA
        ================================================== */}

        <div className="editar-card">


          {/* ==================================================
              CABECERA
          ================================================== */}

          <div className="editar-card-header">

            <div className="editar-avatar">

              {proveedor.nombre
                ? proveedor.nombre.charAt(0).toUpperCase()
                : 'P'}

            </div>


            <div>

              <h2 className="editar-card-title">
                {proveedor.nombre || 'Proveedor'}
              </h2>

              <p className="editar-card-subtitle">
                ID del proveedor: #{id}
              </p>

            </div>

          </div>


          {/* ==================================================
              FORMULARIO
          ================================================== */}

          <form onSubmit={guardarCambios}>


            {/* ==================================================
                INFORMACIÓN DEL PROVEEDOR
            ================================================== */}

            <div className="editar-section">

              <h3 className="editar-section-title">
                Información del proveedor
              </h3>

              <div className="editar-line"></div>


              <div className="editar-grid">


                {/* NOMBRE */}

                <div className="editar-field">

                  <label className="editar-label">
                    Nombre del proveedor
                  </label>

                  <input
                    type="text"
                    name="nombre"
                    value={proveedor.nombre}
                    onChange={manejarCambio}
                    required
                    className="editar-input"
                    placeholder="Nombre del proveedor"
                  />

                </div>


                {/* RFC */}

                <div className="editar-field">

                  <label className="editar-label">
                    RFC
                  </label>

                  <input
                    type="text"
                    name="rfc"
                    value={proveedor.rfc}
                    onChange={manejarCambio}
                    maxLength="13"
                    className="editar-input"
                    placeholder="RFC"
                  />

                </div>


              </div>

            </div>


            {/* ==================================================
                DATOS DE CONTACTO
            ================================================== */}

            <div className="editar-section">

              <h3 className="editar-section-title">
                Datos de contacto
              </h3>

              <div className="editar-line"></div>


              <div className="editar-grid">


                {/* CONTACTO */}

                <div className="editar-field">

                  <label className="editar-label">
                    Persona de contacto
                  </label>

                  <input
                    type="text"
                    name="contacto"
                    value={proveedor.contacto}
                    onChange={manejarCambio}
                    required
                    className="editar-input"
                    placeholder="Nombre del contacto"
                  />

                </div>


                {/* TELÉFONO */}

                <div className="editar-field">

                  <label className="editar-label">
                    Teléfono
                  </label>

                  <input
                    type="text"
                    name="telefono"
                    value={proveedor.telefono}
                    onChange={manejarCambio}
                    required
                    className="editar-input"
                    placeholder="Teléfono"
                  />

                </div>


                {/* CORREO */}

                <div className="editar-field-full">

                  <label className="editar-label">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    name="correo"
                    value={proveedor.correo}
                    onChange={manejarCambio}
                    required
                    className="editar-input"
                    placeholder="correo@empresa.com"
                  />

                </div>


              </div>

            </div>


            {/* ==================================================
                ESTADO
            ================================================== */}

            <div className="editar-section">

              <h3 className="editar-section-title">
                Estado del proveedor
              </h3>

              <div className="editar-line"></div>


              <div className="editar-estado-container">


                {/* ACTIVO */}

                <label
                  className={`
                    editar-estado-option
                    ${proveedor.estado === 'Activo'
                      ? 'editar-estado-activo'
                      : ''}
                  `}
                >

                  <input
                    type="radio"
                    name="estado"
                    value="Activo"
                    checked={proveedor.estado === 'Activo'}
                    onChange={manejarCambio}
                  />


                  <div>

                    <strong>
                      Activo
                    </strong>

                    <span>
                      El proveedor puede operar normalmente.
                    </span>

                  </div>

                </label>


                {/* INACTIVO */}

                <label
                  className={`
                    editar-estado-option
                    ${proveedor.estado === 'Inactivo'
                      ? 'editar-estado-inactivo'
                      : ''}
                  `}
                >

                  <input
                    type="radio"
                    name="estado"
                    value="Inactivo"
                    checked={proveedor.estado === 'Inactivo'}
                    onChange={manejarCambio}
                  />


                  <div>

                    <strong>
                      Inactivo
                    </strong>

                    <span>
                      El proveedor no está operando actualmente.
                    </span>

                  </div>

                </label>


              </div>

            </div>


            {/* ==================================================
                BOTONES
            ================================================== */}

            <div className="editar-footer">


              <button
                type="button"
                onClick={() => navigate('/proveedores')}
                className="editar-cancel"
                disabled={guardando}
              >
                Cancelar
              </button>


              <button
                type="submit"
                className="editar-save"
                disabled={guardando}
              >

                {guardando
                  ? 'Guardando...'
                  : 'Guardar cambios'}

              </button>


            </div>


          </form>

        </div>

      </div>


      {/* ==================================================
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
        onAceptar={modal.onAceptar || cerrarModal}
      />

    </>

  )
}

export default EditarProveedor
