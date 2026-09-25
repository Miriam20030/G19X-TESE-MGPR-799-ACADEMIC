function Configuracion({
    modoOscuro,
    setModoOscuro,
    colorPrincipal,
    setColorPrincipal
}) {

    const colores = [
        {
            nombre: 'Azul',
            valor: '#2563eb'
        },
        {
            nombre: 'Morado',
            valor: '#7c3aed'
        },
        {
            nombre: 'Verde',
            valor: '#16a34a'
        },
        {
            nombre: 'Naranja',
            valor: '#ea580c'
        }
    ]


    return (

        <div style={{
            padding: '30px',
            minHeight: '100vh',

            backgroundColor: modoOscuro
                ? '#0f172a'
                : '#f8fafc',

            color: modoOscuro
                ? '#f8fafc'
                : '#1e293b',

            transition: '0.3s'
        }}>


            {/* ENCABEZADO */}

            <div style={{
                marginBottom: '30px'
            }}>

                <h1 style={{
                    margin: 0,
                    color: colorPrincipal
                }}>
                    ⚙️ Configuración
                </h1>

                <p style={{
                    color: modoOscuro
                        ? '#cbd5e1'
                        : '#64748b',

                    marginTop: '8px'
                }}>
                    Personaliza la apariencia del sistema.
                </p>

            </div>


            {/* TARJETA */}

            <div style={{
                backgroundColor: modoOscuro
                    ? '#1e293b'
                    : 'white',

                padding: '25px',

                borderRadius: '15px',

                boxShadow:
                    '0 4px 12px rgba(0,0,0,0.06)',

                maxWidth: '700px'
            }}>


                <h2 style={{
                    marginTop: 0
                }}>
                    🎨 Apariencia
                </h2>


                {/* MODO OSCURO */}

                <div style={{
                    display: 'flex',

                    justifyContent: 'space-between',

                    alignItems: 'center',

                    padding: '20px 0',

                    borderBottom:
                        modoOscuro
                            ? '1px solid #334155'
                            : '1px solid #e2e8f0'
                }}>

                    <div>

                        <strong>
                            Modo oscuro
                        </strong>

                        <p style={{
                            margin: '5px 0 0',

                            color: modoOscuro
                                ? '#cbd5e1'
                                : '#64748b'
                        }}>
                            Cambia la apariencia de la interfaz.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            setModoOscuro(!modoOscuro)
                        }

                        style={{
                            border: 'none',

                            borderRadius: '25px',

                            padding: '10px 18px',

                            cursor: 'pointer',

                            backgroundColor:
                                modoOscuro
                                    ? '#f8fafc'
                                    : colorPrincipal,

                            color:
                                modoOscuro
                                    ? '#1e293b'
                                    : 'white',

                            fontWeight: '600',

                            transition: '0.3s'
                        }}
                    >

                        {modoOscuro
                            ? '☀️ Claro'
                            : '🌙 Oscuro'}

                    </button>

                </div>


                {/* COLOR PRINCIPAL */}

                <div style={{
                    paddingTop: '25px'
                }}>

                    <strong>
                        🎨 Color principal
                    </strong>

                    <p style={{
                        margin: '5px 0 20px',

                        color: modoOscuro
                            ? '#cbd5e1'
                            : '#64748b'
                    }}>
                        Elige el color principal de la interfaz.
                    </p>


                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        flexWrap: 'wrap'
                    }}>

                        {colores.map((color) => (

                            <button
                                key={color.valor}

                                onClick={() =>
                                    setColorPrincipal(
                                        color.valor
                                    )
                                }

                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',

                                    padding: '10px 16px',

                                    borderRadius: '10px',

                                    cursor: 'pointer',

                                    border:
                                        colorPrincipal === color.valor
                                            ? `3px solid ${color.valor}`
                                            : '1px solid #cbd5e1',

                                    backgroundColor:
                                        modoOscuro
                                            ? '#0f172a'
                                            : 'white',

                                    color:
                                        modoOscuro
                                            ? '#f8fafc'
                                            : '#1e293b',

                                    fontWeight: '600'
                                }}
                            >

                                <span style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    backgroundColor: color.valor,
                                    display: 'inline-block'
                                }}>
                                </span>

                                {color.nombre}

                                {colorPrincipal === color.valor && (
                                    <span>
                                        ✓
                                    </span>
                                )}

                            </button>

                        ))}

                    </div>

                </div>


                {/* TEMA ACTUAL */}

                <div style={{
                    marginTop: '30px',

                    paddingTop: '20px',

                    borderTop:
                        modoOscuro
                            ? '1px solid #334155'
                            : '1px solid #e2e8f0'
                }}>

                    <strong>
                        Configuración actual
                    </strong>

                    <p style={{
                        margin: '8px 0',

                        color: modoOscuro
                            ? '#cbd5e1'
                            : '#64748b'
                    }}>
                        Tema:{' '}
                        {modoOscuro
                            ? 'Oscuro 🌙'
                            : 'Claro ☀️'}
                    </p>

                    <p style={{
                        margin: 0,

                        color: modoOscuro
                            ? '#cbd5e1'
                            : '#64748b'
                    }}>
                        Color principal:{' '}

                        <span style={{
                            display: 'inline-block',

                            width: '14px',
                            height: '14px',

                            borderRadius: '50%',

                            backgroundColor:
                                colorPrincipal,

                            marginRight: '6px',

                            verticalAlign: 'middle'
                        }}>
                        </span>

                        {colorPrincipal}

                    </p>

                </div>

            </div>

        </div>
    )
}

export default Configuracion