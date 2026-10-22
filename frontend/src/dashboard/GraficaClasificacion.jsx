
export default function GraficaClasificacion({
  evaluaciones,
  modoOscuro,
  colorTexto,
  colorSecundario,
  colorTarjeta
}) {
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

  const clasificaciones = [
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
        {clasificaciones.map((item) => (
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
  )
}
