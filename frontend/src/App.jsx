
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'

import Proveedores from './pages/Proveedores'
import RegistrarProveedor from './pages/RegistrarProveedor'
import EditarProveedor from './pages/EditarProveedor'
import Evaluaciones from './pages/Evaluaciones'
import NuevaEvaluacion from './pages/NuevaEvaluacion'
import Alertas from './pages/Alertas'
import Configuracion from './pages/Configuracion'
import Reportes from './pages/Reportes'

import Login from './components/Login'


function Dashboard({ modoOscuro, colorPrincipal }) {
  const [proveedores, setProveedores] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])

  useEffect(() => {
    obtenerDatos()
  }, [])

  const obtenerDatos = async () => {
    try {
      const respuestaProveedores = await fetch(
        'http://localhost:8080/api/proveedores'
      )

      const respuestaEvaluaciones = await fetch(
        'http://localhost:8080/api/evaluaciones'
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

  const colorTexto = modoOscuro
    ? '#f8fafc'
    : '#263238'

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
          borderBottom: '1px solid #e1e6ea'
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

          <strong style={{ color: '#7a4b4b' }}>
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

      <div
        style={{
          marginTop: '30px',
          backgroundColor: colorTarjeta,
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid #e3e8ec',
          boxShadow: '0 2px 6px rgba(24,39,52,0.04)'
        }}
      >

        <h2
          style={{
            marginTop: 0,
            marginBottom: '5px',
            fontSize: '18px',
            fontWeight: '600'
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

          {/* EXCELENTE */}

          <div
            style={{
              height: '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >

            <strong style={{ marginBottom: '8px' }}>
              {cantidadExcelente}
            </strong>

            <div
              style={{
                width: '70px',
                height: `${
                  (cantidadExcelente / maximoGrafica) * 220
                }px`,
                minHeight:
                  cantidadExcelente > 0 ? '10px' : '0px',
                backgroundColor: '#5f7f6a',
                borderRadius: '5px 5px 0 0',
                transition: 'height 0.4s'
              }}
            />

            <span
              style={{
                marginTop: '10px',
                fontWeight: '600'
              }}
            >
              Excelente
            </span>

          </div>


          {/* BUENO */}

          <div
            style={{
              height: '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >

            <strong style={{ marginBottom: '8px' }}>
              {cantidadBueno}
            </strong>

            <div
              style={{
                width: '70px',
                height: `${
                  (cantidadBueno / maximoGrafica) * 220
                }px`,
                minHeight:
                  cantidadBueno > 0 ? '10px' : '0px',
                backgroundColor: '#6689a5',
                borderRadius: '5px 5px 0 0',
                transition: 'height 0.4s'
              }}
            />

            <span
              style={{
                marginTop: '10px',
                fontWeight: '600'
              }}
            >
              Bueno
            </span>

          </div>


          {/* REGULAR */}

          <div
            style={{
              height: '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >

            <strong style={{ marginBottom: '8px' }}>
              {cantidadRegular}
            </strong>

            <div
              style={{
                width: '70px',
                height: `${
                  (cantidadRegular / maximoGrafica) * 220
                }px`,
                minHeight:
                  cantidadRegular > 0 ? '10px' : '0px',
                backgroundColor: '#a08b63',
                borderRadius: '5px 5px 0 0',
                transition: 'height 0.4s'
              }}
            />

            <span
              style={{
                marginTop: '10px',
                fontWeight: '600'
              }}
            >
              Regular
            </span>

          </div>


          {/* RIESGO */}

          <div
            style={{
              height: '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >

            <strong style={{ marginBottom: '8px' }}>
              {cantidadRiesgo}
            </strong>

            <div
              style={{
                width: '70px',
                height: `${
                  (cantidadRiesgo / maximoGrafica) * 220
                }px`,
                minHeight:
                  cantidadRiesgo > 0 ? '10px' : '0px',
                backgroundColor: '#9a6d6d',
                borderRadius: '5px 5px 0 0',
                transition: 'height 0.4s'
              }}
            />

            <span
              style={{
                marginTop: '10px',
                fontWeight: '600'
              }}
            >
              Riesgo
            </span>

          </div>

        </div>
      </div>


      {/* PROMEDIO DE INDICADORES */}

      <div
        style={{
          marginTop: '30px',
          backgroundColor: colorTarjeta,
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid #e3e8ec',
          boxShadow: '0 2px 6px rgba(24,39,52,0.04)'
        }}
      >

        <h2
          style={{
            marginTop: 0,
            marginBottom: '5px',
            fontSize: '18px',
            fontWeight: '600'
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
                marginBottom:
                  indice === 4 ? 0 : '20px'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '7px'
                }}
              >

                <span>
                  {nombre}
                </span>

                <strong>
                  {promedio.toFixed(1)}%
                </strong>

              </div>


              <div
                style={{
                  height: '10px',
                  backgroundColor:
                    modoOscuro ? '#334155' : '#e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >

                <div
                  style={{
                    height: '100%',
                    width: `${promedio}%`,
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
          border: '1px solid #e3e8ec',
          boxShadow: '0 2px 6px rgba(24,39,52,0.04)'
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

              const idProveedor = evaluacion.idProveedor

              if (
                !acumulador[idProveedor] ||
                Number(evaluacion.idEvaluacion) >
                  Number(acumulador[idProveedor].idEvaluacion)
              ) {
                acumulador[idProveedor] = evaluacion
              }

              return acumulador

            }, {})
          )


          ultimasEvaluaciones.sort(
            (a, b) =>
              Number(b.idEvaluacion) -
              Number(a.idEvaluacion)
          )


          return ultimasEvaluaciones.length === 0 ? (

            <div
              style={{
                padding: '20px',
                borderRadius: '8px',
                backgroundColor:
                  modoOscuro ? '#334155' : '#f8fafc',
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
                    key={evaluacion.idEvaluacion}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '15px',
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor:
                        modoOscuro ? '#0f172a' : '#f8fafc',
                      border: '1px solid #e2e8f0',
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
                        Evaluación #{evaluacion.idEvaluacion}
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
                        {evaluacion.calificacionFinal || 0}
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
                            ? '#edf4ef'
                            : evaluacion.clasificacion?.toLowerCase() === 'bueno'
                            ? '#eef3f7'
                            : evaluacion.clasificacion?.toLowerCase() === 'regular'
                            ? '#f5f0e7'
                            : evaluacion.clasificacion?.toLowerCase() === 'riesgo'
                            ? '#f7eeee'
                            : '#eef1f3',

                        color:
                          evaluacion.clasificacion?.toLowerCase() === 'excelente'
                            ? '#477255'
                            : evaluacion.clasificacion?.toLowerCase() === 'bueno'
                            ? '#526f89'
                            : evaluacion.clasificacion?.toLowerCase() === 'regular'
                            ? '#806c48'
                            : evaluacion.clasificacion?.toLowerCase() === 'riesgo'
                            ? '#7a4b4b'
                            : '#687680'
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
          border: '1px solid #e3e8ec',
          boxShadow: '0 2px 6px rgba(24,39,52,0.04)'
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
              backgroundColor:
                modoOscuro ? '#334155' : '#f8fafc',
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
              gridTemplateColumns:
                'repeat(auto-fit, minmax(220px, 1fr))',
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
                    key={evaluacion.idEvaluacion}
                    style={{
                      padding: '20px',
                      borderRadius: '8px',
                      backgroundColor:
                        modoOscuro ? '#0f172a' : '#f8fafc',
                      border: '1px solid #e2e8f0',
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
                      {evaluacion.calificacionFinal || 0}

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
                            ? '#edf4ef'
                            : evaluacion.clasificacion?.toLowerCase() === 'bueno'
                            ? '#eef3f7'
                            : '#f5f0e7',

                        color:
                          evaluacion.clasificacion?.toLowerCase() === 'excelente'
                            ? '#477255'
                            : evaluacion.clasificacion?.toLowerCase() === 'bueno'
                            ? '#526f89'
                            : '#806c48',

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
          border: '1px solid #e3e8ec',
          boxShadow: '0 2px 6px rgba(24,39,52,0.04)'
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
              (evaluacion) =>
                Number(evaluacion.idProveedor)
            )
          ).size


          const proveedoresPendientes =
            Math.max(
              totalProveedores - proveedoresEvaluados,
              0
            )


          const porcentajeEvaluados =
            totalProveedores > 0
              ? Math.round(
                  (proveedoresEvaluados / totalProveedores) * 100
                )
              : 0


          const evaluacionesConIA =
            evaluaciones.filter(
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
          let colorEstado = '#687680'
          let fondoEstado = '#f1f3f4'


          if (evaluaciones.length > 0) {

            if (porcentajeRiesgo >= 50) {

              estadoGeneral = 'Requiere atención'
              colorEstado = '#7a4b4b'
              fondoEstado = '#f7eeee'

            } else if (porcentajeRiesgo >= 25) {

              estadoGeneral = 'Seguimiento recomendado'
              colorEstado = '#806c48'
              fondoEstado = '#f5f0e7'

            } else {

              estadoGeneral = 'Desempeño favorable'
              colorEstado = '#477255'
              fondoEstado = '#edf4ef'

            }
          }


          return (
            <>

              {/* TARJETAS DEL RESUMEN */}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: '15px'
                }}
              >

                <div
                  style={{
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor:
                      modoOscuro ? '#0f172a' : '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}
                >

                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: colorTexto
                    }}
                  >
                    {totalProveedores}
                  </div>

                  <div
                    style={{
                      marginTop: '5px',
                      color: colorSecundario,
                      fontSize: '14px'
                    }}
                  >
                    Proveedores registrados
                  </div>

                </div>


                <div
                  style={{
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor:
                      modoOscuro ? '#17251d' : '#f2f6f3',
                    border: '1px solid #d8e3db'
                  }}
                >

                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#477255'
                    }}
                  >
                    {proveedoresActivos}
                  </div>

                  <div
                    style={{
                      marginTop: '5px',
                      color: colorSecundario,
                      fontSize: '14px'
                    }}
                  >
                    Proveedores activos
                  </div>

                </div>


                <div
                  style={{
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor:
                      modoOscuro ? '#2b1e1e' : '#faf4f4',
                    border: '1px solid #e4d7d7'
                  }}
                >

                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#7a4b4b'
                    }}
                  >
                    {evaluacionesRiesgo}
                  </div>

                  <div
                    style={{
                      marginTop: '5px',
                      color: colorSecundario,
                      fontSize: '14px'
                    }}
                  >
                    Evaluaciones en riesgo
                  </div>

                </div>


                <div
                  style={{
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor:
                      modoOscuro ? '#182431' : '#f1f5f8',
                    border: '1px solid #d8e1e8'
                  }}
                >

                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#526f89'
                    }}
                  >
                    {evaluaciones.length}
                  </div>

                  <div
                    style={{
                      marginTop: '5px',
                      color: colorSecundario,
                      fontSize: '14px'
                    }}
                  >
                    Evaluaciones realizadas
                  </div>

                </div>


                <div
                  style={{
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor:
                      modoOscuro ? '#24202d' : '#f5f3f8',
                    border: '1px solid #ddd8e5'
                  }}
                >

                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#665a7c'
                    }}
                  >
                    {evaluacionesConIA}
                  </div>

                  <div
                    style={{
                      marginTop: '5px',
                      color: colorSecundario,
                      fontSize: '14px'
                    }}
                  >
                    Recomendaciones generadas
                  </div>

                </div>


                <div
                  style={{
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor:
                      modoOscuro ? '#29251d' : '#f7f5ef',
                    border: '1px solid #e4dfd2'
                  }}
                >

                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '600',
                      color: '#806c48'
                    }}
                  >
                    {promedioEvaluacion}
                  </div>

                  <div
                    style={{
                      marginTop: '5px',
                      color: colorSecundario,
                      fontSize: '14px'
                    }}
                  >
                    Promedio general
                  </div>

                </div>

              </div>


              {/* PROGRESO DE EVALUACIÓN */}

              <div
                style={{
                  marginTop: '25px',
                  padding: '20px',
                  borderRadius: '8px',
                  backgroundColor:
                    modoOscuro ? '#0f172a' : '#f8fafc',
                  border: '1px solid #e2e8f0'
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
                    backgroundColor:
                      modoOscuro ? '#334155' : '#e2e8f0',
                    overflow: 'hidden'
                  }}
                >

                  <div
                    style={{
                      width: `${porcentajeEvaluados}%`,
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

                  <span>
                    {proveedoresEvaluados} evaluados
                  </span>

                  <span>
                    {proveedoresPendientes} pendientes
                  </span>

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

                  <div>
                    {porcentajeRiesgo}% de las evaluaciones
                  </div>

                  <div>
                    corresponden a riesgo
                  </div>

                </div>

              </div>

            </>
          )
        })()}

      </div>

    </div>
  )
}


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

    const guardado =
      localStorage.getItem('modoOscuro')

    return guardado === 'true'

  })


  // ==============================
  // COLOR PRINCIPAL
  // ==============================

  const [colorPrincipal, setColorPrincipal] = useState(() => {

    return (
      localStorage.getItem('colorPrincipal') ||
      '#29465f'
    )

  })


  // ==============================
  // GUARDAR MODO OSCURO
  // ==============================

  useEffect(() => {

    localStorage.setItem(
      'modoOscuro',
      modoOscuro
    )

  }, [modoOscuro])


  // ==============================
  // GUARDAR COLOR
  // ==============================

  useEffect(() => {

    localStorage.setItem(
      'colorPrincipal',
      colorPrincipal
    )

  }, [colorPrincipal])


  // ==============================
  // LOGIN
  // ==============================

  if (!usuario) {

    return (
      <Login
        onLogin={(datosUsuario) => {
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
          backgroundColor:
            modoOscuro
              ? '#0f172a'
              : '#f4f6f8',

          color:
            modoOscuro
              ? '#f8fafc'
              : '#263238',

          minHeight: '100vh',
          transition: '0.3s'
        }}
      >

        {/* MENÚ LATERAL */}

        <aside
          className="sidebar"
          style={{
            backgroundColor:
              modoOscuro
                ? '#111827'
                : undefined
          }}
        >

          <div className="logo">

            <h2>
              Evaluación de Proveedores
            </h2>

            <span>
              Sistema inteligente
            </span>

          </div>


          {/* USUARIO */}

          <div
            style={{
              padding: '15px 20px',
              margin: '10px 15px 20px',
              borderRadius: '8px',

              backgroundColor:
                modoOscuro
                  ? '#1e293b'
                  : '#f1f5f8',

              border:
                '1px solid ' +
                (modoOscuro ? '#334155' : '#e2e8f0')
            }}
          >

            <div
              style={{
                fontSize: '12px',

                color:
                  modoOscuro
                    ? '#94a3b8'
                    : '#687680',

                marginBottom: '4px'
              }}
            >
              Sesión iniciada como
            </div>

            <strong>
              {usuario.nombre || usuario.usuario}
            </strong>

          </div>


          <nav>

            <Link to="/">
              Inicio
            </Link>

            <Link to="/proveedores">
              Proveedores
            </Link>

            <Link to="/evaluaciones">
              Evaluaciones
            </Link>

            <Link to="/alertas">
              Alertas
            </Link>

            <Link to="/reportes">
              Reportes
            </Link>

            <Link to="/configuracion">
              Configuración
            </Link>

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

                backgroundColor:
                  modoOscuro
                    ? '#334155'
                    : '#e9eef2',

                color:
                  modoOscuro
                    ? '#f8fafc'
                    : '#263238',

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
            backgroundColor:
              modoOscuro
                ? '#0f172a'
                : undefined,

            transition: '0.3s'
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
