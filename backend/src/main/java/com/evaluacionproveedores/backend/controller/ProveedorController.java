package com.evaluacionproveedores.backend.controller;

import com.evaluacionproveedores.backend.model.Proveedor;
import com.evaluacionproveedores.backend.repository.ProveedorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "http://localhost:5173")
public class ProveedorController {

    private final ProveedorRepository proveedorRepository;

    public ProveedorController(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    // ==========================================
    // OBTENER TODOS LOS PROVEEDORES
    // ==========================================
    @GetMapping
    public List<Proveedor> obtenerProveedores() {

        return proveedorRepository.findAll();
    }

    // ==========================================
    // OBTENER UN PROVEEDOR POR ID
    // ==========================================
    @GetMapping("/{id}")
    public Proveedor obtenerProveedor(
            @PathVariable Integer id
    ) {

        return proveedorRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Proveedor no encontrado")
                );
    }

    // ==========================================
    // REGISTRAR UN PROVEEDOR
    // ==========================================
    @PostMapping
    public Proveedor guardarProveedor(
            @RequestBody Proveedor proveedor
    ) {

        System.out.println("========== REGISTRANDO PROVEEDOR ==========");
        System.out.println("Nombre: " + proveedor.getNombre());
        System.out.println("Contacto: " + proveedor.getContacto());
        System.out.println("Correo: " + proveedor.getCorreo());
        System.out.println("===========================================");

        return proveedorRepository.save(proveedor);
    }

    // ==========================================
    // EDITAR UN PROVEEDOR
    // ==========================================
    @PutMapping("/{id}")
    public Proveedor editarProveedor(
            @PathVariable Integer id,
            @RequestBody Proveedor proveedor
    ) {

        Proveedor proveedorExistente = proveedorRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Proveedor no encontrado")
                );

        proveedorExistente.setNombre(proveedor.getNombre());
        proveedorExistente.setContacto(proveedor.getContacto());
        proveedorExistente.setCorreo(proveedor.getCorreo());
        proveedorExistente.setTelefono(proveedor.getTelefono());
        proveedorExistente.setRfc(proveedor.getRfc());
        proveedorExistente.setEstado(proveedor.getEstado());

        return proveedorRepository.save(proveedorExistente);
    }

    // ==========================================
    // SUBIR / CAMBIAR FOTO DEL PROVEEDOR
    // ==========================================
    @PostMapping("/{id}/foto")
    public ResponseEntity<?> subirFoto(
            @PathVariable Integer id,
            @RequestParam("foto") MultipartFile foto
    ) {

        System.out.println();
        System.out.println("========== FOTO RECIBIDA ==========");
        System.out.println("ID proveedor: " + id);
        System.out.println("Nombre foto: " + foto.getOriginalFilename());
        System.out.println("Tipo foto: " + foto.getContentType());
        System.out.println("Tamaño foto: " + foto.getSize());
        System.out.println("===================================");
        System.out.println();

        try {

            // ==========================================
            // BUSCAR PROVEEDOR
            // ==========================================

            Proveedor proveedor = proveedorRepository
                    .findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Proveedor no encontrado")
                    );

            System.out.println("Proveedor encontrado: " + proveedor.getNombre());

            // ==========================================
            // VERIFICAR FOTO
            // ==========================================

            if (foto.isEmpty()) {

                System.out.println("ERROR: La foto está vacía.");

                return ResponseEntity.badRequest()
                        .body("No se seleccionó ninguna imagen");
            }

            // ==========================================
            // CREAR CARPETA
            // ==========================================

            Path carpeta = Paths.get(
                    "uploads",
                    "proveedores"
            ).toAbsolutePath();

            System.out.println("Carpeta de imágenes:");
            System.out.println(carpeta);

            if (!Files.exists(carpeta)) {

                System.out.println("La carpeta no existe.");
                System.out.println("Creando carpeta...");

                Files.createDirectories(carpeta);

                System.out.println("Carpeta creada correctamente.");
            }

            // ==========================================
            // OBTENER EXTENSIÓN
            // ==========================================

            String nombreOriginal =
                    foto.getOriginalFilename();

            String extension = "";

            if (
                    nombreOriginal != null &&
                    nombreOriginal.contains(".")
            ) {

                extension =
                        nombreOriginal.substring(
                                nombreOriginal.lastIndexOf(".")
                        );
            }

            // ==========================================
            // CREAR NOMBRE DEL ARCHIVO
            // ==========================================

            String nombreArchivo =
                    "proveedor_" +
                    id +
                    "_" +
                    UUID.randomUUID() +
                    extension;

            System.out.println(
                    "Nombre nuevo de la imagen: " +
                    nombreArchivo
            );

            // ==========================================
            // CREAR RUTA FINAL
            // ==========================================

            Path rutaArchivo =
                    carpeta.resolve(nombreArchivo);

            System.out.println(
                    "Ruta final de la imagen:"
            );

            System.out.println(
                    rutaArchivo.toAbsolutePath()
            );

            // ==========================================
            // GUARDAR ARCHIVO
            // ==========================================

            System.out.println(
                    "Guardando imagen..."
            );

            Files.copy(
                    foto.getInputStream(),
                    rutaArchivo,
                    StandardCopyOption.REPLACE_EXISTING
            );

            System.out.println(
                    "Imagen guardada correctamente."
            );

            // ==========================================
            // GUARDAR URL EN LA BASE DE DATOS
            // ==========================================

            String urlFoto =
                    "/uploads/proveedores/" +
                    nombreArchivo;

            System.out.println(
                    "URL que se guardará en la BD:"
            );

            System.out.println(urlFoto);

            proveedor.setFotoUrl(urlFoto);

            proveedorRepository.save(proveedor);

            System.out.println(
                    "Proveedor actualizado en la BD."
            );

            System.out.println();
            System.out.println(
                    "========== FOTO GUARDADA =========="
            );
            System.out.println(
                    "Proveedor: " + proveedor.getNombre()
            );
            System.out.println(
                    "ID: " + proveedor.getIdProveedor()
            );
            System.out.println(
                    "Foto: " + urlFoto
            );
            System.out.println(
                    "==================================="
            );
            System.out.println();

            return ResponseEntity.ok(proveedor);

        } catch (IOException e) {

            System.out.println();
            System.out.println(
                    "========== ERROR AL GUARDAR FOTO =========="
            );

            e.printStackTrace();

            System.out.println(
                    "============================================"
            );
            System.out.println();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Error al guardar la imagen: " +
                            e.getMessage()
                    );
        }
    }

    // ==========================================
    // ELIMINAR UN PROVEEDOR
    // ==========================================
    @DeleteMapping("/{id}")
    public void eliminarProveedor(
            @PathVariable Integer id
    ) {

        System.out.println(
                "========== DELETE RECIBIDO =========="
        );

        System.out.println(
                "ID recibido: " + id
        );

        proveedorRepository.deleteById(id);

        System.out.println(
                "Proveedor eliminado: " + id
        );

        System.out.println(
                "====================================="
        );
    }
}