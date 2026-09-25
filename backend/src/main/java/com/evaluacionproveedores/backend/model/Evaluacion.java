package com.evaluacionproveedores.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Evaluaciones")
public class Evaluacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idEvaluacion")
    private Integer idEvaluacion;

    @Column(name = "idProveedor", nullable = false)
    private Integer idProveedor;

    @Column(name = "cumplimientoEntregas", nullable = false)
    private Double cumplimientoEntregas;

    @Column(name = "calidad", nullable = false)
    private Double calidad;

    @Column(name = "costos", nullable = false)
    private Double costos;

    @Column(name = "tiempoRespuesta", nullable = false)
    private Double tiempoRespuesta;

    @Column(name = "incidencias", nullable = false)
    private Double incidencias;

    @Column(name = "calificacionFinal")
    private Double calificacionFinal;

    @Column(name = "clasificacion")
    private String clasificacion;

@Column(name = "recomendacion")
private String recomendacion;


    @Column(name = "fechaEvaluacion")
    private LocalDateTime fechaEvaluacion;


    // ==========================================
    // CONSTRUCTOR VACÍO
    // ==========================================

    public Evaluacion() {
    }


    // ==========================================
    // GETTERS Y SETTERS
    // ==========================================

    public Integer getIdEvaluacion() {
        return idEvaluacion;
    }

    public void setIdEvaluacion(Integer idEvaluacion) {
        this.idEvaluacion = idEvaluacion;
    }


    public Integer getIdProveedor() {
        return idProveedor;
    }

    public void setIdProveedor(Integer idProveedor) {
        this.idProveedor = idProveedor;
    }


    public Double getCumplimientoEntregas() {
        return cumplimientoEntregas;
    }

    public void setCumplimientoEntregas(Double cumplimientoEntregas) {
        this.cumplimientoEntregas = cumplimientoEntregas;
    }


    public Double getCalidad() {
        return calidad;
    }

    public void setCalidad(Double calidad) {
        this.calidad = calidad;
    }


    public Double getCostos() {
        return costos;
    }

    public void setCostos(Double costos) {
        this.costos = costos;
    }


    public Double getTiempoRespuesta() {
        return tiempoRespuesta;
    }

    public void setTiempoRespuesta(Double tiempoRespuesta) {
        this.tiempoRespuesta = tiempoRespuesta;
    }


    public Double getIncidencias() {
        return incidencias;
    }

    public void setIncidencias(Double incidencias) {
        this.incidencias = incidencias;
    }


    public Double getCalificacionFinal() {
        return calificacionFinal;
    }

    public void setCalificacionFinal(Double calificacionFinal) {
        this.calificacionFinal = calificacionFinal;
    }


    public String getClasificacion() {
        return clasificacion;
    }

    public void setClasificacion(String clasificacion) {
        this.clasificacion = clasificacion;
    }

    public String getRecomendacion() {
    return recomendacion;
}

public void setRecomendacion(String recomendacion) {
    this.recomendacion = recomendacion;
}

    public LocalDateTime getFechaEvaluacion() {
        return fechaEvaluacion;
    }

    public void setFechaEvaluacion(LocalDateTime fechaEvaluacion) {
        this.fechaEvaluacion = fechaEvaluacion;
    }
}