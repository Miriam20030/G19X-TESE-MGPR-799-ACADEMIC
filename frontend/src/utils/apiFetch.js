
let manejarSesionExpirada = null
let sesionExpiradaEnProceso = false

export function configurarSesionExpirada(callback) {
  manejarSesionExpirada = callback
}

export async function apiFetch(url, opciones = {}) {
  const respuesta = await fetch(url, {
    ...opciones,
    credentials: 'include'
  })

  if (respuesta.status === 401 && !sesionExpiradaEnProceso) {
    sesionExpiradaEnProceso = true

    try {
      manejarSesionExpirada?.()
    } finally {
      sesionExpiradaEnProceso = false
    }
  }

  return respuesta
}
