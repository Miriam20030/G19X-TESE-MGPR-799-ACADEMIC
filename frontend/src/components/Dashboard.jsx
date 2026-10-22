
import { useEffect, useState } from 'react'
import API_URL from '../config/api'

import GraficaClasificacion from '../dashboard/GraficaClasificacion'
import PromedioIndicadores from '../dashboard/PromedioIndicadores'
import UltimasEvaluaciones from '../dashboard/UltimasEvaluaciones'
import MejoresProveedores from '../dashboard/MejoresProveedores'
import ResumenSistema from '../dashboard/ResumenSistema'

export default function Dashboard({ modoOscuro, colorPrincipal }) {
  const [proveedores, setProveedores] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])

  // Colores del dashboard
  const colorTexto = modoOscuro ? '#f8fafc' : '#263238'

  const colorSecundario = modoOscuro
    ? '#cbd5e1'
    : '#687680'

  const colorTarjeta = modoOscuro
    ? '#1e293b'
    : '#ffffff'

  // Obtener los datos del backend
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuestaProveedores = await fetch(
          `${API_URL}/api/proveedores`,
          {
            credentials: 'include'
          }
        )

        const respuestaEvaluaciones = await fetch(
          `${API_URL}/api/evaluaciones`,
          {
            credentials: 'include'
          }
        )

        if (
          !respuestaProveedores.ok ||
          !respuestaEvaluaciones.ok
        ) {
          throw new Error('Error al obtener los datos')
        }

        const datosProveedores = await respuestaProveedores.json()
        const datosEvaluaciones = await respuestaEvaluaciones.json()

        setProveedores(datosProveedores)
        setEvaluaciones(datosEvaluaciones)
      } catch (error) {
        console.error('Error al cargar el dashboard:', error)
      }
    }

    obtenerDatos()
  }, [])

  // Estadísticas principales
  const totalProveedores = proveedores.length

  const proveedoresActivos = proveedores.filter(
    (proveedor) =>
      proveedor.estado?.toLowerCase() === 'activo'
  ).length

  const evaluacionesRiesgo = evaluaciones.filter(
    (evaluacion) =>
      evaluacion.clasificacion?.toLowerCase() === 'riesgo'
  ).length

  const promedioEvaluacion =
    evaluaciones.length > 0
      ? (
          evaluaciones.reduce(
            (total, evaluacion) =>
              total +
              (Number(evaluacion.calificacionFinal) || 0),
            0
          ) / evaluaciones.length
        ).toFixed(2)
      : '0.00'

  return (
    <div
      style={{
        color: colorTexto
      }}
    >
      {/* TÍTULO */}

      <div
        style={{
          marginBottom: '35px',
          paddingBottom: '22px',
          borderBottom: modoOscuro
            ? '1px solid #334155'
            : '1px solid #e1e6ea'
        }}
      >
        <h1
          style={{
            margin: 0,
            color: modoOscuro ? '#f8fafc' : '#1f2933',
            fontSize: '34px',
            fontWeight: '600',
            letterSpacing: '-0.8px',
            lineHeight: '1.2'
          }}
        >
          Resumen general
        </h1>

        <p
          style={{
            margin: '10px 0 0',
            color: modoOscuro ? '#94a3b8' : '#7a8791',
            fontSize: '15px',
            lineHeight: '1.6'
          }}
        >
          Visión general del desempeño y gestión de proveedores.
        </p>
      </div>

      {/* TARJETAS PRINCIPALES */}

      <div className="cards">
        <div className="card">
          <span>Total de proveedores</span>

          <strong style={{ color: colorPrincipal }}>
            {totalProveedores}
          </strong>
        </div>

        <div className="card">
          <span>Proveedores activos</span>

          <strong style={{ color: colorPrincipal }}>
            {proveedoresActivos}
          </strong>
        </div>

        <div className="card">
          <span>Proveedores en riesgo</span>

          <strong
            style={{
              color: modoOscuro ? '#fca5a5' : '#7a4b4b'
            }}
          >
            {evaluacionesRiesgo}
          </strong>
        </div>

        <div className="card">
          <span>Evaluación promedio</span>

          <strong style={{ color: colorPrincipal }}>
            {promedioEvaluacion}%
          </strong>
        </div>
      </div>

      {/* GRÁFICA DE CLASIFICACIÓN */}

      <GraficaClasificacion
        evaluaciones={evaluaciones}
        modoOscuro={modoOscuro}
        colorTexto={colorTexto}
        colorSecundario={colorSecundario}
        colorTarjeta={colorTarjeta}
      />

      {/* PROMEDIO DE INDICADORES */}

      <PromedioIndicadores
        evaluaciones={evaluaciones}
        modoOscuro={modoOscuro}
        colorTexto={colorTexto}
        colorSecundario={colorSecundario}
        colorTarjeta={colorTarjeta}
      />

      {/* ÚLTIMAS EVALUACIONES */}

      <UltimasEvaluaciones
        evaluaciones={evaluaciones}
        proveedores={proveedores}
        modoOscuro={modoOscuro}
        colorTexto={colorTexto}
        colorSecundario={colorSecundario}
        colorTarjeta={colorTarjeta}
      />

      {/* MEJORES PROVEEDORES */}

      <MejoresProveedores
        evaluaciones={evaluaciones}
        proveedores={proveedores}
        modoOscuro={modoOscuro}
        colorTexto={colorTexto}
        colorSecundario={colorSecundario}
        colorTarjeta={colorTarjeta}
      />

      {/* RESUMEN DEL SISTEMA */}

      <ResumenSistema
        proveedores={proveedores}
        evaluaciones={evaluaciones}
        modoOscuro={modoOscuro}
        colorTexto={colorTexto}
        colorSecundario={colorSecundario}
        colorTarjeta={colorTarjeta}
      />
    </div>
  )
}
