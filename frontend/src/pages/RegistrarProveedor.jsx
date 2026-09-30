
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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

  // ==========================================
  // CAMBIAR DATOS
  // ==========================================

  const manejarCambio = (e) => {

    setProveedor({
      ...proveedor,
      [e.target.name]: e.target.value
    })

  }

  // ==========================================
  // SELECCIONAR FOTO
  // ==========================================

  const manejarFoto = (e) => {

    const archivo = e.target.files[0]

    if (!archivo) {
      return
    }

    if (!archivo.type.startsWith('image/')) {

      alert(
        'Por favor selecciona un archivo de imagen.'
      )

      return
    }

    setFoto(archivo)

    const url = URL.createObjectURL(archivo)

    setVistaPrevia(url)

  }

  // ==========================================
  // QUITAR FOTO
  // ==========================================

  const quitarFoto = () => {

    setFoto(null)
    setVistaPrevia(null)

  }

  // ==========================================
  // GUARDAR PROVEEDOR
  // ==========================================

  const guardarProveedor = async (e) => {

    e.preventDefault()

    try {

      const respuesta = await fetch(
        'http://localhost:8080/api/proveedores',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(proveedor)
        }
      )

      if (!respuesta.ok) {

        throw new Error(
          'No se pudo registrar el proveedor'
        )

      }

      const proveedorGuardado =
        await respuesta.json()


      // ==========================================
      // SUBIR FOTO
      // ==========================================

      if (foto) {

        const formularioFoto =
          new FormData()

        formularioFoto.append(
          'foto',
          foto
        )

        const respuestaFoto =
          await fetch(
            `http://localhost:8080/api/proveedores/${proveedorGuardado.idProveedor}/foto`,
            {
              method: 'POST',
              body: formularioFoto
            }
          )

        if (!respuestaFoto.ok) {

          throw new Error(
            'El proveedor se guardó, pero no se pudo subir la fotografía.'
          )

        }

      }


      alert(
        'Proveedor registrado correctamente.'
      )

      navigate('/proveedores')


    } catch (error) {

      console.error(error)

      alert(
        error.message ||
        'Ocurrió un error al registrar el proveedor.'
      )

    }

  }


  return (

    <>

      <style>{`

        /* ==================================================
           VARIABLES
        ================================================== */

        .registrar-page {

          --rp-bg: #f6f7f9;
          --rp-card: #ffffff;
          --rp-input: #ffffff;
          --rp-border: #e4e7ec;
          --rp-border-input: #d0d5dd;

          --rp-title: #1f2937;
          --rp-text: #344054;
          --rp-secondary: #7b8493;
          --rp-placeholder: #98a2b3;

          --rp-primary: #4f63d8;
          --rp-primary-hover: #4054c4;

          --rp-footer: #ffffff;

          --rp-photo-bg: #fafbfc;
          --rp-photo-border: #cbd1da;

          --rp-danger: #b42318;

          width: 100%;
          min-height: 100%;

          padding: 32px 42px 50px;

          box-sizing: border-box;

          background: var(--rp-bg);

          transition:
            background 0.25s ease,
            color 0.25s ease;

        }


        /* ==================================================
           MODO OSCURO
        ================================================== */

        body.dark .registrar-page,
        body.dark-mode .registrar-page,
        body[data-theme="dark"] .registrar-page {

          --rp-bg: #111827;
          --rp-card: #1f2937;
          --rp-input: #273244;

          --rp-border: #374151;
          --rp-border-input: #4b5563;

          --rp-title: #f3f4f6;
          --rp-text: #e5e7eb;
          --rp-secondary: #9ca3af;
          --rp-placeholder: #7f8a9a;

          --rp-primary: #6675e8;
          --rp-primary-hover: #7582ed;

          --rp-footer: #1f2937;

          --rp-photo-bg: #182231;
          --rp-photo-border: #4b5563;

          --rp-danger: #f87171;

        }


        /* ==================================================
           ENCABEZADO
        ================================================== */

        .registrar-header {

          max-width: 1150px;

          margin: 0 auto 28px;

        }


        .breadcrumb {

          display: flex;

          align-items: center;

          gap: 8px;

          margin-bottom: 11px;

          font-size: 13px;

          color: var(--rp-secondary);

        }


        .breadcrumb a {

          color: var(--rp-primary);

          text-decoration: none;

          font-weight: 500;

        }


        .breadcrumb a:hover {

          text-decoration: underline;

        }


        .registrar-header h1 {

          margin: 0;

          color: var(--rp-title);

          font-size: 29px;

          font-weight: 700;

          letter-spacing: -0.3px;

        }


        .registrar-header p {

          margin: 7px 0 0;

          color: var(--rp-secondary);

          font-size: 14px;

        }


        /* ==================================================
           TARJETA PRINCIPAL
        ================================================== */

        .registrar-card {

          width: 100%;

          max-width: 1150px;

          margin: 0 auto;

          background: var(--rp-card);

          border:
            1px solid var(--rp-border);

          border-radius: 12px;

          box-shadow:
            0 4px 18px
            rgba(16, 24, 40, 0.05);

          overflow: hidden;

          transition:
            background 0.25s ease,
            border-color 0.25s ease;

        }


        /* ==================================================
           SECCIONES
        ================================================== */

        .registrar-section {

          padding: 30px 36px;

          border-bottom:
            1px solid var(--rp-border);

        }


        .section-title {

          display: flex;

          align-items: center;

          gap: 13px;

          margin-bottom: 27px;

        }


        .section-line {

          width: 4px;

          height: 38px;

          border-radius: 4px;

          background: var(--rp-primary);

        }


        .section-title h2 {

          margin: 0;

          color: var(--rp-title);

          font-size: 17px;

          font-weight: 650;

        }


        .section-title p {

          margin: 4px 0 0;

          color: var(--rp-secondary);

          font-size: 13px;

        }


        /* ==================================================
           FORMULARIO
        ================================================== */

        .form-grid {

          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 21px 26px;

        }


        .form-field {

          display: flex;

          flex-direction: column;

        }


        .form-field label {

          margin-bottom: 7px;

          color: var(--rp-text);

          font-size: 13px;

          font-weight: 600;

        }


        .required {

          margin-left: 3px;

          color: #d92d20;

        }


        .form-field input,

        .form-field select {

          width: 100%;

          height: 45px;

          box-sizing: border-box;

          padding: 0 13px;

          border:
            1px solid var(--rp-border-input);

          border-radius: 7px;

          outline: none;

          background: var(--rp-input);

          color: var(--rp-text);

          font-size: 14px;

          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease,
            background 0.25s ease;

        }


        .form-field input::placeholder {

          color: var(--rp-placeholder);

        }


        .form-field input:hover,

        .form-field select:hover {

          border-color: var(--rp-primary);

        }


        .form-field input:focus,

        .form-field select:focus {

          border-color: var(--rp-primary);

          box-shadow:
            0 0 0 3px
            rgba(79, 99, 216, 0.12);

        }


        .form-field select {

          cursor: pointer;

        }


        /* ==================================================
           FOTO - VACÍA
        ================================================== */

        .photo-area {

          width: 100%;

        }


        .photo-empty {

          min-height: 225px;

          box-sizing: border-box;

          border:
            1px dashed var(--rp-photo-border);

          border-radius: 9px;

          background: var(--rp-photo-bg);

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          cursor: pointer;

          transition:
            border-color 0.2s ease,
            background 0.25s ease;

        }


        .photo-empty:hover {

          border-color: var(--rp-primary);

        }


        /* ==================================================
           ICONO DE CÁMARA
        ================================================== */

        .photo-symbol {

          width: 48px;

          height: 48px;

          border:
            1px solid var(--rp-border-input);

          border-radius: 8px;

          background: var(--rp-input);

          display: flex;

          align-items: center;

          justify-content: center;

          margin-bottom: 14px;

        }


        .camera-icon {

          position: relative;

          width: 20px;

          height: 14px;

          border:
            2px solid var(--rp-secondary);

          border-radius: 3px;

          box-sizing: border-box;

        }


        .camera-icon::before {

          content: '';

          position: absolute;

          width: 7px;

          height: 4px;

          top: -6px;

          left: 4px;

          border:
            2px solid var(--rp-secondary);

          border-bottom: none;

          border-radius: 3px 3px 0 0;

          box-sizing: border-box;

        }


        .camera-icon::after {

          content: '';

          position: absolute;

          width: 6px;

          height: 6px;

          top: 2px;

          left: 5px;

          border:
            2px solid var(--rp-secondary);

          border-radius: 50%;

          box-sizing: border-box;

        }


        .photo-empty h3 {

          margin: 0;

          color: var(--rp-text);

          font-size: 15px;

          font-weight: 600;

        }


        .photo-empty p {

          margin: 6px 0 15px;

          color: var(--rp-secondary);

          font-size: 13px;

        }


        .select-photo {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          padding: 9px 17px;

          border-radius: 7px;

          background: var(--rp-primary);

          color: #ffffff;

          font-size: 13px;

          font-weight: 600;

        }


        .photo-empty small {

          margin-top: 11px;

          color: var(--rp-secondary);

          font-size: 11px;

        }


        /* ==================================================
           FOTO SELECCIONADA
        ================================================== */

        .photo-selected {

          display: flex;

          align-items: center;

          gap: 24px;

          padding: 18px;

          border:
            1px solid var(--rp-border);

          border-radius: 9px;

          background: var(--rp-photo-bg);

        }


        .photo-preview {

          width: 155px;

          height: 155px;

          flex-shrink: 0;

          overflow: hidden;

          border-radius: 8px;

          background: var(--rp-input);

          border:
            1px solid var(--rp-border);

        }


        .photo-preview img {

          width: 100%;

          height: 100%;

          object-fit: cover;

          display: block;

        }


        .photo-details {

          flex: 1;

        }


        .photo-details h3 {

          margin: 0 0 7px;

          color: var(--rp-text);

          font-size: 15px;

          font-weight: 600;

        }


        .photo-details p {

          margin: 0 0 18px;

          color: var(--rp-secondary);

          font-size: 13px;

          word-break: break-word;

        }


        .photo-actions {

          display: flex;

          align-items: center;

          gap: 9px;

        }


        .change-photo {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          padding: 9px 15px;

          border-radius: 7px;

          background: var(--rp-primary);

          color: #ffffff;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

        }


        .remove-photo {

          padding: 8px 15px;

          border:
            1px solid var(--rp-border-input);

          border-radius: 7px;

          background: var(--rp-input);

          color: var(--rp-danger);

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

        }


        .remove-photo:hover {

          border-color: var(--rp-danger);

        }


        /* ==================================================
           FOOTER
        ================================================== */

        .form-footer {

          padding: 20px 36px;

          display: flex;

          justify-content: flex-end;

          align-items: center;

          gap: 10px;

          background: var(--rp-footer);

          transition:
            background 0.25s ease;

        }


        /* ==================================================
           CANCELAR
        ================================================== */

        .cancel-button {

          height: 42px;

          padding: 0 19px;

          display: flex;

          align-items: center;

          justify-content: center;

          box-sizing: border-box;

          border:
            1px solid var(--rp-border-input);

          border-radius: 7px;

          background: var(--rp-input);

          color: var(--rp-text);

          text-decoration: none;

          font-size: 13px;

          font-weight: 600;

          transition: 0.18s ease;

        }


        .cancel-button:hover {

          border-color: var(--rp-primary);

        }


        /* ==================================================
           GUARDAR
        ================================================== */

        .save-button {

          height: 42px;

          padding: 0 20px;

          display: flex;

          align-items: center;

          justify-content: center;

          border: none;

          border-radius: 7px;

          background: var(--rp-primary);

          color: #ffffff;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

          transition: 0.18s ease;

        }


        .save-button:hover {

          background: var(--rp-primary-hover);

        }


        /* ==================================================
           RESPONSIVE
        ================================================== */

        @media (max-width: 850px) {

          .registrar-page {

            padding: 22px 18px 40px;

          }


          .form-grid {

            grid-template-columns: 1fr;

          }


          .registrar-section {

            padding: 25px 20px;

          }


          .form-footer {

            padding: 20px;

            flex-direction: column-reverse;

          }


          .cancel-button,

          .save-button {

            width: 100%;

          }


          .photo-selected {

            flex-direction: column;

            align-items: center;

            text-align: center;

          }


          .photo-actions {

            justify-content: center;

          }

        }

      `}</style>


      {/* ==================================================
          PÁGINA
      ================================================== */}

      <div className="registrar-page">


        {/* ==================================================
            ENCABEZADO
        ================================================== */}

        <div className="registrar-header">

          <div className="breadcrumb">

            <Link to="/proveedores">
              Proveedores
            </Link>

            <span>/</span>

            <span>
              Registrar proveedor
            </span>

          </div>


          <h1>
            Registrar proveedor
          </h1>


          <p>
            Ingresa la información del nuevo proveedor.
          </p>

        </div>


        {/* ==================================================
            TARJETA
        ================================================== */}

        <div className="registrar-card">

          <form onSubmit={guardarProveedor}>


            {/* ==================================================
                INFORMACIÓN GENERAL
            ================================================== */}

            <div className="registrar-section">

              <div className="section-title">

                <div className="section-line"></div>

                <div>

                  <h2>
                    Información del proveedor
                  </h2>

                  <p>
                    Datos generales y de contacto.
                  </p>

                </div>

              </div>


              <div className="form-grid">


                <div className="form-field">

                  <label>

                    Nombre del proveedor

                    <span className="required">
                      *
                    </span>

                  </label>

                  <input
                    type="text"
                    name="nombre"
                    value={proveedor.nombre}
                    onChange={manejarCambio}
                    placeholder="Ej. Tech Solutions MX"
                    required
                  />

                </div>


                <div className="form-field">

                  <label>

                    Persona de contacto

                    <span className="required">
                      *
                    </span>

                  </label>

                  <input
                    type="text"
                    name="contacto"
                    value={proveedor.contacto}
                    onChange={manejarCambio}
                    placeholder="Ej. Laura Martínez"
                    required
                  />

                </div>


                <div className="form-field">

                  <label>

                    Correo electrónico

                    <span className="required">
                      *
                    </span>

                  </label>

                  <input
                    type="email"
                    name="correo"
                    value={proveedor.correo}
                    onChange={manejarCambio}
                    placeholder="contacto@empresa.com"
                    required
                  />

                </div>


                <div className="form-field">

                  <label>

                    Teléfono

                    <span className="required">
                      *
                    </span>

                  </label>

                  <input
                    type="tel"
                    name="telefono"
                    value={proveedor.telefono}
                    onChange={manejarCambio}
                    placeholder="55 1234 5678"
                    required
                  />

                </div>


                <div className="form-field">

                  <label>

                    RFC

                    <span className="required">
                      *
                    </span>

                  </label>

                  <input
                    type="text"
                    name="rfc"
                    value={proveedor.rfc}
                    onChange={manejarCambio}
                    placeholder="ABC123456789"
                    maxLength="13"
                    required
                  />

                </div>


                <div className="form-field">

                  <label>

                    Estado

                    <span className="required">
                      *
                    </span>

                  </label>

                  <select
                    name="estado"
                    value={proveedor.estado}
                    onChange={manejarCambio}
                  >

                    <option value="Activo">
                      Activo
                    </option>

                    <option value="Inactivo">
                      Inactivo
                    </option>

                  </select>

                </div>


              </div>

            </div>


            {/* ==================================================
                FOTOGRAFÍA
            ================================================== */}

            <div className="registrar-section">

              <div className="section-title">

                <div className="section-line"></div>

                <div>

                  <h2>
                    Fotografía del proveedor
                  </h2>

                  <p>
                    Imagen utilizada para identificar al proveedor.
                  </p>

                </div>

              </div>


              <div className="photo-area">


                {vistaPrevia ? (

                  <div className="photo-selected">


                    <div className="photo-preview">

                      <img
                        src={vistaPrevia}
                        alt="Vista previa del proveedor"
                      />

                    </div>


                    <div className="photo-details">

                      <h3>
                        Fotografía seleccionada
                      </h3>

                      <p>
                        {foto?.name}
                      </p>


                      <div className="photo-actions">


                        <label className="change-photo">

                          Cambiar fotografía

                          <input
                            type="file"
                            accept="image/*"
                            onChange={manejarFoto}
                            hidden
                          />

                        </label>


                        <button
                          type="button"
                          className="remove-photo"
                          onClick={quitarFoto}
                        >
                          Quitar fotografía
                        </button>


                      </div>

                    </div>

                  </div>


                ) : (


                  <label className="photo-empty">


                    <div className="photo-symbol">

                      <div className="camera-icon"></div>

                    </div>


                    <h3>
                      Seleccionar fotografía
                    </h3>


                    <p>
                      Agrega una imagen del proveedor.
                    </p>


                    <span className="select-photo">
                      Seleccionar archivo
                    </span>


                    <small>
                      Formatos permitidos: JPG, JPEG y PNG
                    </small>


                    <input
                      type="file"
                      accept="image/*"
                      onChange={manejarFoto}
                      hidden
                    />


                  </label>

                )}

              </div>

            </div>


            {/* ==================================================
                BOTONES
            ================================================== */}

            <div className="form-footer">


              <Link
                to="/proveedores"
                className="cancel-button"
              >
                Cancelar
              </Link>


              <button
                type="submit"
                className="save-button"
              >
                Guardar proveedor
              </button>


            </div>


          </form>

        </div>

      </div>

    </>
  )
}

export default RegistrarProveedor
