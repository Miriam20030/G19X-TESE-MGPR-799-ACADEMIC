from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Sistema de Evaluación Inteligente de Proveedores",
    description="API para el análisis inteligente de proveedores",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Evaluacion(BaseModel):

    cumplimientoEntregas: float
    calidad: float
    costos: float
    tiempoRespuesta: float
    incidencias: float


def calcular_calificacion(evaluacion):

    resultado = (
        (evaluacion.cumplimientoEntregas * 0.25) +
        (evaluacion.calidad * 0.25) +
        (evaluacion.costos * 0.20) +
        (evaluacion.tiempoRespuesta * 0.15) +
        (evaluacion.incidencias * 0.15)
    )

    return round(resultado, 2)


def obtener_clasificacion(calificacion):

    if calificacion >= 90:
        return "Excelente"

    if calificacion >= 80:
        return "Bueno"

    if calificacion >= 70:
        return "Regular"

    return "Riesgo"


def generar_recomendacion(datos, calificacion, clasificacion):

    indicadores = {
        "cumplimiento de entregas": datos.cumplimientoEntregas,
        "calidad": datos.calidad,
        "costos": datos.costos,
        "tiempo de respuesta": datos.tiempoRespuesta,
        "incidencias": datos.incidencias
    }

    indicador_critico = min(
        indicadores,
        key=indicadores.get
    )

    valor_critico = indicadores[indicador_critico]

    if clasificacion == "Excelente":

        recomendacion = (
            "El proveedor presenta un desempeño sobresaliente. "
            "Se recomienda mantener la relación comercial y "
            "realizar evaluaciones periódicas."
        )

    elif clasificacion == "Bueno":

        recomendacion = (
            f"El proveedor presenta un buen desempeño general. "
            f"El indicador con menor puntuación es "
            f"{indicador_critico} con {valor_critico} puntos. "
            f"Se recomienda darle seguimiento para mantener "
            f"su nivel de desempeño."
        )

    elif clasificacion == "Regular":

        recomendacion = (
            f"El proveedor presenta un desempeño regular. "
            f"El principal aspecto que requiere atención es "
            f"{indicador_critico}, con {valor_critico} puntos. "
            f"Se recomienda establecer acciones de mejora y "
            f"realizar una nueva evaluación posteriormente."
        )

    else:

        recomendacion = (
            f"El proveedor presenta indicadores de riesgo. "
            f"El aspecto más crítico es {indicador_critico}, "
            f"con {valor_critico} puntos. "
            f"Se recomienda establecer acciones correctivas, "
            f"dar seguimiento al proveedor y realizar una "
            f"nueva evaluación."
        )

    return recomendacion


@app.get("/")
def inicio():

    return {
        "mensaje": "API de evaluación inteligente funcionando"
    }


@app.get("/ia/estado")
def estado_ia():

    return {
        "estado": "activa",
        "mensaje": "El servicio de IA está funcionando correctamente"
    }


@app.post("/ia/analizar")
def analizar_evaluacion(evaluacion: Evaluacion):

    # 1. Calcular calificación
    calificacion = calcular_calificacion(evaluacion)

    # 2. Obtener clasificación
    clasificacion = obtener_clasificacion(calificacion)

    # 3. Generar recomendación
    recomendacion = generar_recomendacion(
        evaluacion,
        calificacion,
        clasificacion
    )

    # 4. Regresar resultado
    return {

        "mensaje": "Evaluación analizada correctamente",

        "calificacion": calificacion,

        "clasificacion": clasificacion,

        "recomendacion": recomendacion,

        "datos": {

            "cumplimientoEntregas":
                evaluacion.cumplimientoEntregas,

            "calidad":
                evaluacion.calidad,

            "costos":
                evaluacion.costos,

            "tiempoRespuesta":
                evaluacion.tiempoRespuesta,

            "incidencias":
                evaluacion.incidencias

        }

    }