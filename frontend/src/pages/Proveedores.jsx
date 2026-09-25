
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Proveedores() {

  const [proveedores, setProveedores] = useState([])
  const [cargando, setCargando] = useState(true)


  // ==========================================
  // OBTENER PROVEEDORES
  // ==========================================

  const obtenerProveedores = async () => {

    try {

      const respuesta = await fetch(
        'http://localhost:8080/api/proveedores'
      )

      if (!respuesta.ok) {
        throw new Error('No se pudieron obtener los proveedores')
      }

      const datos = await respuesta.json()

      setProveedores(datos)

    } catch (error) {

      console.error(error)

      alert('Error al cargar los proveedores')

    } finally {

      setCargando(false)

    }

  }


  useEffect(() => {

    obtenerProveedores()

  }, [])


  // ==========================================
  // ELIMINAR PROVEEDOR
  // ==========================================

  const eliminarProveedor = async (id) => {

    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar este proveedor?'
    )

    if (!confirmar) {
      return
    }


    try {

      const respuesta = await fetch(
        `http://localhost:8080/api/proveedores/${id}`,
        {
          method: 'DELETE'
        }
      )


      if (!respuesta.ok) {
        throw new Error('No se pudo eliminar el proveedor')
      }


      setProveedores(
        proveedoresActuales =>
          proveedoresActuales.filter(
            proveedor =>
              proveedor.idProveedor !== id
          )
      )


      alert('Proveedor eliminado correctamente')


    } catch (error) {

      console.error(error)

      alert('Error al eliminar el proveedor')

    }

  }


  // ==========================================
  // CARGANDO
  // ==========================================

  if (cargando) {

    return (

      <div className="panel">

        <p>
          Cargando proveedores...
        </p>

      </div>

    )

  }


  // ==========================================
  // PÁGINA
  // ==========================================

  return (

    <div className="proveedores-page">


      {/* ======================================
          ENCABEZADO
          ====================================== */}

      <div className="page-header">

        <div>

          <h1>
            Proveedores
          </h1>

          <p>
            Administra y consulta la información de los proveedores registrados.
          </p>

        </div>


        <Link
          to="/registrar-proveedor"
          className="btn-primary"
        >
          Registrar proveedor
        </Link>

      </div>


      {/* ======================================
          CONTENEDOR DE TARJETAS
          ====================================== */}

      <div className="proveedores-container">


        {proveedores.length === 0 ? (

          <div className="panel">

            <p>
              No hay proveedores registrados.
            </p>

          </div>

        ) : (


          proveedores.map((proveedor) => (

            <div
              className="proveedor-card"
              key={proveedor.idProveedor}
            >


              {/* =================================
                  FOTO
                  ================================= */}

              <div className="proveedor-foto">

                {proveedor.fotoUrl ? (

                  <img
                    src={`http://localhost:8080${proveedor.fotoUrl}`}
                    alt={`Fotografía de ${proveedor.nombre}`}
                    className="proveedor-foto-imagen"
                  />

                ) : (

                  <div className="proveedor-foto-placeholder">

                    <span>
                      {proveedor.nombre
                        ?.charAt(0)
                        ?.toUpperCase() || 'P'}
                    </span>

                  </div>

                )}

              </div>


              {/* =================================
                  NOMBRE
                  ================================= */}

              <div className="proveedor-nombre">

                <h2>
                  {proveedor.nombre}
                </h2>

                <span>
                  Proveedor registrado
                </span>

              </div>


              {/* =================================
                  INFORMACIÓN
                  ================================= */}

              <div className="proveedor-datos">


                <div className="dato-proveedor">

                  <span className="dato-label">
                    Contacto
                  </span>

                  <span className="dato-valor">
                    {proveedor.contacto || 'No registrado'}
                  </span>

                </div>


                <div className="dato-proveedor">

                  <span className="dato-label">
                    Correo electrónico
                  </span>

                  <span className="dato-valor">
                    {proveedor.correo || 'No registrado'}
                  </span>

                </div>


                <div className="dato-proveedor">

                  <span className="dato-label">
                    Teléfono
                  </span>

                  <span className="dato-valor">
                    {proveedor.telefono || 'No registrado'}
                  </span>

                </div>


                <div className="dato-proveedor">

                  <span className="dato-label">
                    RFC
                  </span>

                  <span className="dato-valor">
                    {proveedor.rfc || 'No registrado'}
                  </span>

                </div>


                <div className="dato-proveedor estado-proveedor">

                  <span className="dato-label">
                    Estado
                  </span>


                  <span
                    className={
                      proveedor.estado === 'Activo'
                        ? 'status active'
                        : 'status risk'
                    }
                  >
                    {proveedor.estado}
                  </span>

                </div>


              </div>


              {/* =================================
                  BOTONES
                  ================================= */}

              <div className="proveedor-botones">


                <Link
                  to={`/editar-proveedor/${proveedor.idProveedor}`}
                  className="btn-editar"
                >
                  Editar
                </Link>


                <button
                  className="btn-eliminar"
                  onClick={() =>
                    eliminarProveedor(
                      proveedor.idProveedor
                    )
                  }
                >
                  Eliminar
                </button>


              </div>


            </div>

          ))

        )}

      </div>

    </div>

  )

}

export default Proveedores

