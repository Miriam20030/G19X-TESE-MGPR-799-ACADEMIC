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
  const [guardando, setGuardando] = useState(false)

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
        alert('Error al cargar el proveedor')

      } finally {

        setCargando(false)

      }

    }

    obtenerProveedor()

  }, [id])


  const manejarCambio = (e) => {

    setProveedor({
      ...proveedor,
      [e.target.name]: e.target.value
    })

  }


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

      alert('Proveedor actualizado correctamente')

      navigate('/proveedores')

    } catch (error) {

      console.error(error)
      alert('Error al actualizar el proveedor')

    } finally {

      setGuardando(false)

    }

  }


  if (cargando) {

    return (
      <div style={styles.loading}>
        Cargando información del proveedor...
      </div>
    )

  }


  return (

    <div style={styles.container}>

      <div style={styles.pageHeader}>

        <div>

          <div style={styles.breadcrumb}>
            Proveedores / Editar
          </div>

          <h1 style={styles.title}>
            Editar proveedor
          </h1>

          <p style={styles.subtitle}>
            Actualiza la información registrada del proveedor.
          </p>

        </div>

        <button
          type="button"
          onClick={() => navigate('/proveedores')}
          style={styles.backButton}
        >
          ← Regresar
        </button>

      </div>


      <div style={styles.card}>

        <div style={styles.cardHeader}>

          <div style={styles.avatar}>
            {proveedor.nombre
              ? proveedor.nombre.charAt(0).toUpperCase()
              : 'P'}
          </div>

          <div>

            <h2 style={styles.cardTitle}>
              {proveedor.nombre || 'Proveedor'}
            </h2>

            <p style={styles.cardSubtitle}>
              ID del proveedor: #{id}
            </p>

          </div>

        </div>


        <form onSubmit={guardarCambios}>

          <div style={styles.section}>

            <h3 style={styles.sectionTitle}>
              Información del proveedor
            </h3>

            <div style={styles.line}></div>

            <div style={styles.grid}>

              <div style={styles.field}>

                <label style={styles.label}>
                  Nombre del proveedor
                </label>

                <input
                  type="text"
                  name="nombre"
                  value={proveedor.nombre}
                  onChange={manejarCambio}
                  required
                  style={styles.input}
                  placeholder="Nombre del proveedor"
                />

              </div>


              <div style={styles.field}>

                <label style={styles.label}>
                  RFC
                </label>

                <input
                  type="text"
                  name="rfc"
                  value={proveedor.rfc}
                  onChange={manejarCambio}
                  maxLength="13"
                  style={styles.input}
                  placeholder="RFC"
                />

              </div>

            </div>

          </div>


          <div style={styles.section}>

            <h3 style={styles.sectionTitle}>
              Datos de contacto
            </h3>

            <div style={styles.line}></div>

            <div style={styles.grid}>

              <div style={styles.field}>

                <label style={styles.label}>
                  Persona de contacto
                </label>

                <input
                  type="text"
                  name="contacto"
                  value={proveedor.contacto}
                  onChange={manejarCambio}
                  required
                  style={styles.input}
                  placeholder="Nombre del contacto"
                />

              </div>


              <div style={styles.field}>

                <label style={styles.label}>
                  Teléfono
                </label>

                <input
                  type="text"
                  name="telefono"
                  value={proveedor.telefono}
                  onChange={manejarCambio}
                  required
                  style={styles.input}
                  placeholder="Teléfono"
                />

              </div>


              <div style={styles.fieldFull}>

                <label style={styles.label}>
                  Correo electrónico
                </label>

                <input
                  type="email"
                  name="correo"
                  value={proveedor.correo}
                  onChange={manejarCambio}
                  required
                  style={styles.input}
                  placeholder="correo@empresa.com"
                />

              </div>

            </div>

          </div>


          <div style={styles.section}>

            <h3 style={styles.sectionTitle}>
              Estado del proveedor
            </h3>

            <div style={styles.line}></div>

            <div style={styles.estadoContainer}>

              <label
                style={{
                  ...styles.estadoOption,
                  ...(proveedor.estado === 'Activo'
                    ? styles.estadoActivo
                    : {})
                }}
              >

                <input
                  type="radio"
                  name="estado"
                  value="Activo"
                  checked={proveedor.estado === 'Activo'}
                  onChange={manejarCambio}
                />

                <div>
                  <strong>Activo</strong>
                  <span>
                    El proveedor puede operar normalmente.
                  </span>
                </div>

              </label>


              <label
                style={{
                  ...styles.estadoOption,
                  ...(proveedor.estado === 'Inactivo'
                    ? styles.estadoInactivo
                    : {})
                }}
              >

                <input
                  type="radio"
                  name="estado"
                  value="Inactivo"
                  checked={proveedor.estado === 'Inactivo'}
                  onChange={manejarCambio}
                />

                <div>
                  <strong>Inactivo</strong>
                  <span>
                    El proveedor no está operando actualmente.
                  </span>
                </div>

              </label>

            </div>

          </div>


          <div style={styles.footer}>

            <button
              type="button"
              onClick={() => navigate('/proveedores')}
              style={styles.cancelButton}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              style={styles.saveButton}
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

  )
}


const styles = {

  container: {
    minHeight: '100vh',
    background: '#f6f7f9',
    padding: '32px'
  },

  pageHeader: {
    maxWidth: '950px',
    margin: '0 auto 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },

  breadcrumb: {
    fontSize: '13px',
    color: '#8a94a6',
    marginBottom: '8px'
  },

  title: {
    margin: 0,
    color: '#202938',
    fontSize: '29px',
    fontWeight: '700'
  },

  subtitle: {
    margin: '6px 0 0',
    color: '#727d8d',
    fontSize: '14px'
  },

  backButton: {
    padding: '10px 17px',
    border: '1px solid #d9dee7',
    borderRadius: '8px',
    background: '#ffffff',
    color: '#465164',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  card: {
    maxWidth: '950px',
    margin: '0 auto',
    background: '#ffffff',
    border: '1px solid #e3e7ed',
    borderRadius: '14px',
    boxShadow: '0 5px 20px rgba(31, 41, 55, 0.05)',
    overflow: 'hidden'
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '24px 30px',
    borderBottom: '1px solid #edf0f3'
  },

  avatar: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    background: '#eef2f7',
    color: '#334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700'
  },

  cardTitle: {
    margin: 0,
    color: '#202938',
    fontSize: '18px',
    fontWeight: '700'
  },

  cardSubtitle: {
    margin: '4px 0 0',
    color: '#8a94a6',
    fontSize: '13px'
  },

  section: {
    padding: '25px 30px 5px'
  },

  sectionTitle: {
    margin: 0,
    fontSize: '15px',
    color: '#273142',
    fontWeight: '700'
  },

  line: {
    height: '1px',
    background: '#edf0f3',
    margin: '12px 0 20px'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px 22px'
  },

  field: {
    display: 'flex',
    flexDirection: 'column'
  },

  fieldFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column'
  },

  label: {
    marginBottom: '7px',
    color: '#465164',
    fontSize: '13px',
    fontWeight: '600'
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 12px',
    border: '1px solid #d7dce4',
    borderRadius: '7px',
    background: '#ffffff',
    color: '#273142',
    fontSize: '14px',
    outline: 'none'
  },

  estadoContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },

  estadoOption: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '11px',
    padding: '15px',
    border: '1px solid #dfe3e9',
    borderRadius: '9px',
    cursor: 'pointer',
    background: '#ffffff',
    color: '#344054'
  },

  estadoActivo: {
    border: '1px solid #86efac',
    background: '#f0fdf4'
  },

  estadoInactivo: {
    border: '1px solid #fca5a5',
    background: '#fef2f2'
  },

  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '25px 30px',
    marginTop: '25px',
    background: '#fafbfc',
    borderTop: '1px solid #edf0f3'
  },

  cancelButton: {
    padding: '11px 20px',
    border: '1px solid #d7dce4',
    borderRadius: '7px',
    background: '#ffffff',
    color: '#465164',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  saveButton: {
    padding: '11px 22px',
    border: 'none',
    borderRadius: '7px',
    background: '#202938',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  loading: {
    minHeight: '60vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#687386',
    fontSize: '14px'
  }

}

export default EditarProveedor