
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

  // Obtener los datos del proveedor
  useEffect(() => {

    const obtenerProveedor = async () => {

      try {

        const respuesta = await fetch(
          `http://localhost:8080/api/proveedores/${id}`
        )

        if (!respuesta.ok) {
          throw new Error(
            `Error del servidor: ${respuesta.status}`
          )
        }

        const datos = await respuesta.json()

        console.log('Proveedor recibido:', datos)

        setProveedor({
          nombre: datos.nombre || '',
          contacto: datos.contacto || '',
          correo: datos.correo || '',
          telefono: datos.telefono || '',
          rfc: datos.rfc || '',
          estado: datos.estado || ''
        })

      } catch (error) {

        console.error('Error al cargar proveedor:', error)

        alert('Error al cargar el proveedor')

      } finally {

        setCargando(false)

      }
    }

    obtenerProveedor()

  }, [id])


  // Cambiar los datos del formulario
  const manejarCambio = (e) => {

    setProveedor({
      ...proveedor,
      [e.target.name]: e.target.value
    })

  }


  // Guardar cambios
  const guardarCambios = async (e) => {

    e.preventDefault()

    try {

      console.log('Enviando proveedor:', proveedor)

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

        console.error('Respuesta del servidor:', mensaje)

        throw new Error(
          `Error ${respuesta.status}: ${mensaje}`
        )
      }

      alert('Proveedor actualizado correctamente')

      navigate('/proveedores')

    } catch (error) {

      console.error('Error al actualizar proveedor:', error)

      alert('Error al actualizar el proveedor')

    }

  }


  if (cargando) {

    return (
      <div className="panel">
        <p>Cargando proveedor...</p>
      </div>
    )

  }


  return (

    <div>

      <div className="page-header">

        <div>

          <h1>Editar proveedor</h1>

          <p>
            Modifica la información del proveedor.
          </p>

        </div>

      </div>


      <div className="panel">

        <form onSubmit={guardarCambios}>

          <div>

            <label>
              Nombre
            </label>

            <input
              type="text"
              name="nombre"
              value={proveedor.nombre}
              onChange={manejarCambio}
              required
            />

          </div>


          <div>

            <label>
              Contacto
            </label>

            <input
              type="text"
              name="contacto"
              value={proveedor.contacto}
              onChange={manejarCambio}
              required
            />

          </div>


          <div>

            <label>
              Correo
            </label>

            <input
              type="email"
              name="correo"
              value={proveedor.correo}
              onChange={manejarCambio}
              required
            />

          </div>


          <div>

            <label>
              Teléfono
            </label>

            <input
              type="text"
              name="telefono"
              value={proveedor.telefono}
              onChange={manejarCambio}
              required
            />

          </div>


          <div>

            <label>
              RFC
            </label>

            <input
              type="text"
              name="rfc"
              value={proveedor.rfc}
              onChange={manejarCambio}
              maxLength="13"
            />

          </div>


          <div>

            <label>
              Estado
            </label>

            <select
              name="estado"
              value={proveedor.estado}
              onChange={manejarCambio}
              required
            >

              <option value="">
                Selecciona un estado
              </option>

              <option value="Activo">
                Activo
              </option>

              <option value="Inactivo">
                Inactivo
              </option>

            </select>

          </div>


          <br />

          <button type="submit">
            Guardar cambios
          </button>

          <button
            type="button"
            onClick={() => navigate('/proveedores')}
          >
            Cancelar
          </button>

        </form>

      </div>

    </div>

  )
}

export default EditarProveedor

