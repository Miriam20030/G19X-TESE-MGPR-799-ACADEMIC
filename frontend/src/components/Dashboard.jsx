
import { useEffect, useState } from 'react'
import API_URL from '../config/api'

export default function Dashboard({ modoOscuro, colorPrincipal }) {
  const [proveedores, setProveedores] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])

  useEffect(() => {
    obtenerDatos()
  }, [])

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

      if (!respuestaProveedores.ok || !respuestaEvaluaciones.ok) {
        throw new Error('Error al obtener los datos')
      }

      const datosProveedores = await respuestaProveedores.json()
      const datosEvaluaciones = await respuestaEvaluaciones.json()

      setProveedores(datosProveedores)
      setEvaluaciones(datosEvaluaciones)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // ==============================
  // ESTADÍSTICAS PRINCIPALES
  // ==============================

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
      : 0

  // ==============================
  // DATOS PARA LA GRÁFICA
  // ==============================

  const cantidadExcelente = evaluaciones.filter(
    (evaluacion) =>
      evaluacion.clasificacion?.toLowerCase() === 'excelente'
  ).length

  const cantidadBueno = evaluaciones.filter(
    (evaluacion) =>
      evaluacion.clasificacion?.toLowerCase() === 'bueno'
  ).length

  const cantidadRegular = evaluaciones.filter(
    (evaluacion) =>
      evaluacion.clasificacion?.toLowerCase() === 'regular'
  ).length

  const cantidadRiesgo = evaluaciones.filter(
    (evaluacion) =>
      evaluacion.clasificacion?.toLowerCase() === 'riesgo'
  ).length

  const maximoGrafica = Math.max(
    cantidadExcelente,
    cantidadBueno,
    cantidadRegular,
    cantidadRiesgo,
    1
  )

  // ==============================
  // COLORES
  // ==============================

  const colorTexto = modoOscuro ? '#f8fafc' : '#263238'

  const colorSecundario = modoOscuro
    ? '#cbd5e1'
    : '#687680'

  const colorTarjeta = modoOscuro
    ? '#1e293b'
    : '#ffffff'

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
            color: modoOscuro
              ? '#f8fafc'
              : '#1f2933',
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
            color: modoOscuro
              ? '#94a3b8'
              : '#7a8791',
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

          <strong
            style={{
              color: colorPrincipal
            }}
          >
            {totalProveedores}
          </strong>
        </div>

        <div className="card">
          <span>Proveedores activos</span>

          <strong
            style={{
              color: colorPrincipal
            }}
          >
            {proveedoresActivos}
          </strong>
        </div>

        <div className="card">
          <span>Proveedores en riesgo</span>

          <strong
            style={{
              color: modoOscuro
                ? '#fca5a5'
                : '#7a4b4b'
            }}
          >
            {evaluacionesRiesgo}
          </strong>
        </div>

        <div className="card">
          <span>Evaluación promedio</span>

          <strong
            style={{
              color: colorPrincipal
            }}
          >
            {promedioEvaluacion}%
          </strong>
        </div>
      </div>

      {/* GRÁFICA DE CLASIFICACIÓN */}

      <div
        style={{
          marginTop: '30px',
          backgroundColor: colorTarjeta,
          padding: '25px',
          borderRadius: '10px',
          border: modoOscuro
            ? '1px solid #334155'
            : '1px solid #e3e8ec',
          boxShadow: modoOscuro
            ? '0 2px 8px rgba(0,0,0,0.18)'
            : '0 2px 6px rgba(24,39,52,0.04)'
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: '5px',
            fontSize: '18px',
            fontWeight: '600',
            color: colorTexto
          }}
        >
          Proveedores por clasificación
        </h2>

        <p
          style={{
            color: colorSecundario,
            marginTop: 0,
            marginBottom: '30px'
          }}
        >
          Distribución de las evaluaciones según su nivel de desempeño.
        </p>

        <div
          style={{
            height: '300px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            gap: '25px',
            padding: '0 20px',
            borderBottom: `2px solid ${
              modoOscuro ? '#475569' : '#e2e8f0'
            }`
          }}
        >
          {[
            {
              nombre: 'Excelente',
              cantidad: cantidadExcelente,
              color: '#5f7f6a'
            },
            {
              nombre: 'Bueno',
              cantidad: cantidadBueno,
              color: '#6689a5'
            },
            {
              nombre: 'Regular',
              cantidad: cantidadRegular,
              color: '#a08b63'
            },
            {
              nombre: 'Riesgo',
              cantidad: cantidadRiesgo,
              color: '#9a6d6d'
            }
          ].map((item) => (
            <div
              key={item.nombre}
              style={{
                height: '100%',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                minWidth: 0
              }}
            >
              <strong
                style={{
                  marginBottom: '8px',
                  color: colorTexto
                }}
              >
                {item.cantidad}
              </strong>

              <div
                style={{
                  width: '70px',
                  maxWidth: '100%',
                  height: `${
                    (item.cantidad / maximoGrafica) * 220
                  }px`,
                  minHeight: item.cantidad > 0 ? '10px' : '0px',
                  backgroundColor: item.color,
                  borderRadius: '5px 5px 0 0',
                  transition: 'height 0.4s'
                }}
              />

              <span
                style={{
                  marginTop: '10px',
                  fontWeight: '600',
                  color: colorTexto,
                  fontSize: '13px'
                }}
              >
                {item.nombre}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PROMEDIO DE INDICADORES */}

      <div
        style={{
          marginTop: '30px',
          backgroundColor: colorTarjeta,
          padding: '25px',
          borderRadius: '10px',
          border: modoOscuro
            ? '1px solid #334155'
            : '1px solid #e3e8ec',
          boxShadow: modoOscuro
            ? '0 2px 8px rgba(0,0,0,0.18)'
            : '0 2px 6px rgba(24,39,52,0.04)'
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: '5px',
            fontSize: '18px',
            fontWeight: '600',
            color: colorTexto
          }}
        >
          Promedio de indicadores
        </h2>

        <p
          style={{
            color: colorSecundario,
            marginTop: 0,
            marginBottom: '25px'
          }}
        >
          Promedio general de los principales indicadores evaluados.
        </p>

        {[
          ['Cumplimiento de entregas', 'cumplimientoEntregas'],
          ['Calidad', 'calidad'],
          ['Costos', 'costos'],
          ['Tiempo de respuesta', 'tiempoRespuesta'],
          ['Incidencias', 'incidencias']
        ].map(([nombre, campo], indice) => {
          const promedio =
            evaluaciones.length > 0
              ? evaluaciones.reduce(
                  (total, evaluacion) =>
                    total +
                    (Number(evaluacion[campo]) || 0),
                  0
                ) / evaluaciones.length
              : 0

          return (
            <div
              key={campo}
              style={{
                marginBottom: indice === 4 ? 0 : '20px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '7px'
                }}
              >
                <span style={{ color: colorTexto }}>
                  {nombre}
                </span>

                <strong style={{ color: colorTexto }}>
                  {promedio.toFixed(1)}%
                </strong>
              </div>

              <div
                style={{
                  height: '10px',
                  backgroundColor: modoOscuro
                    ? '#334155'
                    : '#e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, Math.max(0, promedio))}%`,
                    backgroundColor: colorPrincipal,
                    borderRadius: '10px',
                    transition: 'width 0.5s'
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* ÚLTIMA EVALUACIÓN POR PROVEEDOR */}

      <div
        style={{
          marginTop: '25px',
          backgroundColor: colorTarjeta,
          borderRadius: '10px',
          padding: '25px',
          border: modoOscuro
            ? '1px solid #334155'
            : '1px solid #e3e8ec',
          boxShadow: modoOscuro
            ? '0 2px 8px rgba(0,0,0,0.18)'
            : '0 2px 6px rgba(24,39,52,0.04)'
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: '8px',
            color: colorTexto,
            fontSize: '18px'
          }}
        >
          Última evaluación por proveedor
        </h2>

        <p
          style={{
            color: colorSecundario,
            marginTop: 0,
            marginBottom: '20px'
          }}
        >
          Se muestra únicamente el registro de evaluación más reciente de cada proveedor.
        </p>

        {(() => {
          const ultimasEvaluaciones = Object.values(
            evaluaciones.reduce((acumulador, evaluacion) => {
              const id = evaluacion.idProveedor

              if (
                !acumulador[id] ||
                Number(evaluacion.idEvaluacion || 0) >
                  Number(acumulador[id].idEvaluacion || 0)
              ) {
                acumulador[id] = evaluacion
              }

              return acumulador
            }, {})
          )

          ultimasEvaluaciones.sort(
            (a, b) =>
              Number(b.idEvaluacion || 0) -
              Number(a.idEvaluacion || 0)
          )

          return ultimasEvaluaciones.length === 0 ? (
            <div
              style={{
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: modoOscuro ? '#334155' : '#f8fafc',
                color: colorSecundario,
                textAlign: 'center'
              }}
            >
              No hay evaluaciones registradas todavía.
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              {ultimasEvaluaciones.map((evaluacion) => {
                const proveedor = proveedores.find(
                  (p) =>
                    Number(p.idProveedor) ===
                    Number(evaluacion.idProveedor)
                )

                return (
                  <div
                    key={
                      evaluacion.idEvaluacion ??
                      `${evaluacion.idProveedor}-${evaluacion.fechaEvaluacion}`
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '15px',
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: modoOscuro ? '#0f172a' : '#f8fafc',
                      border: modoOscuro
                        ? '1px solid #334155'
                        : '1px solid #e2e8f0',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ minWidth: '180px' }}>
                      <strong
                        style={{
                          color: colorTexto,
                          fontSize: '15px'
                        }}
                      >
                        {proveedor?.nombre || 'Proveedor desconocido'}
                      </strong>

                      <div
                        style={{
                          marginTop: '5px',
                          color: colorSecundario,
                          fontSize: '13px'
                        }}
                      >
                        Evaluación #{evaluacion.idEvaluacion ?? '—'}
                      </div>

                      <div
                        style={{
                          marginTop: '3px',
                          color: colorSecundario,
                          fontSize: '13px'
                        }}
                      >
                        {evaluacion.fechaEvaluacion
                          ? new Date(
                              evaluacion.fechaEvaluacion
                            ).toLocaleDateString('es-MX')
                          : 'Fecha no disponible'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '600',
                          color: colorPrincipal
                        }}
                      >
                        {Number(evaluacion.calificacionFinal || 0)}
                      </div>

                      <span
                        style={{
                          fontSize: '12px',
                          color: colorSecundario
                        }}
                      >
                        de 100 puntos
                      </span>
                    </div>

                    <div
                      style={{
                        padding: '6px 13px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor:
                          evaluacion.clasificacion?.toLowerCase() === 'excelente'
                            ? modoOscuro ? '#193322' : '#edf4ef'
                            : evaluacion.clasificacion?.toLowerCase() === 'bueno'
                            ? modoOscuro ? '#1c2d3c' : '#eef3f7'
                            : evaluacion.clasificacion?.toLowerCase() === 'regular'
                            ? modoOscuro ? '#332d20' : '#f5f0e7'
                            : evaluacion.clasificacion?.toLowerCase() === 'riesgo'
                            ? modoOscuro ? '#3a2222' : '#f7eeee'
                            : modoOscuro ? '#334155' : '#eef1f3',
                        color:
                          evaluacion.clasificacion?.toLowerCase() === 'excelente'
                            ? modoOscuro ? '#86efac' : '#477255'
                            : evaluacion.clasificacion?.toLowerCase() === 'bueno'
                            ? modoOscuro ? '#93c5fd' : '#526f89'
                            : evaluacion.clasificacion?.toLowerCase() === 'regular'
                            ? modoOscuro ? '#fcd34d' : '#806c48'
                            : evaluacion.clasificacion?.toLowerCase() === 'riesgo'
                            ? modoOscuro ? '#fca5a5' : '#7a4b4b'
                            : colorSecundario
                      }}
                    >
                      {evaluacion.clasificacion || 'Sin clasificación'}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}
      </div>

      {/* MEJORES PROVEEDORES */}

      <div
        style={{
          marginTop: '25px',
          backgroundColor: colorTarjeta,
          borderRadius: '10px',
          padding: '25px',
          border: modoOscuro
            ? '1px solid #334155'
            : '1px solid #e3e8ec',
          boxShadow: modoOscuro
            ? '0 2px 8px rgba(0,0,0,0.18)'
            : '0 2px 6px rgba(24,39,52,0.04)'
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: '8px',
            color: colorTexto,
            fontSize: '18px'
          }}
        >
          Mejores proveedores
        </h2>

        <p
          style={{
            color: colorSecundario,
            marginTop: 0,
            marginBottom: '20px'
          }}
        >
          Proveedores con las calificaciones más altas en sus evaluaciones.
        </p>

        {evaluaciones.length === 0 ? (
          <div
            style={{
              padding: '20px',
              borderRadius: '8px',
              backgroundColor: modoOscuro ? '#334155' : '#f8fafc',
              color: colorSecundario,
              textAlign: 'center'
            }}
          >
            No hay evaluaciones registradas todavía.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '15px'
            }}
          >
            {[...evaluaciones]
              .sort(
                (a, b) =>
                  Number(b.calificacionFinal || 0) -
                  Number(a.calificacionFinal || 0)
              )
              .slice(0, 3)
              .map((evaluacion) => {
                const proveedor = proveedores.find(
                  (p) =>
                    Number(p.idProveedor) ===
                    Number(evaluacion.idProveedor)
                )

                return (
                  <div
                    key={
                      evaluacion.idEvaluacion ??
                      `${evaluacion.idProveedor}-${evaluacion.fechaEvaluacion}`
                    }
                    style={{
                      padding: '20px',
                      borderRadius: '8px',
                      backgroundColor: modoOscuro ? '#0f172a' : '#f8fafc',
                      border: modoOscuro
                        ? '1px solid #334155'
                        : '1px solid #e2e8f0',
                      textAlign: 'center'
                    }}
                  >
                    <h3
                      style={{
                        margin: '5px 0',
                        color: colorTexto,
                        fontSize: '16px'
                      }}
                    >
                      {proveedor?.nombre || 'Proveedor desconocido'}
                    </h3>

                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '600',
                        color: colorPrincipal,
                        margin: '12px 0'
                      }}
                    >
                      {Number(evaluacion.calificacionFinal || 0)}

                      <span
                        style={{
                          fontSize: '14px',
                          color: colorSecundario
                        }}
                      >
                        {' '} / 100
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'inline-block',
                        padding: '5px 12px',
                        borderRadius: '15px',
                        backgroundColor:
                          evaluacion.clasificacion?.toLowerCase() === 'excelente'
                            ? modoOscuro ? '#193322' : '#edf4ef'
                            : evaluacion.clasificacion?.toLowerCase() === 'bueno'
                            ? modoOscuro ? '#1c2d3c' : '#eef3f7'
                            : evaluacion.clasificacion?.toLowerCase() === 'riesgo'
                            ? modoOscuro ? '#3a2222' : '#f7eeee'
                            : modoOscuro ? '#332d20' : '#f5f0e7',
                        color:
                          evaluacion.clasificacion?.toLowerCase() === 'excelente'
                            ? modoOscuro ? '#86efac' : '#477255'
                            : evaluacion.clasificacion?.toLowerCase() === 'bueno'
                            ? modoOscuro ? '#93c5fd' : '#526f89'
                            : evaluacion.clasificacion?.toLowerCase() === 'riesgo'
                            ? modoOscuro ? '#fca5a5' : '#7a4b4b'
                            : modoOscuro ? '#fcd34d' : '#806c48',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {evaluacion.clasificacion || 'Sin clasificación'}
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>

      {/* RESUMEN GENERAL DEL SISTEMA */}

      <div
        style={{
          marginTop: '25px',
          backgroundColor: colorTarjeta,
          borderRadius: '10px',
          padding: '25px',
          border: modoOscuro
            ? '1px solid #334155'
            : '1px solid #e3e8ec',
          boxShadow: modoOscuro
            ? '0 2px 8px rgba(0,0,0,0.18)'
            : '0 2px 6px rgba(24,39,52,0.04)'
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: '8px',
            color: colorTexto,
            fontSize: '18px'
          }}
        >
          Resumen general del sistema
        </h2>

        <p
          style={{
            marginTop: 0,
            marginBottom: '25px',
            color: colorSecundario
          }}
        >
          Información general sobre proveedores y evaluaciones registradas.
        </p>

        {(() => {
          const proveedoresEvaluados = new Set(
            evaluaciones.map(
              (evaluacion) => Number(evaluacion.idProveedor)
            )
          ).size

          const proveedoresPendientes = Math.max(
            totalProveedores - proveedoresEvaluados,
            0
          )

          const porcentajeEvaluados =
            totalProveedores > 0
              ? Math.round(
                  (proveedoresEvaluados / totalProveedores) * 100
                )
              : 0

          const evaluacionesConIA = evaluaciones.filter(
            (evaluacion) =>
              evaluacion.recomendacion &&
              evaluacion.recomendacion.trim() !== ''
          ).length

          const porcentajeRiesgo =
            evaluaciones.length > 0
              ? Math.round(
                  (evaluacionesRiesgo / evaluaciones.length) * 100
                )
              : 0

          let estadoGeneral = 'Sin información'
          let colorEstado = modoOscuro ? '#cbd5e1' : '#687680'
          let fondoEstado = modoOscuro ? '#1e293b' : '#f1f3f4'

          if (evaluaciones.length > 0) {
            if (porcentajeRiesgo >= 50) {
              estadoGeneral = 'Requiere atención'
              colorEstado = modoOscuro ? '#fca5a5' : '#7a4b4b'
              fondoEstado = modoOscuro ? '#2b1e1e' : '#f7eeee'
            } else if (porcentajeRiesgo >= 25) {
              estadoGeneral = 'Seguimiento recomendado'
              colorEstado = modoOscuro ? '#fcd34d' : '#806c48'
              fondoEstado = modoOscuro ? '#29251d' : '#f5f0e7'
            } else {
              estadoGeneral = 'Desempeño favorable'
              colorEstado = modoOscuro ? '#86efac' : '#477255'
              fondoEstado = modoOscuro ? '#17251d' : '#edf4ef'
            }
          }

          return (
            <>
              {/* TARJETAS DEL RESUMEN */}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: '15px'
                }}
              >
                {[
                  {
                    valor: totalProveedores,
                    titulo: 'Proveedores registrados',
                    fondo: modoOscuro ? '#0f172a' : '#f8fafc',
                    borde: modoOscuro ? '#334155' : '#e2e8f0',
                    color: colorTexto
                  },
                  {
                    valor: proveedoresActivos,
                    titulo: 'Proveedores activos',
                    fondo: modoOscuro ? '#17251d' : '#f2f6f3',
                    borde: modoOscuro ? '#31523d' : '#d8e3db',
                    color: modoOscuro ? '#86efac' : '#477255'
                  },
                  {
                    valor: evaluacionesRiesgo,
                    titulo: 'Evaluaciones en riesgo',
                    fondo: modoOscuro ? '#2b1e1e' : '#faf4f4',
                    borde: modoOscuro ? '#553838' : '#e4d7d7',
                    color: modoOscuro ? '#fca5a5' : '#7a4b4b'
                  },
                  {
                    valor: evaluaciones.length,
                    titulo: 'Evaluaciones realizadas',
                    fondo: modoOscuro ? '#182431' : '#f1f5f8',
                    borde: modoOscuro ? '#334b5f' : '#d8e1e8',
                    color: modoOscuro ? '#93c5fd' : '#526f89'
                  },
                  {
                    valor: evaluacionesConIA,
                    titulo: 'Recomendaciones registradas',
                    fondo: modoOscuro ? '#24202d' : '#f5f3f8',
                    borde: modoOscuro ? '#463c52' : '#ddd8e5',
                    color: modoOscuro ? '#c4b5fd' : '#665a7c'
                  },
                  {
                    valor: promedioEvaluacion,
                    titulo: 'Promedio general',
                    fondo: modoOscuro ? '#29251d' : '#f7f5ef',
                    borde: modoOscuro ? '#50452f' : '#e4dfd2',
                    color: modoOscuro ? '#fcd34d' : '#806c48'
                  }
                ].map((item) => (
                  <div
                    key={item.titulo}
                    style={{
                      padding: '20px',
                      borderRadius: '8px',
                      backgroundColor: item.fondo,
                      border: `1px solid ${item.borde}`
                    }}
                  >
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '600',
                        color: item.color
                      }}
                    >
                      {item.valor}
                    </div>

                    <div
                      style={{
                        marginTop: '5px',
                        color: colorSecundario,
                        fontSize: '14px'
                      }}
                    >
                      {item.titulo}
                    </div>
                  </div>
                ))}
              </div>

              {/* PROGRESO DE EVALUACIÓN */}

              <div
                style={{
                  marginTop: '25px',
                  padding: '20px',
                  borderRadius: '8px',
                  backgroundColor: modoOscuro ? '#0f172a' : '#f8fafc',
                  border: modoOscuro
                    ? '1px solid #334155'
                    : '1px solid #e2e8f0'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}
                >
                  <strong style={{ color: colorTexto }}>
                    Proveedores evaluados
                  </strong>

                  <span
                    style={{
                      color: colorPrincipal,
                      fontWeight: '600'
                    }}
                  >
                    {porcentajeEvaluados}%
                  </span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '10px',
                    borderRadius: '20px',
                    backgroundColor: modoOscuro ? '#334155' : '#e2e8f0',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, porcentajeEvaluados)}%`,
                      height: '100%',
                      borderRadius: '20px',
                      backgroundColor: colorPrincipal,
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '10px',
                    fontSize: '13px',
                    color: colorSecundario
                  }}
                >
                  <span>{proveedoresEvaluados} evaluados</span>
                  <span>{proveedoresPendientes} pendientes</span>
                </div>
              </div>

              {/* ESTADO GENERAL */}

              <div
                style={{
                  marginTop: '15px',
                  padding: '20px',
                  borderRadius: '8px',
                  backgroundColor: fondoEstado,
                  border: `1px solid ${colorEstado}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: colorSecundario,
                      marginBottom: '5px'
                    }}
                  >
                    Estado general del sistema
                  </div>

                  <strong
                    style={{
                      fontSize: '19px',
                      color: colorEstado
                    }}
                  >
                    {estadoGeneral}
                  </strong>
                </div>

                <div
                  style={{
                    textAlign: 'right',
                    color: colorSecundario,
                    fontSize: '13px'
                  }}
                >
                  <div>{porcentajeRiesgo}% de las evaluaciones</div>
                  <div>corresponden a riesgo</div>
                </div>
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}
