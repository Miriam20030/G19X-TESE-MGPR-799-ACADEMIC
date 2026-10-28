
package com.evaluacionproveedores.backend.controller;

import com.evaluacionproveedores.backend.model.Evaluacion;
import com.evaluacionproveedores.backend.repository.EvaluacionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class EvaluacionController {

    @Autowired
    private EvaluacionRepository evaluacionRepository;


    // ==========================================
    // OBTENER TODAS LAS EVALUACIONES
    // ==========================================

    @GetMapping
    public List<Evaluacion> obtenerEvaluaciones() {
        return evaluacionRepository.findAll();
    }


    // ==========================================
    // OBTENER UNA EVALUACIÓN POR ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Evaluacion> obtenerEvaluacion(
            @PathVariable Integer id) {

        return evaluacionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    // ==========================================
    // CREAR UNA EVALUACIÓN
    // ==========================================

    @PostMapping
    public Evaluacion crearEvaluacion(
            @RequestBody Evaluacion evaluacion) {

        // La fecha se genera automáticamente
        // al momento de guardar la evaluación.
        evaluacion.setFechaEvaluacion(
                java.time.LocalDateTime.now()
        );

        return evaluacionRepository.save(evaluacion);
    }


    // ==========================================
    // ACTUALIZAR UNA EVALUACIÓN
    // ==========================================

    @PutMapping("/{id}")
    public Evaluacion actualizarEvaluacion(
            @PathVariable Integer id,
            @RequestBody Evaluacion evaluacion) {

        evaluacion.setIdEvaluacion(id);

        return evaluacionRepository.save(evaluacion);
    }


    // ==========================================
    // ELIMINAR UNA EVALUACIÓN
    // ==========================================

    @DeleteMapping("/{id}")
    public void eliminarEvaluacion(
            @PathVariable Integer id) {

        evaluacionRepository.deleteById(id);
    }
}
