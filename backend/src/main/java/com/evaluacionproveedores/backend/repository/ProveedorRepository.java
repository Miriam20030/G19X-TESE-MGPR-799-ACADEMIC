package com.evaluacionproveedores.backend.repository;

import com.evaluacionproveedores.backend.model.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProveedorRepository extends JpaRepository<Proveedor, Integer> {

}