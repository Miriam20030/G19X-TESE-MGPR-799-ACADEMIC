
export default function UltimasEvaluaciones({
  evaluaciones = [],
  proveedores = [],
  modoOscuro,
  colorTexto,
  colorSecundario,
  colorTarjeta
}) {
  // Obtener la evaluación más reciente de cada proveedor
  const ultimasEvaluaciones = Object.values(
    evaluaciones.reduce((acumulado, evaluacion) => {
      const idProveedor = evaluacion.idProveedor

      if (idProveedor == null) {
        return acumulado
      }

      const evaluacionActual = acumulado[idProveedor]

      if (
        !evaluacionActual ||
        new Date(evaluacion.fechaEvaluacion || 0) >
          new Date(evaluacionActual.fechaEvaluacion || 0)
      ) {
        acumulado[idProveedor] = evaluacion
      }

      return acumulado
    }, {})
  )
    .sort(
      (a, b) =>
        new Date(b.fechaEvaluacion || 0) -
        new Date(a.fechaEvaluacion || 0)
    )
    .slice(0, 5)

  const obtenerNombreProveedor = (evaluacion) => {
    const proveedor = proveedores.find(
      (item) => item.idProveedor === evaluacion.idProveedor
    )

    return (
      evaluacion.nombreProveedor ||
      evaluacion.proveedor?.nombre ||
      proveedor?.nombre ||
      `Proveedor #${evaluacion.idProveedor}`
    )
  }

  const obtenerColorClasificacion = (clasificacion) => {
    switch (clasificacion?.toLowerCase()) {
      case 'excelente':
        return '#5f9b78'
      case 'bueno':
        return '#6689a5'
      case 'regular':
        return '#b49a5a'
      case 'riesgo':
        return '#c66b6b'
      default:
        return colorSecundario
    }
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha'

    const fechaConvertida = new Date(fecha)

    if (Number.isNaN(fechaConvertida.getTime())) {
      return 'Fecha no disponible'
    }

    return fechaConvertida.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
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
        Últimas evaluaciones
      </h2>

      <p
        style={{
          color: colorSecundario,
          marginTop: 0,
          marginBottom: '20px'
        }}
      >
        Evaluaciones más recientes registradas en el sistema.
      </p>

      {ultimasEvaluaciones.length === 0 ? (
        <p style={{ color: colorSecundario }}>
          Todavía no hay evaluaciones registradas.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '550px'
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${
                    modoOscuro ? '#475569' : '#e2e8f0'
                  }`
                }}
              >
                {[
                  'Proveedor',
                  'Fecha',
                  'Calificación',
                  'Clasificación'
                ].map((titulo) => (
                  <th
                    key={titulo}
                    style={{
                      padding: '12px 10px',
                      textAlign: 'left',
                      color: colorSecundario,
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    {titulo}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {ultimasEvaluaciones.map((evaluacion) => (
                <tr
                  key={
                    evaluacion.idEvaluacion ??
                    `${evaluacion.idProveedor}-${evaluacion.fechaEvaluacion}`
                  }
                  style={{
                    borderBottom: `1px solid ${
                      modoOscuro ? '#334155' : '#edf0f3'
                    }`
                  }}
                >
                  <td
                    style={{
                      padding: '15px 10px',
                      color: colorTexto,
                      fontWeight: '500'
                    }}
                  >
                    {obtenerNombreProveedor(evaluacion)}
                  </td>

                  <td
                    style={{
                      padding: '15px 10px',
                      color: colorSecundario,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {formatearFecha(evaluacion.fechaEvaluacion)}
                  </td>

                  <td
                    style={{
                      padding: '15px 10px',
                      color: colorTexto,
                      fontWeight: '600'
                    }}
                  >
                    {Number(evaluacion.calificacionFinal || 0).toFixed(1)}
                  </td>

                  <td style={{ padding: '15px 10px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: obtenerColorClasificacion(
                          evaluacion.clasificacion
                        ),
                        backgroundColor: modoOscuro
                          ? '#0f172a'
                          : '#f8fafc',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {evaluacion.clasificacion || 'Sin clasificación'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
