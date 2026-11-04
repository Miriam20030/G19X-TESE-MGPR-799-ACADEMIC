
package com.evaluacionproveedores.backend.service;

import org.springframework.stereotype.Service;

import com.evaluacionproveedores.backend.model.Evaluacion;

@Service
public class EvaluacionService {

    public void calcularCalificacion(Evaluacion evaluacion) {

        double resultado =
                evaluacion.getCumplimientoEntregas() * 0.25 +
                evaluacion.getCalidad() * 0.25 +
                evaluacion.getCostos() * 0.20 +
                evaluacion.getTiempoRespuesta() * 0.15 +
                evaluacion.getIncidencias() * 0.15;

        double resultadoFinal = Math.round(resultado * 100.0) / 100.0;

        String clasificacion;

        if (resultadoFinal >= 90) {
            clasificacion = "Excelente";
        } else if (resultadoFinal >= 80) {
            clasificacion = "Bueno";
        } else if (resultadoFinal >= 70) {
            clasificacion = "Regular";
        } else {
            clasificacion = "Riesgo";
        }

        evaluacion.setCalificacionFinal(resultadoFinal);
        evaluacion.setClasificacion(clasificacion);
    }
}
