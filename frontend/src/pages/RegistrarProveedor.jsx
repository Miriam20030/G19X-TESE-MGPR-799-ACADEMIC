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

  const manejarCambio = (e) => {
    setProveedor({
      ...proveedor,
      [e.target.name]: e.target.value
    })
  }

  const manejarFoto = (e) => {

    const archivo = e.target.files[0]

    if (!archivo) {
      return
    }

    // Verificar que sea una imagen
    if (!archivo.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen.')
      return
    }

    console.log('Imagen seleccionada:', archivo)
    console.log('Nombre:', archivo.name)
    console.log('Tipo:', archivo.type)
    console.log('Tamaño:', archivo.size)

    setFoto(archivo)

    // Crear vista previa
    const url = URL.createObjectURL(archivo)
    setVistaPrevia(url)
  }

  const quitarFoto = () => {
    setFoto(null)
    setVistaPrevia(null)
  }

  const guardarProveedor = async (e) => {

    e.preventDefault()

    try {

      // ==========================================
      // 1. GUARDAR LOS DATOS DEL PROVEEDOR
      // ==========================================

      console.log('Guardando proveedor...')

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

      console.log('Respuesta proveedor:', respuesta.status)

      if (!respuesta.ok) {
        throw new Error('No se pudo registrar el proveedor')
      }

      // Obtener el proveedor recién creado
      const proveedorGuardado = await respuesta.json()

      console.log('Proveedor guardado:', proveedorGuardado)
      console.log('ID del proveedor:', proveedorGuardado.idProveedor)

      // ==========================================
      // 2. SUBIR LA FOTO SI SE SELECCIONÓ
      // ==========================================

      if (foto) {

        console.log('FOTO SELECCIONADA:', foto)
        console.log(
          'ID DEL PROVEEDOR PARA LA FOTO:',
          proveedorGuardado.idProveedor
        )

        const formularioFoto = new FormData()

        formularioFoto.append('foto', foto)

        console.log('ENVIANDO FOTO AL BACKEND...')

        const respuestaFoto = await fetch(
          `http://localhost:8080/api/proveedores/${proveedorGuardado.idProveedor}/foto`,
          {
            method: 'POST',
            body: formularioFoto
          }
        )

        console.log(
          'RESPUESTA DE FOTO:',
          respuestaFoto.status
        )

        if (!respuestaFoto.ok) {
          throw new Error(
            'El proveedor se guardó, pero no se pudo subir la foto'
          )
        }

        console.log('FOTO SUBIDA CORRECTAMENTE')
      } else {

        console.log('NO SE SELECCIONÓ NINGUNA FOTO')
      }

      alert('Proveedor registrado correctamente')

      navigate('/proveedores')

    } catch (error) {

      console.error('ERROR COMPLETO:', error)

      alert(
        error.message ||
        'Ocurrió un error al registrar el proveedor'
      )
    }
  }

  return (
    <div>

      <div className="page-header">

        <div>

          <h1>Registrar proveedor</h1>

          <p>
            Ingresa la información del nuevo proveedor.
          </p>

        </div>

      </div>

      <div className="panel">

        <h2>Información del proveedor</h2>

        <form onSubmit={guardarProveedor}>

          <div className="form-grid">

            <div className="form-group">

              <label>
                Nombre del proveedor
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

            <div className="form-group">

              <label>
                Persona de contacto
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

            <div className="form-group">

              <label>
                Correo electrónico
              </label>

              <input
                type="email"
                name="correo"
                value={proveedor.correo}
                onChange={manejarCambio}
                placeholder="Ej. contacto@empresa.com"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Teléfono
              </label>

              <input
                type="tel"
                name="telefono"
                value={proveedor.telefono}
                onChange={manejarCambio}
                placeholder="Ej. 55 1234 5678"
                required
              />

            </div>

            <div className="form-group">

              <label>
                RFC
              </label>

              <input
                type="text"
                name="rfc"
                value={proveedor.rfc}
                onChange={manejarCambio}
                placeholder="Ej. ABC123456789"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Estado
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

          {/* ==========================================
              FOTO DEL PROVEEDOR
          ========================================== */}

          <div className="foto-formulario">

            <label className="foto-titulo">
              Fotografía del proveedor
            </label>

            <div className="foto-contenedor">

              {vistaPrevia ? (

                <div className="foto-preview">

                  <img
                    src={vistaPrevia}
                    alt="Vista previa"
                  />

                  <button
                    type="button"
                    className="btn-quitar-foto"
                    onClick={quitarFoto}
                  >
                    Quitar foto
                  </button>

                </div>

              ) : (

                <div className="foto-vacia">

                  <div className="foto-icono">
                    +
                  </div>

                  <p>
                    No se ha seleccionado una fotografía
                  </p>

                  <label className="btn-seleccionar-foto">

                    Seleccionar foto

                    <input
                      type="file"
                      accept="image/*"
                      onChange={manejarFoto}
                      hidden
                    />

                  </label>

                </div>

              )}

            </div>

            {vistaPrevia && (

              <label className="btn-cambiar-foto">

                Cambiar foto

                <input
                  type="file"
                  accept="image/*"
                  onChange={manejarFoto}
                  hidden
                />

              </label>

            )}

          </div>

          {/* ==========================================
              BOTONES
          ========================================== */}

          <div className="form-buttons">

            <Link
              to="/proveedores"
              className="btn-secondary"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="btn-primary"
            >
              Guardar proveedor
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default RegistrarProveedor