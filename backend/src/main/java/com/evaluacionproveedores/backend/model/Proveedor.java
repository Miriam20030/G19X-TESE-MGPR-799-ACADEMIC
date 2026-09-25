package com.evaluacionproveedores.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Proveedores")
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdProveedor")
    private Integer idProveedor;

    @Column(name = "Nombre")
    private String nombre;

    @Column(name = "Contacto")
    private String contacto;

    @Column(name = "Correo")
    private String correo;

    @Column(name = "Telefono")
    private String telefono;

    @Column(name = "RFC")
    private String rfc;

    @Column(name = "Estado")
    private String estado;

    @Column(name = "fotoUrl")
    private String fotoUrl;


    // ==========================================
    // CONSTRUCTOR VACÍO
    // ==========================================
    public Proveedor() {
    }


    // ==========================================
    // GETTERS Y SETTERS
    // ==========================================

    public Integer getIdProveedor() {
        return idProveedor;
    }

    public void setIdProveedor(Integer idProveedor) {
        this.idProveedor = idProveedor;
    }


    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }


    public String getContacto() {
        return contacto;
    }

    public void setContacto(String contacto) {
        this.contacto = contacto;
    }


    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }


    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }


    public String getRfc() {
        return rfc;
    }

    public void setRfc(String rfc) {
        this.rfc = rfc;
    }


    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }


    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }
}