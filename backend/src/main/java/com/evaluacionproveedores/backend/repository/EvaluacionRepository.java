package com.evaluacionproveedores.backend.repository;

import com.evaluacionproveedores.backend.model.Evaluacion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluacionRepository extends JpaRepository<Evaluacion, Integer> {

    void deleteByIdProveedor(Integer idProveedor);

}