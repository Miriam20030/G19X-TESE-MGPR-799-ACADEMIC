import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


# ==========================================
# 1. CARGAR DATOS
# ==========================================

datos = pd.read_csv("datos_entrenamiento.csv")

print("Datos cargados correctamente.")
print(f"Total de registros: {len(datos)}")


# ==========================================
# 2. DEFINIR CARACTERÍSTICAS
# ==========================================

caracteristicas = [
    "cumplimientoEntregas",
    "calidad",
    "costos",
    "tiempoRespuesta",
    "incidencias"
]

X = datos[caracteristicas]

y = datos["riesgo"]


# ==========================================
# 3. DIVIDIR LOS DATOS
# ==========================================

X_entrenamiento, X_prueba, y_entrenamiento, y_prueba = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("\nDatos de entrenamiento:", len(X_entrenamiento))
print("Datos de prueba:", len(X_prueba))


# ==========================================
# 4. CREAR EL MODELO DE IA
# ==========================================

modelo = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# ==========================================
# 5. ENTRENAR EL MODELO
# ==========================================

modelo.fit(
    X_entrenamiento,
    y_entrenamiento
)

print("\nModelo entrenado correctamente.")


# ==========================================
# 6. REALIZAR PREDICCIONES
# ==========================================

predicciones = modelo.predict(X_prueba)


# ==========================================
# 7. EVALUAR EL MODELO
# ==========================================

precision = accuracy_score(
    y_prueba,
    predicciones
)

print("\n==========================================")
print("RESULTADOS DEL MODELO")
print("==========================================")

print(f"\nPrecisión: {precision * 100:.2f}%")

print("\nReporte de clasificación:")
print(
    classification_report(
        y_prueba,
        predicciones
    )
)


# ==========================================
# 8. GUARDAR EL MODELO
# ==========================================

joblib.dump(
    modelo,
    "modelo_riesgo.pkl"
)

print("\nModelo guardado como:")
print("modelo_riesgo.pkl")