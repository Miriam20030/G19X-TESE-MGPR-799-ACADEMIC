import { useState } from 'react'
import './Login.css'
import API_URL from '../config/api'

function Login({ onLogin }) {
    const [usuario, setUsuario] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    // ==========================================
    // INICIAR SESIÓN
    // ==========================================

    const iniciarSesion = async (e) => {
        e.preventDefault()

        if (!usuario.trim() || !password) {
            setError('Ingresa tu usuario y contraseña')
            return
        }

        setError('')
        setCargando(true)

        try {
            const respuesta = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        usuario: usuario.trim(),
                        password
                    })
                }
            )

            const data = await respuesta.json()

            if (!respuesta.ok) {
                setError(
                    data.mensaje ||
                    'Usuario o contraseña incorrectos'
                )
                return
            }

            // Guardar el usuario para la interfaz.
            // La autenticación real la gestiona el backend.
            localStorage.setItem(
                'usuario',
                data.usuario
            )

            // Notificar el inicio de sesión
            onLogin(data)

        } catch (error) {
            setError(
                'No se pudo conectar con el servidor'
            )
        } finally {
            setCargando(false)
        }
    }

    // ==========================================
    // DISEÑO DEL LOGIN
    // ==========================================

    return (
        <div className="login-page">

            {/* PANEL DE BIENVENIDA */}

            <div className="welcome-panel">
                <div className="welcome-content">

                    <div className="welcome-icon">
                        ✓
                    </div>

                    <h1>
                        Bienvenido
                    </h1>

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

            {/* PANEL DE INICIO DE SESIÓN */}

            <div className="login-panel">
                <div className="login-card">

                    <div className="login-header">

                        <div className="login-icon"></div>

                        <h2>
                            Iniciar sesión
                        </h2>

                        <p>
                            Ingresa tus datos para continuar
                        </p>

                    </div>

                    <form onSubmit={iniciarSesion}>

                        {/* USUARIO */}

                        <div className="input-group">

                            <label>
                                Usuario
                            </label>

                            <div className="input-wrapper">

                                <span></span>

                                <input
                                    type="text"
                                    placeholder="Ingresa tu usuario"
                                    value={usuario}
                                    onChange={(e) =>
                                        setUsuario(e.target.value)
                                    }
                                    autoComplete="username"
                                />

                            </div>

                        </div>

                        {/* CONTRASEÑA */}

                        <div className="input-group">

                            <label>
                                Contraseña
                            </label>

                            <div className="input-wrapper">

                                <span></span>

                                <input
                                    type="password"
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                />

                            </div>

                        </div>

                        {/* MENSAJE DE ERROR */}

                        {error && (
                            <div className="login-error" role="alert">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* BOTÓN DE INICIO DE SESIÓN */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={cargando}
                        >
                            {cargando
                                ? 'Ingresando...'
                                : 'Iniciar sesión'}
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