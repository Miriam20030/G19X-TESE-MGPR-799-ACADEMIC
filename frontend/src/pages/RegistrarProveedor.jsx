import { apiFetch } from '../utils/apiFetch'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ModalMensaje from '../components/ModalMensaje'
import API_URL from '../config/api'

function RegistrarProveedor() {
  const navigate = useNavigate()

  const [proveedor, setProveedor] = useState({
    nombre: '',
    contacto: '',
    correo: '',
    telefono: '',
    rfc: '',
    estado: 'Activo'
  })

  const [foto, setFoto] = useState(null)
  const [vistaPrevia, setVistaPrevia] = useState(null)

  const [modal, setModal] = useState({
    abierto: false,
    tipo: 'info',
    titulo: '',
    mensaje: '',
    mostrarCancelar: false,
    onAceptar: null
  })

  const cerrarModal = () => {
    setModal({
      abierto: false,
      tipo: 'info',
      titulo: '',
      mensaje: '',
      mostrarCancelar: false,
      onAceptar: null
    })
  }

  const manejarCambio = (e) => {
    const { name, value } = e.target

    setProveedor((anterior) => ({
      ...anterior,
      [name]: value
    }))
  }

  const manejarFoto = (e) => {
    const archivo = e.target.files[0]

    if (!archivo) return

    if (!archivo.type.startsWith('image/')) {
      setModal({
        abierto: true,
        tipo: 'error',
        titulo: 'Archivo no vÃ¡lido',
        mensaje: 'Selecciona un archivo de imagen vÃ¡lido.',
        mostrarCancelar: false,
        onAceptar: null
      })

      e.target.value = ''
      return
    }

    if (vistaPrevia) {
      URL.revokeObjectURL(vistaPrevia)
    }

    setFoto(archivo)
    setVistaPrevia(URL.createObjectURL(archivo))
  }

  const quitarFoto = () => {
    if (vistaPrevia) {
      URL.revokeObjectURL(vistaPrevia)
    }

    setFoto(null)
    setVistaPrevia(null)
  }

  const guardarProveedor = async (e) => {
    e.preventDefault()

    try {
      // Registrar proveedor
      const respuesta = await apiFetch(`${API_URL}/api/proveedores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(proveedor)
      })

      if (!respuesta.ok) {
        const mensajeError = await respuesta.text()

        throw new Error(
          mensajeError || 'No se pudo registrar el proveedor.'
        )
      }

      const proveedorGuardado = await respuesta.json()

      // Subir fotografÃ­a si se seleccionÃ³ una
      if (foto) {
        const formularioFoto = new FormData()
        formularioFoto.append('foto', foto)

        const respuestaFoto = await apiFetch(
          `${API_URL}/api/proveedores/${proveedorGuardado.idProveedor}/foto`,
          {
            method: 'POST',
            credentials: 'include',
            body: formularioFoto
          }
        )

        if (!respuestaFoto.ok) {
          throw new Error(
            'El proveedor se registrÃ³, pero no se pudo subir la fotografÃ­a.'
          )
        }
      }

      // Mostrar confirmaciÃ³n
      setModal({
        abierto: true,
        tipo: 'exito',
        titulo: 'Â¡Proveedor registrado!',
        mensaje: 'El proveedor se registrÃ³ correctamente.',
        mostrarCancelar: false,
        onAceptar: () => {
          cerrarModal()
          navigate('/proveedores')
        }
      })
    } catch (error) {
      console.error('Error al registrar el proveedor:', error)

      setModal({
        abierto: true,
        tipo: 'error',
        titulo: 'Error al registrar',
        mensaje:
          error.message ||
          'OcurriÃ³ un error al registrar el proveedor. IntÃ©ntalo nuevamente.',
        mostrarCancelar: false,
        onAceptar: null
      })
    }
  }

  return (
    <div className="registrar-page">
      <style>{`
        .registrar-page {
          --rp-bg: #f6f7f9;
          --rp-card: #ffffff;
          --rp-input: #ffffff;
          --rp-border: #e2e5ec;
          --rp-title: #202536;
          --rp-text: #626b7d;
          --rp-muted: #8991a1;
          --rp-primary: #4f63d8;
          --rp-primary-hover: #4054c4;
          --rp-danger: #dc3545;
          --rp-shadow: 0 8px 28px rgba(25, 35, 70, 0.07);

          min-height: 100%;
          padding: 30px;
          background: var(--rp-bg);
          color: var(--rp-title);
          transition: background 0.25s ease, color 0.25s ease;
          box-sizing: border-box;
        }

        body.dark .registrar-page,
        body.dark-mode .registrar-page,
        body[data-theme="dark"] .registrar-page {
          --rp-bg: #151923;
          --rp-card: #202633;
          --rp-input: #171d28;
          --rp-border: #363e4d;
          --rp-title: #f0f2f8;
          --rp-text: #b4bdcc;
          --rp-muted: #929bad;
          --rp-primary: #6675e8;
          --rp-primary-hover: #7785f0;
          --rp-danger: #ff6878;
          --rp-shadow: 0 8px 28px rgba(0, 0, 0, 0.16);
        }

        .registrar-page *,
        .registrar-page *::before,
        .registrar-page *::after {
          box-sizing: border-box;
        }

        .rp-container {
          width: 100%;
          max-width: 1150px;
          margin: 0 auto;
        }

        .rp-breadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
          margin-bottom: 22px;
          color: var(--rp-muted);
          font-size: 13px;
        }

        .rp-breadcrumb a {
          color: var(--rp-primary);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .rp-breadcrumb a:hover {
          color: var(--rp-primary-hover);
          text-decoration: underline;
        }

        .rp-breadcrumb-separator {
          color: var(--rp-muted);
        }

        .rp-header {
          margin-bottom: 25px;
        }

        .rp-header h1 {
          margin: 0 0 9px;
          color: var(--rp-title);
          font-size: clamp(24px, 3vw, 30px);
          font-weight: 750;
          letter-spacing: -0.7px;
        }

        .rp-header p {
          max-width: 700px;
          margin: 0;
          color: var(--rp-text);
          font-size: 14px;
          line-height: 1.7;
        }

        .rp-card {
          overflow: hidden;
          background: var(--rp-card);
          border: 1px solid var(--rp-border);
          border-radius: 16px;
          box-shadow: var(--rp-shadow);
          transition: background 0.25s ease, border-color 0.25s ease;
        }

        .rp-card-heading {
          padding: 23px 28px;
          border-bottom: 1px solid var(--rp-border);
        }

        .rp-card-heading h2 {
          margin: 0 0 6px;
          color: var(--rp-title);
          font-size: 17px;
          font-weight: 700;
        }

        .rp-card-heading p {
          margin: 0;
          color: var(--rp-text);
          font-size: 13px;
          line-height: 1.6;
        }

        .rp-form {
          padding: 28px;
        }

        .rp-section {
          margin-bottom: 30px;
        }

        .rp-section:last-of-type {
          margin-bottom: 0;
        }

        .rp-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 20px;
          color: var(--rp-title);
          font-size: 15px;
          font-weight: 700;
        }

        .rp-section-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          border-radius: 9px;
          background: rgba(79, 99, 216, 0.11);
          color: var(--rp-primary);
          font-size: 16px;
        }

        .rp-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 21px 24px;
        }

        .rp-form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .rp-form-field.full-width {
          grid-column: 1 / -1;
        }

        .rp-form-field label {
          color: var(--rp-title);
          font-size: 13px;
          font-weight: 650;
        }

        .rp-required {
          color: var(--rp-danger);
          margin-left: 3px;
        }

        .rp-form-field input,
        .rp-form-field select {
          width: 100%;
          min-height: 45px;
          padding: 11px 13px;
          border: 1px solid var(--rp-border);
          border-radius: 9px;
          outline: none;
          background: var(--rp-input);
          color: var(--rp-title);
          font-family: inherit;
          font-size: 13px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .rp-form-field input::placeholder {
          color: var(--rp-muted);
          opacity: 1;
        }

        .rp-form-field input:focus,
        .rp-form-field select:focus {
          border-color: var(--rp-primary);
          box-shadow: 0 0 0 3px rgba(79, 99, 216, 0.12);
        }

        .rp-form-field select {
          cursor: pointer;
        }

        .rp-field-help {
          color: var(--rp-muted);
          font-size: 12px;
          line-height: 1.5;
        }

        .rp-photo-area {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 22px;
          padding: 20px;
          border: 1px dashed var(--rp-border);
          border-radius: 12px;
          background: var(--rp-bg);
        }

        .rp-photo-description {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          min-width: 0;
        }

        .rp-photo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 12px;
          background: rgba(79, 99, 216, 0.11);
          color: var(--rp-primary);
          font-size: 21px;
        }

        .rp-photo-description h3 {
          margin: 2px 0 6px;
          color: var(--rp-title);
          font-size: 14px;
          font-weight: 700;
        }

        .rp-photo-description p {
          margin: 0;
          color: var(--rp-text);
          font-size: 12px;
          line-height: 1.6;
        }

        .rp-photo-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rp-photo-preview {
          position: relative;
          width: 76px;
          height: 76px;
          flex-shrink: 0;
        }

        .rp-photo-preview img {
          display: block;
          width: 100%;
          height: 100%;
          border: 1px solid var(--rp-border);
          border-radius: 12px;
          object-fit: cover;
        }

        .rp-remove-photo {
          position: absolute;
          top: -8px;
          right: -8px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          padding: 0;
          border: 2px solid var(--rp-card);
          border-radius: 50%;
          background: var(--rp-danger);
          color: #fff;
          font-size: 15px;
          cursor: pointer;
        }

        .rp-upload-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 10px 15px;
          border: 1px solid var(--rp-border);
          border-radius: 9px;
          background: var(--rp-card);
          color: var(--rp-title);
          font-family: inherit;
          font-size: 12px;
          font-weight: 650;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }

        .rp-upload-button:hover {
          border-color: var(--rp-primary);
          background: var(--rp-bg);
        }

        .rp-upload-button input {
          display: none;
        }

        .rp-form-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
          padding-top: 23px;
          border-top: 1px solid var(--rp-border);
        }

        .rp-button {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          min-height: 44px;
          padding: 11px 20px;
          border: 1px solid transparent;
          border-radius: 9px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease,
            transform 0.2s ease;
        }

        .rp-button:active {
          transform: translateY(1px);
        }

        .rp-button-secondary {
          border-color: var(--rp-border);
          background: var(--rp-card);
          color: var(--rp-text);
        }

        .rp-button-secondary:hover {
          border-color: var(--rp-muted);
          background: var(--rp-bg);
          color: var(--rp-title);
        }

        .rp-button-primary {
          background: var(--rp-primary);
          color: #ffffff;
        }

        .rp-button-primary:hover {
          background: var(--rp-primary-hover);
        }

        @media (max-width: 850px) {
          .registrar-page {
            padding: 22px 18px;
          }

          .rp-form,
          .rp-card-heading {
            padding: 22px;
          }

          .rp-photo-area {
            grid-template-columns: 1fr;
          }

          .rp-photo-actions {
            justify-content: flex-start;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 560px) {
          .registrar-page {
            padding: 18px 12px;
          }

          .rp-form,
          .rp-card-heading {
            padding: 18px;
          }

          .rp-form-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .rp-form-field.full-width {
            grid-column: auto;
          }

          .rp-photo-description {
            flex-direction: column;
          }

          .rp-form-footer {
            flex-direction: column-reverse;
            align-items: stretch;
          }

          .rp-form-footer .rp-button {
            width: 100%;
          }
        }
      `}</style>

      <div className="rp-container">
        <nav className="rp-breadcrumb">
          <Link to="/proveedores">Proveedores</Link>
          <span className="rp-breadcrumb-separator">/</span>
          <span>Registrar proveedor</span>
        </nav>

        <header className="rp-header">
          <h1>Registrar proveedor</h1>
          <p>
            Registra un nuevo proveedor para mantener actualizada la informaciÃ³n
            y facilitar el seguimiento de su desempeÃ±o.
          </p>
        </header>

        <div className="rp-card">
          <div className="rp-card-heading">
            <h2>InformaciÃ³n del proveedor</h2>
            <p>
              Completa los campos necesarios para dar de alta al proveedor en el
              sistema.
            </p>
          </div>

          <form className="rp-form" onSubmit={guardarProveedor}>
            <section className="rp-section">
              <h3 className="rp-section-title">
                <span className="rp-section-icon">â–¤</span>
                Datos generales
              </h3>

              <div className="rp-form-grid">
                <div className="rp-form-field">
                  <label htmlFor="nombre">
                    Nombre del proveedor
                    <span className="rp-required">*</span>
                  </label>

                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={proveedor.nombre}
                    onChange={manejarCambio}
                    placeholder="Ej. Distribuidora del Centro"
                    required
                  />
                </div>

                <div className="rp-form-field">
                  <label htmlFor="contacto">
                    Persona de contacto
                    <span className="rp-required">*</span>
                  </label>

                  <input
                    id="contacto"
                    type="text"
                    name="contacto"
                    value={proveedor.contacto}
                    onChange={manejarCambio}
                    placeholder="Nombre del contacto"
                    required
                  />
                </div>

                <div className="rp-form-field">
                  <label htmlFor="correo">
                    Correo electrÃ³nico
                    <span className="rp-required">*</span>
                  </label>

                  <input
                    id="correo"
                    type="email"
                    name="correo"
                    value={proveedor.correo}
                    onChange={manejarCambio}
                    placeholder="contacto@empresa.com"
                    required
                  />
                </div>

                <div className="rp-form-field">
                  <label htmlFor="telefono">
                    TelÃ©fono
                    <span className="rp-required">*</span>
                  </label>

                  <input
                    id="telefono"
                    type="tel"
                    name="telefono"
                    value={proveedor.telefono}
                    onChange={manejarCambio}
                    placeholder="NÃºmero de telÃ©fono"
                    required
                  />
                </div>

                <div className="rp-form-field">
                  <label htmlFor="rfc">
                    RFC
                    <span className="rp-required">*</span>
                  </label>

                  <input
                    id="rfc"
                    type="text"
                    name="rfc"
                    value={proveedor.rfc}
                    onChange={manejarCambio}
                    placeholder="RFC del proveedor"
                    required
                  />
                </div>

                <div className="rp-form-field">
                  <label htmlFor="estado">
                    Estado del proveedor
                    <span className="rp-required">*</span>
                  </label>

                  <select
                    id="estado"
                    name="estado"
                    value={proveedor.estado}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="rp-section">
              <h3 className="rp-section-title">
                <span className="rp-section-icon">â–§</span>
                FotografÃ­a del proveedor
              </h3>

              <div className="rp-photo-area">
                <div className="rp-photo-description">
                  <div className="rp-photo-icon">â–§</div>

                  <div>
                    <h3>Agrega una fotografÃ­a</h3>
                    <p>
                      Puedes seleccionar una imagen para identificar al
                      proveedor. Este campo es opcional.
                    </p>
                  </div>
                </div>

                <div className="rp-photo-actions">
                  {vistaPrevia && (
                    <div className="rp-photo-preview">
                      <img
                        src={vistaPrevia}
                        alt="Vista previa de la fotografÃ­a del proveedor"
                      />

                      <button
                        type="button"
                        className="rp-remove-photo"
                        onClick={quitarFoto}
                        aria-label="Quitar fotografÃ­a"
                        title="Quitar fotografÃ­a"
                      >
                        Ã—
                      </button>
                    </div>
                  )}

                  <label className="rp-upload-button">
                    <span>â†‘</span>
                    {foto ? 'Cambiar fotografÃ­a' : 'Seleccionar imagen'}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={manejarFoto}
                    />
                  </label>
                </div>
              </div>

              {foto && (
                <p className="rp-field-help" style={{ marginTop: 10 }}>
                  Archivo seleccionado: {foto.name}
                </p>
              )}
            </section>

            <div className="rp-form-footer">
              <Link
                to="/proveedores"
                className="rp-button rp-button-secondary"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="rp-button rp-button-primary"
              >
                <span>âœ“</span>
                Guardar proveedor
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalMensaje
        abierto={modal.abierto}
        tipo={modal.tipo}
        titulo={modal.titulo}
        mensaje={modal.mensaje}
        mostrarCancelar={modal.mostrarCancelar}
        onAceptar={modal.onAceptar || cerrarModal}
        onCancelar={cerrarModal}
      />
    </div>
  )
}

export default RegistrarProveedor

