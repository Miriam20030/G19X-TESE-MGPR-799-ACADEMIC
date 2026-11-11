
package com.evaluacionproveedores.backend.controller;

import com.evaluacionproveedores.backend.model.Evaluacion;
import com.evaluacionproveedores.backend.repository.EvaluacionRepository;
import com.evaluacionproveedores.backend.repository.ProveedorRepository;
import com.evaluacionproveedores.backend.service.EvaluacionService;

import jakarta.validation.Valid;

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

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private EvaluacionService evaluacionService;

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
    public ResponseEntity<?> crearEvaluacion(
            @Valid @RequestBody Evaluacion evaluacion) {

        // Verificar que exista el proveedor
        if (evaluacion.getIdProveedor() == null ||
                !proveedorRepository.existsById(evaluacion.getIdProveedor())) {

            return ResponseEntity.badRequest()
                    .body("El proveedor indicado no existe.");
        }

        // Calcular calificación y clasificación en el servidor
        evaluacionService.calcularCalificacion(evaluacion);

        // Generar fecha automáticamente
        evaluacion.setFechaEvaluacion(
                java.time.LocalDateTime.now()
        );

        // Guardar evaluación con los resultados calculados
        Evaluacion nuevaEvaluacion =
                evaluacionRepository.save(evaluacion);

        return ResponseEntity.ok(nuevaEvaluacion);
    }

    // ==========================================
    // ACTUALIZAR UNA EVALUACIÓN
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarEvaluacion(
            @PathVariable Integer id,
            @Valid @RequestBody Evaluacion evaluacion) {

        // Verificar que exista la evaluación
        if (!evaluacionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Verificar que exista el proveedor
        if (evaluacion.getIdProveedor() == null ||
                !proveedorRepository.existsById(evaluacion.getIdProveedor())) {

            return ResponseEntity.badRequest()
                    .body("El proveedor indicado no existe.");
        }

        // Asignar el ID de la evaluación
        evaluacion.setIdEvaluacion(id);

        // Recalcular calificación y clasificación
        evaluacionService.calcularCalificacion(evaluacion);

        // Guardar evaluación actualizada
        Evaluacion evaluacionActualizada =
                evaluacionRepository.save(evaluacion);

        return ResponseEntity.ok(evaluacionActualizada);
    }

    // ==========================================
    // ELIMINAR UNA EVALUACIÓN
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEvaluacion(
            @PathVariable Integer id) {

        // Verificar que exista la evaluación
        if (!evaluacionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        evaluacionRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
