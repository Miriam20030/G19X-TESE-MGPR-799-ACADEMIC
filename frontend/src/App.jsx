
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'

import Dashboard from './components/Dashboard'

import Proveedores from './pages/Proveedores'
import RegistrarProveedor from './pages/RegistrarProveedor'
import EditarProveedor from './pages/EditarProveedor'
import Evaluaciones from './pages/Evaluaciones'
import NuevaEvaluacion from './pages/NuevaEvaluacion'
import Alertas from './pages/Alertas'
import Configuracion from './pages/Configuracion'
import Reportes from './pages/reportes'
import Login from './components/Login'

/* =====================================================
   APLICACIÓN PRINCIPAL
   ===================================================== */

function App() {
  // ==============================
  // USUARIO LOGUEADO
  // ==============================

  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario')

    if (!guardado) {
      return null
    }

    try {
      return JSON.parse(guardado)
    } catch (error) {
      localStorage.removeItem('usuario')
      return null
    }
  })

  // ==============================
  // MODO OSCURO
  // ==============================

  const [modoOscuro, setModoOscuro] = useState(() => {
    const guardado = localStorage.getItem('modoOscuro')
    return guardado === 'true'
  })

  // ==============================
  // COLOR PRINCIPAL
  // ==============================

  const [colorPrincipal, setColorPrincipal] = useState(() => {
    return localStorage.getItem('colorPrincipal') || '#29465f'
  })

  // ==============================
  // APLICAR MODO OSCURO GLOBAL
  // ==============================

  useEffect(() => {
    document.body.classList.toggle('dark-mode', modoOscuro)

    document.documentElement.style.colorScheme = modoOscuro
      ? 'dark'
      : 'light'
  }, [modoOscuro])

  // ==============================
  // APLICAR COLOR PRINCIPAL GLOBAL
  // ==============================

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--color-principal',
      colorPrincipal
    )
  }, [colorPrincipal])

  // ==============================
  // GUARDAR MODO OSCURO
  // ==============================

  useEffect(() => {
    localStorage.setItem('modoOscuro', modoOscuro)
  }, [modoOscuro])

  // ==============================
  // GUARDAR COLOR
  // ==============================

  useEffect(() => {
    localStorage.setItem('colorPrincipal', colorPrincipal)
  }, [colorPrincipal])

  // ==============================
  // LOGIN
  // ==============================

  if (!usuario) {
    return (
      <Login
        onLogin={(datosUsuario) => {
          // Al iniciar sesión, establecer siempre la ruta de Inicio.
          window.history.replaceState(null, '', '/')
          setUsuario(datosUsuario)
        }}
      />
    )
  }

  // ==============================
  // CERRAR SESIÓN
  // ==============================

  const cerrarSesion = () => {
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return (
    <BrowserRouter>
      <div
        className="app"
        style={{
          backgroundColor: modoOscuro ? '#0f172a' : '#f4f6f8',
          color: modoOscuro ? '#f8fafc' : '#263238',
          minHeight: '100vh',
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}
      >
        {/* MENÚ LATERAL */}

        <aside
          className="sidebar"
          style={{
            backgroundColor: modoOscuro ? '#111827' : undefined
          }}
        >
          <div className="logo">
            <h2>Evaluación de Proveedores</h2>
            <span>Sistema inteligente</span>
          </div>

          {/* USUARIO */}

          <div
            style={{
              padding: '15px 20px',
              margin: '10px 15px 20px',
              borderRadius: '8px',
              backgroundColor: modoOscuro ? '#1e293b' : '#f1f5f8',
              border: `1px solid ${modoOscuro ? '#334155' : '#e2e8f0'}`
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: modoOscuro ? '#94a3b8' : '#687680',
                marginBottom: '4px'
              }}
            >
              Sesión iniciada como
            </div>

            <strong>{usuario.nombre || usuario.usuario}</strong>
          </div>

          <nav>
            <Link to="/">Inicio</Link>
            <Link to="/proveedores">Proveedores</Link>
            <Link to="/evaluaciones">Evaluaciones</Link>
            <Link to="/alertas">Alertas</Link>
            <Link to="/reportes">Reportes</Link>
            <Link to="/configuracion">Configuración</Link>
          </nav>

          {/* CERRAR SESIÓN */}

          <div
            style={{
              marginTop: 'auto',
              padding: '20px'
            }}
          >
            <button
              onClick={cerrarSesion}
              style={{
                width: '100%',
                padding: '11px 15px',
                border: 'none',
                borderRadius: '7px',
                backgroundColor: modoOscuro ? '#334155' : '#e9eef2',
                color: modoOscuro ? '#f8fafc' : '#263238',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}

        <main
          className="main"
          style={{
            backgroundColor: modoOscuro ? '#0f172a' : undefined,
            transition: 'background-color 0.3s ease'
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  modoOscuro={modoOscuro}
                  colorPrincipal={colorPrincipal}
                />
              }
            />

            <Route
              path="/proveedores"
              element={<Proveedores />}
            />

            <Route
              path="/alertas"
              element={<Alertas />}
            />

            <Route
              path="/evaluaciones"
              element={<Evaluaciones />}
            />

            <Route
              path="/nueva-evaluacion"
              element={<NuevaEvaluacion />}
            />

            <Route
              path="/registrar-proveedor"
              element={<RegistrarProveedor />}
            />

            <Route
              path="/editar-proveedor/:id"
              element={<EditarProveedor />}
            />

            <Route
              path="/reportes"
              element={<Reportes />}
            />

            <Route
              path="/configuracion"
              element={
                <Configuracion
                  modoOscuro={modoOscuro}
                  setModoOscuro={setModoOscuro}
                  colorPrincipal={colorPrincipal}
                  setColorPrincipal={setColorPrincipal}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
