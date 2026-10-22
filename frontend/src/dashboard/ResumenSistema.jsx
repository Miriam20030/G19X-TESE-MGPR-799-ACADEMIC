
export default function ResumenSistema({
  proveedores = [],
  evaluaciones = [],
  modoOscuro,
  colorTexto,
  colorSecundario,
  colorTarjeta
}) {
  const totalProveedores = proveedores.length

  const proveedoresActivos = proveedores.filter(
    (proveedor) =>
      proveedor.estado?.toLowerCase() === 'activo'
  ).length

  const porcentajeEvaluados =
    totalProveedores > 0
      ? Math.min(
          100,
          (new Set(
            evaluaciones
              .map((evaluacion) => evaluacion.idProveedor)
              .filter((id) => id != null)
          ).size /
            totalProveedores) *
            100
        )
      : 0

  const proveedoresEnRiesgo = new Set(
    evaluaciones
      .filter(
        (evaluacion) =>
          evaluacion.clasificacion?.toLowerCase() === 'riesgo'
      )
      .map((evaluacion) => evaluacion.idProveedor)
      .filter((id) => id != null)
  ).size

  const porcentajeRiesgo =
    totalProveedores > 0
      ? (proveedoresEnRiesgo / totalProveedores) * 100
      : 0

  const estadoGeneral =
    porcentajeRiesgo >= 30
      ? 'Requiere atención'
      : porcentajeRiesgo > 0
        ? 'Atención preventiva'
        : 'Estable'

  const colorEstado =
    porcentajeRiesgo >= 30
      ? '#c66b6b'
      : porcentajeRiesgo > 0
        ? '#b49a5a'
        : '#5f9b78'

  const tarjetas = [
    {
      titulo: 'Proveedores registrados',
      valor: totalProveedores,
      descripcion: 'Total de proveedores en el sistema'
    },
    {
      titulo: 'Proveedores activos',
      valor: proveedoresActivos,
      descripcion: 'Proveedores con estado activo'
    },
    {
      titulo: 'Proveedores en riesgo',
      valor: proveedoresEnRiesgo,
      descripcion: 'Proveedores con clasificación de riesgo'
    },
    {
      titulo: 'Proveedores evaluados',
      valor: `${porcentajeEvaluados.toFixed(1)}%`,
      descripcion: 'Cobertura de evaluación del padrón'
    }
  ]

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
        Resumen del sistema
      </h2>

      <p
        style={{
          color: colorSecundario,
          marginTop: 0,
          marginBottom: '25px'
        }}
      >
        Estado general y cobertura de evaluación de los proveedores.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '15px'
        }}
      >
        {tarjetas.map((tarjeta) => (
          <div
            key={tarjeta.titulo}
            style={{
              padding: '18px',
              borderRadius: '8px',
              backgroundColor: modoOscuro ? '#1e293b' : '#f8fafc',
              border: modoOscuro
                ? '1px solid #334155'
                : '1px solid #edf0f3'
            }}
          >
            <div
              style={{
                color: colorSecundario,
                fontSize: '13px',
                marginBottom: '10px'
              }}
            >
              {tarjeta.titulo}
            </div>

            <div
              style={{
                color: colorTexto,
                fontSize: '26px',
                fontWeight: '700',
                marginBottom: '8px'
              }}
            >
              {tarjeta.valor}
            </div>

            <div
              style={{
                color: colorSecundario,
                fontSize: '12px',
                lineHeight: 1.5
              }}
            >
              {tarjeta.descripcion}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '18px',
          borderRadius: '8px',
          backgroundColor: modoOscuro ? '#1e293b' : '#f8fafc',
          border: modoOscuro
            ? '1px solid #334155'
            : '1px solid #edf0f3'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '12px'
          }}
        >
          <strong style={{ color: colorTexto }}>
            Progreso de evaluación
          </strong>

          <span
            style={{
              color: colorTexto,
              fontWeight: '600'
            }}
          >
            {porcentajeEvaluados.toFixed(1)}%
          </span>
        </div>

        <div
          style={{
            width: '100%',
            height: '12px',
            backgroundColor: modoOscuro ? '#334155' : '#e9edf2',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${porcentajeEvaluados}%`,
              height: '100%',
              backgroundColor: '#6689a5',
              borderRadius: '10px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>

        <p
          style={{
            color: colorSecundario,
            fontSize: '13px',
            marginBottom: 0
          }}
        >
          {evaluaciones.length} evaluaciones registradas en total.
        </p>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '18px',
          borderRadius: '8px',
          border: `1px solid ${colorEstado}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <strong
            style={{
              display: 'block',
              color: colorTexto,
              marginBottom: '5px'
            }}
          >
            Estado general del sistema
          </strong>

          <span
            style={{
              color: colorSecundario,
              fontSize: '13px'
            }}
          >
            Basado en la proporción de proveedores en riesgo.
          </span>
        </div>

        <span
          style={{
            color: colorEstado,
            fontWeight: '700'
          }}
        >
          {estadoGeneral}
        </span>
      </div>
    </div>
  )
}
