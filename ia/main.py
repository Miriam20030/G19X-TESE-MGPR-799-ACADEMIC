from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os


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


# ==========================================
# CARGAR MODELO DE INTELIGENCIA ARTIFICIAL
# ==========================================

RUTA_MODELO = os.path.join(
    os.path.dirname(__file__),
    "modelo_riesgo.pkl"
)

modelo = joblib.load(RUTA_MODELO)


# ==========================================
# MODELO DE DATOS
# ==========================================

class Evaluacion(BaseModel):

    cumplimientoEntregas: float
    calidad: float
    costos: float
    tiempoRespuesta: float
    incidencias: float


# ==========================================
# CALIFICACIÓN TRADICIONAL
# ==========================================

def calcular_calificacion(evaluacion):

    resultado = (
        (evaluacion.cumplimientoEntregas * 0.25) +
        (evaluacion.calidad * 0.25) +
        (evaluacion.costos * 0.20) +
        (evaluacion.tiempoRespuesta * 0.15) +
        (evaluacion.incidencias * 0.15)
    )

    return round(resultado, 2)


# ==========================================
# CLASIFICACIÓN TRADICIONAL
# ==========================================

def obtener_clasificacion(calificacion):

    if calificacion >= 90:
        return "Excelente"

    if calificacion >= 80:
        return "Bueno"

    if calificacion >= 70:
        return "Regular"

    return "Riesgo"


# ==========================================
# PREDICCIÓN CON INTELIGENCIA ARTIFICIAL
# ==========================================

def predecir_riesgo_ia(evaluacion):

    datos_modelo = [[
        evaluacion.cumplimientoEntregas,
        evaluacion.calidad,
        evaluacion.costos,
        evaluacion.tiempoRespuesta,
        evaluacion.incidencias
    ]]

    # Predicción de la categoría
    prediccion = modelo.predict(datos_modelo)[0]

    # Probabilidades de cada categoría
    probabilidades = modelo.predict_proba(datos_modelo)[0]

    # Obtener las clases que conoce el modelo
    clases = modelo.classes_

    probabilidades_clases = dict(
        zip(clases, probabilidades)
    )

    # Probabilidad de riesgo alto
    probabilidad_alto = probabilidades_clases.get(
        "Alto",
        0
    )

    return {
        "riesgoIA": prediccion,
        "probabilidadRiesgoAlto": round(
            float(probabilidad_alto) * 100,
            2
        )
    }


# ==========================================
# GENERAR RECOMENDACIÓN
# ==========================================

def generar_recomendacion(
    datos,
    calificacion,
    clasificacion
):

    # ==========================================
    # OBTENER INDICADORES
    # ==========================================

    indicadores = {
        "cumplimiento de entregas":
            datos.cumplimientoEntregas,

        "calidad":
            datos.calidad,

        "costos":
            datos.costos,

        "tiempo de respuesta":
            datos.tiempoRespuesta,

        "incidencias":
            datos.incidencias
    }


    # ==========================================
    # ORDENAR INDICADORES
    # ==========================================

    indicadores_ordenados = sorted(
        indicadores.items(),
        key=lambda x: x[1]
    )


    # Obtener los tres indicadores más bajos
    principales = indicadores_ordenados[:3]


    # ==========================================
    # TEXTO DE LOS PRINCIPALES PROBLEMAS
    # ==========================================

    principales_texto = ", ".join(
        [
            f"{nombre} ({valor:.2f} puntos)"
            for nombre, valor in principales
        ]
    )


    # ==========================================
    # GENERAR ACCIONES DE MEJORA
    # ==========================================

    acciones = []


    for nombre, valor in principales:

        # --------------------------------------
        # CUMPLIMIENTO DE ENTREGAS
        # --------------------------------------

        if (
            nombre == "cumplimiento de entregas"
            and valor < 70
        ):

            acciones.append(
                "establecer compromisos de entrega con "
                "fechas definidas y dar seguimiento al "
                "cumplimiento de los pedidos"
            )


        # --------------------------------------
        # CALIDAD
        # --------------------------------------

        elif (
            nombre == "calidad"
            and valor < 70
        ):

            acciones.append(
                "implementar controles de calidad, "
                "identificar las causas de los problemas "
                "detectados y establecer acciones correctivas"
            )


        # --------------------------------------
        # COSTOS
        # --------------------------------------

        elif (
            nombre == "costos"
            and valor < 70
        ):

            acciones.append(
                "revisar los costos del servicio, negociar "
                "condiciones comerciales y buscar alternativas "
                "para mejorar la relación costo-beneficio"
            )


        # --------------------------------------
        # TIEMPO DE RESPUESTA
        # --------------------------------------

        elif (
            nombre == "tiempo de respuesta"
            and valor < 70
        ):

            acciones.append(
                "establecer tiempos máximos de atención y "
                "mejorar los canales de comunicación con "
                "el proveedor"
            )


        # --------------------------------------
        # INCIDENCIAS
        # --------------------------------------

        elif (
            nombre == "incidencias"
            and valor < 70
        ):

            acciones.append(
                "identificar las causas de las incidencias, "
                "documentar los problemas recurrentes y "
                "establecer medidas preventivas"
            )


    # ==========================================
    # ELIMINAR ACCIONES REPETIDAS
    # ==========================================

    acciones = list(
        dict.fromkeys(acciones)
    )


    # ==========================================
    # RECOMENDACIÓN EXCELENTE
    # ==========================================

    if clasificacion == "Excelente":

        recomendacion = (

            f"El proveedor presenta un desempeño "
            f"sobresaliente, con una calificación general "
            f"de {calificacion:.2f} puntos. "

            f"Los indicadores con menor puntuación son: "
            f"{principales_texto}. "

            f"Se recomienda mantener la relación comercial, "
            f"conservar las condiciones actuales de servicio "
            f"y continuar con evaluaciones periódicas para "
            f"asegurar que el nivel de desempeño se mantenga."
        )


    # ==========================================
    # RECOMENDACIÓN BUENA
    # ==========================================

    elif clasificacion == "Bueno":

        recomendacion = (

            f"El proveedor presenta un buen desempeño general, "
            f"con una calificación de {calificacion:.2f} puntos. "

            f"Los principales aspectos que requieren seguimiento "
            f"son: {principales_texto}. "

            f"Se recomienda establecer acciones preventivas "
            f"sobre estos indicadores y mantener un seguimiento "
            f"periódico para evitar una disminución en el "
            f"desempeño del proveedor."
        )


    # ==========================================
    # RECOMENDACIÓN REGULAR
    # ==========================================

    elif clasificacion == "Regular":

        recomendacion = (

            f"El proveedor presenta un desempeño regular, "
            f"con una calificación de {calificacion:.2f} puntos. "

            f"Los principales aspectos que requieren atención "
            f"son: {principales_texto}. "
        )


        if acciones:

            recomendacion += (

                f"Se recomienda implementar acciones de mejora "
                f"enfocadas en {'; '.join(acciones)}. "
            )


        recomendacion += (

            f"Se sugiere realizar un seguimiento periódico "
            f"de los resultados y efectuar una nueva evaluación "
            f"para comprobar si las medidas implementadas "
            f"generan una mejora."
        )


    # ==========================================
    # RECOMENDACIÓN DE RIESGO
    # ==========================================

    else:

        recomendacion = (

            f"El proveedor presenta indicadores de riesgo, "
            f"con una calificación general de "
            f"{calificacion:.2f} puntos. "

            f"Los principales aspectos que requieren atención "
            f"son: {principales_texto}. "
        )


        if acciones:

            recomendacion += (

                f"Se recomienda establecer un plan de acciones "
                f"correctivas enfocado en "
                f"{'; '.join(acciones)}. "
            )


        recomendacion += (

            f"También se recomienda dar seguimiento periódico "
            f"al proveedor, documentar las acciones implementadas "
            f"y establecer un periodo de revisión para verificar "
            f"la evolución de su desempeño. "

            f"Posteriormente, se deberá realizar una nueva "
            f"evaluación para determinar si las medidas "
            f"correctivas fueron efectivas."
        )


    return recomendacion


# ==========================================
# RUTA PRINCIPAL
# ==========================================

@app.get("/")
def inicio():

    return {
        "mensaje":
            "API de evaluación inteligente funcionando"
    }


# ==========================================
# ESTADO DE LA IA
# ==========================================

@app.get("/ia/estado")
def estado_ia():

    return {

        "estado": "activa",

        "modelo": "Random Forest",

        "mensaje":
            "El servicio de IA está funcionando correctamente"
    }


# ==========================================
# ANALIZAR EVALUACIÓN
# ==========================================

@app.post("/ia/analizar")
def analizar_evaluacion(evaluacion: Evaluacion):

    # ------------------------------------------
    # 1. CALCULAR CALIFICACIÓN TRADICIONAL
    # ------------------------------------------

    calificacion = calcular_calificacion(
        evaluacion
    )


    # ------------------------------------------
    # 2. OBTENER CLASIFICACIÓN TRADICIONAL
    # ------------------------------------------

    clasificacion = obtener_clasificacion(
        calificacion
    )


    # ------------------------------------------
    # 3. REALIZAR PREDICCIÓN MEDIANTE IA
    # ------------------------------------------

    resultado_ia = predecir_riesgo_ia(
        evaluacion
    )


    # ------------------------------------------
    # 4. GENERAR RECOMENDACIÓN
    # ------------------------------------------

    recomendacion = generar_recomendacion(
        evaluacion,
        calificacion,
        clasificacion
    )


    # ------------------------------------------
    # 5. REGRESAR TODOS LOS RESULTADOS
    # ------------------------------------------

    return {

        "mensaje":
            "Evaluación analizada correctamente",

        "calificacion":
            calificacion,

        "clasificacion":
            clasificacion,

        "riesgoIA":
            resultado_ia["riesgoIA"],

        "probabilidadRiesgoAlto":
            resultado_ia["probabilidadRiesgoAlto"],

        "recomendacion":
            recomendacion,

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