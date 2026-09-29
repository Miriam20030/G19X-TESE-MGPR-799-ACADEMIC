
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Proveedores.css'

function Proveedores() {

  const [proveedores, setProveedores] = useState([])
  const [cargando, setCargando] = useState(true)

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

      setProveedores(proveedoresActuales =>
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

  if (cargando) {
    return (
      <div className="proveedores-loading">
        <div className="proveedores-spinner"></div>
        <span>Cargando proveedores...</span>
      </div>
    )
  }

  return (
    <div className="proveedores-page">

      {/* ENCABEZADO */}

<div className="proveedores-header">

  <div className="proveedores-header-content">

    <h1>Proveedores</h1>

    <p>
      Administra y consulta la información de los proveedores registrados.
    </p>

  </div>

  <Link
    to="/registrar-proveedor"
    className="proveedores-btn-primary"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>

    Registrar proveedor
  </Link>

</div>



      {/* =========================================
          CONTADOR
      ========================================= */}

      <div className="proveedores-toolbar">

        <div className="proveedores-total">

          <strong>
            {proveedores.length}
          </strong>

          <span>
            {proveedores.length === 1
              ? 'proveedor registrado'
              : 'proveedores registrados'}
          </span>

        </div>

      </div>


      {/* =========================================
          LISTA DE PROVEEDORES
      ========================================= */}

      {proveedores.length === 0 ? (

        <div className="proveedores-empty">

          <div className="empty-icon">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M3 21h18" />
              <path d="M5 21V7l7-4 7 4v14" />
              <path d="M9 21v-5h6v5" />
              <path d="M9 10h.01" />
              <path d="M15 10h.01" />
            </svg>

          </div>

          <h2>
            No hay proveedores registrados
          </h2>

          <p>
            Registra un proveedor para comenzar a administrar tu información.
          </p>

          <Link
            to="/registrar-proveedor"
            className="proveedores-btn-primary"
          >
            Registrar proveedor
          </Link>

        </div>

      ) : (

        <div className="proveedores-grid">

          {proveedores.map((proveedor) => (

            <article
              className="proveedor-card"
              key={proveedor.idProveedor}
            >

              {/* FOTO */}

              <div className="proveedor-foto-container">

                {proveedor.fotoUrl ? (

                  <img
                    src={`http://localhost:8080${proveedor.fotoUrl}`}
                    alt={`Fotografía de ${proveedor.nombre}`}
                    className="proveedor-foto"
                  />

                ) : (

                  <div className="proveedor-foto-placeholder">

                    {proveedor.nombre
                      ?.charAt(0)
                      ?.toUpperCase() || 'P'}

                  </div>

                )}

              </div>


              {/* INFORMACIÓN */}

              <div className="proveedor-main">

                <div className="proveedor-nombre-row">

                  <div className="proveedor-nombre">

                    <h2>
                      {proveedor.nombre}
                    </h2>

                    <span>
                      Proveedor registrado
                    </span>

                  </div>

                  <span
                    className={
                      proveedor.estado === 'Activo'
                        ? 'proveedor-status proveedor-status-active'
                        : 'proveedor-status proveedor-status-inactive'
                    }
                  >

                    <span className="status-circle"></span>

                    {proveedor.estado}

                  </span>

                </div>


                {/* DATOS */}

                <div className="proveedor-info">

                  <div className="proveedor-info-item">

                    <span className="info-label">
                      Contacto
                    </span>

                    <span className="info-value">
                      {proveedor.contacto || 'No registrado'}
                    </span>

                  </div>


                  <div className="proveedor-info-item">

                    <span className="info-label">
                      Correo electrónico
                    </span>

                    <span
                      className="info-value"
                      title={proveedor.correo}
                    >
                      {proveedor.correo || 'No registrado'}
                    </span>

                  </div>


                  <div className="proveedor-info-item">

                    <span className="info-label">
                      Teléfono
                    </span>

                    <span className="info-value">
                      {proveedor.telefono || 'No registrado'}
                    </span>

                  </div>


                  <div className="proveedor-info-item">

                    <span className="info-label">
                      RFC
                    </span>

                    <span className="info-value">
                      {proveedor.rfc || 'No registrado'}
                    </span>

                  </div>

                </div>

              </div>


              {/* ACCIONES */}

              <div className="proveedor-actions">

                <Link
                  to={`/editar-proveedor/${proveedor.idProveedor}`}
                  className="proveedor-btn proveedor-btn-edit"
                >

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                  </svg>

                  Editar

                </Link>


                <button
                  className="proveedor-btn proveedor-btn-delete"
                  onClick={() =>
                    eliminarProveedor(
                      proveedor.idProveedor
                    )
                  }
                >

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 15H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>

                  Eliminar

                </button>

              </div>

            </article>

          ))}

        </div>

      )}

    </div>
  )
}

export default Proveedores
