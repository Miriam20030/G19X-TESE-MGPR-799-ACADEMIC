
export default function PromedioIndicadores({
  evaluaciones = [],
  modoOscuro,
  colorTexto,
  colorSecundario,
  colorTarjeta
}) {
  const indicadores = [
    {
      nombre: 'Cumplimiento de entregas',
      campo: 'cumplimientoEntregas',
      color: '#6689a5'
    },
    {
      nombre: 'Calidad',
      campo: 'calidad',
      color: '#5f7f6a'
    },
    {
      nombre: 'Costos',
      campo: 'costos',
      color: '#a08b63'
    },
    {
      nombre: 'Tiempo de respuesta',
      campo: 'tiempoRespuesta',
      color: '#8274a8'
    },
    {
      nombre: 'Incidencias',
      campo: 'incidencias',
      color: '#9a6d6d'
    }
  ]

  const obtenerPromedio = (campo) => {
    if (evaluaciones.length === 0) {
      return 0
    }

    const suma = evaluaciones.reduce(
      (total, evaluacion) =>
        total + (Number(evaluacion[campo]) || 0),
      0
    )

    return suma / evaluaciones.length
  }

  return (
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
        Promedio por indicador
      </h2>

      <p
        style={{
          color: colorSecundario,
          marginTop: 0,
          marginBottom: '25px'
        }}
      >
        Desempeño promedio de los proveedores evaluados.
      </p>

      {evaluaciones.length === 0 ? (
        <p style={{ color: colorSecundario }}>
          Todavía no hay evaluaciones para calcular los promedios.
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '22px'
          }}
        >
          {indicadores.map((indicador) => {
            const promedio = obtenerPromedio(indicador.campo)

            return (
              <div key={indicador.campo}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}
                >
                  <span
                    style={{
                      color: colorTexto,
                      fontWeight: '500',
                      fontSize: '14px'
                    }}
                  >
                    {indicador.nombre}
                  </span>

                  <strong
                    style={{
                      color: colorTexto,
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {promedio.toFixed(1)}%
                  </strong>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: modoOscuro
                      ? '#334155'
                      : '#edf0f3',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, promedio)
                      )}%`,
                      height: '100%',
                      backgroundColor: indicador.color,
                      borderRadius: '10px',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
