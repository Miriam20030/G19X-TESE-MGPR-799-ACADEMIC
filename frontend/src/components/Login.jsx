import { useState } from 'react'
import './Login.css'

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const iniciarSesion = async (e) => {
    e.preventDefault()

    if (!usuario || !password) {
      setError('Ingresa tu usuario y contraseña')
      return
    }

    setError('')
    setCargando(true)

    try {
      const respuesta = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuario,
          password
        })
      })

      const data = await respuesta.json()

      if (!respuesta.ok) {
        setError(data.mensaje || 'Usuario o contraseña incorrectos')
        return
      }

      localStorage.setItem('usuario', JSON.stringify(data))
      onLogin(data)

    } catch (error) {
      setError('No se pudo conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-page">

      {/* PANEL DE BIENVENIDA */}
      <div className="welcome-panel">

        <div className="welcome-content">

          <div className="welcome-icon">
            ✓
          </div>

          <h1>Bienvenido</h1>

          <h2>
            Sistema de Evaluación
            <br />
            de Proveedores
          </h2>

          <p>
            Gestiona, evalúa y supervisa el desempeño
            de tus proveedores desde un solo lugar.
          </p>

          <div className="welcome-line"></div>

          <span className="welcome-footer">
            Gestión eficiente • Evaluación • Control
          </span>

        </div>

      </div>

      {/* PANEL DE LOGIN */}
      <div className="login-panel">

        <div className="login-card">

          <div className="login-header">

            <div className="login-icon">
              
            </div>

            <h2>Iniciar sesión</h2>

            <p>
              Ingresa tus datos para continuar
            </p>

          </div>

          <form onSubmit={iniciarSesion}>

            <div className="input-group">
              <label>Usuario</label>

              <div className="input-wrapper">
                <span></span>

                <input
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Contraseña</label>

              <div className="input-wrapper">
                <span></span>

                <input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="login-error">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={cargando}
            >
              {cargando ? 'Ingresando...' : 'Iniciar sesión'}
            </button>

          </form>

          <div className="login-footer">
            Sistema de Evaluación de Proveedores
          </div>

        </div>

      </div>

    </div>
  )
}

export default Login