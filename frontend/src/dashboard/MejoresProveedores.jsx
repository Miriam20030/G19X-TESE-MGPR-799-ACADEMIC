
export default function MejoresProveedores({
  evaluaciones = [],
  modoOscuro,
  colorTexto,
  colorSecundario,
  colorTarjeta
}) {
  // Obtener la evaluación más reciente de cada proveedor
  const mejoresProveedores = Object.values(
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
        Number(b.calificacionFinal || 0) -
        Number(a.calificacionFinal || 0)
    )
    .slice(0, 3)

  const medallas = ['🥇', '🥈', '🥉']

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
        Mejores proveedores
      </h2>

      <p
        style={{
          color: colorSecundario,
          marginTop: 0,
          marginBottom: '20px'
        }}
      >
        Proveedores con las calificaciones más altas.
      </p>

      {mejoresProveedores.length === 0 ? (
        <p style={{ color: colorSecundario }}>
          Todavía no hay evaluaciones para mostrar.
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          {mejoresProveedores.map((evaluacion, indice) => (
            <div
              key={evaluacion.idEvaluacion ?? evaluacion.idProveedor}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: modoOscuro ? '#1e293b' : '#f8fafc',
                border: modoOscuro
                  ? '1px solid #334155'
                  : '1px solid #edf0f3'
              }}
            >
              <span style={{ fontSize: '27px' }}>
                {medallas[indice]}
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: colorTexto,
                    fontWeight: '600',
                    overflowWrap: 'anywhere'
                  }}
                >
                  {evaluacion.nombreProveedor ||
                    evaluacion.proveedor?.nombre ||
                    `Proveedor #${evaluacion.idProveedor}`}
                </div>

                <div
                  style={{
                    color: colorSecundario,
                    fontSize: '13px',
                    marginTop: '4px'
                  }}
                >
                  {evaluacion.clasificacion || 'Sin clasificación'}
                </div>
              </div>

              <strong
                style={{
                  color: colorTexto,
                  fontSize: '18px',
                  whiteSpace: 'nowrap'
                }}
              >
                {Number(evaluacion.calificacionFinal || 0).toFixed(1)}
                <span style={{ fontSize: '12px', fontWeight: '400' }}>
                  {' '}/ 100
                </span>
              </strong>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
