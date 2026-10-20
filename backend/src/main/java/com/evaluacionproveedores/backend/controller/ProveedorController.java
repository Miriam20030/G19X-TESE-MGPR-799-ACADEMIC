
package com.evaluacionproveedores.backend.controller;

import com.evaluacionproveedores.backend.model.Proveedor;
import com.evaluacionproveedores.backend.repository.EvaluacionRepository;
import com.evaluacionproveedores.backend.repository.ProveedorRepository;

import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    private static final Logger logger =
            LoggerFactory.getLogger(ProveedorController.class);

    private final ProveedorRepository proveedorRepository;
    private final EvaluacionRepository evaluacionRepository;

    public ProveedorController(
            ProveedorRepository proveedorRepository,
            EvaluacionRepository evaluacionRepository) {

        this.proveedorRepository = proveedorRepository;
        this.evaluacionRepository = evaluacionRepository;
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
    public ResponseEntity<?> obtenerProveedor(
            @PathVariable Integer id) {

        return proveedorRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ==========================================
    // REGISTRAR UN PROVEEDOR
    // ==========================================

    @PostMapping
    public Proveedor guardarProveedor(
            @RequestBody Proveedor proveedor) {

        logger.info("Solicitud para registrar un proveedor recibida.");

        return proveedorRepository.save(proveedor);
    }

    // ==========================================
    // EDITAR UN PROVEEDOR
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> editarProveedor(
            @PathVariable Integer id,
            @RequestBody Proveedor proveedor) {

        Proveedor proveedorExistente = proveedorRepository
                .findById(id)
                .orElse(null);

        if (proveedorExistente == null) {
            return ResponseEntity.notFound().build();
        }

        proveedorExistente.setNombre(proveedor.getNombre());
        proveedorExistente.setContacto(proveedor.getContacto());
        proveedorExistente.setCorreo(proveedor.getCorreo());
        proveedorExistente.setTelefono(proveedor.getTelefono());
        proveedorExistente.setRfc(proveedor.getRfc());
        proveedorExistente.setEstado(proveedor.getEstado());

        return ResponseEntity.ok(
                proveedorRepository.save(proveedorExistente)
        );
    }

    // ==========================================
    // SUBIR / CAMBIAR FOTO DEL PROVEEDOR
    // ==========================================

    @PostMapping("/{id}/foto")
    public ResponseEntity<?> subirFoto(
            @PathVariable Integer id,
            @RequestParam("foto") MultipartFile foto) {

        if (foto == null || foto.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("No se seleccionó ninguna imagen.");
        }

        try {
            Proveedor proveedor = proveedorRepository
                    .findById(id)
                    .orElse(null);

            if (proveedor == null) {
                return ResponseEntity.notFound().build();
            }

            // Crear carpeta de imágenes si no existe.

            Path carpeta = Paths.get(
                    "uploads",
                    "proveedores"
            ).toAbsolutePath().normalize();

            Files.createDirectories(carpeta);

            // Obtener una extensión permitida.

            String nombreOriginal = foto.getOriginalFilename();

            String extension = "";

            if (nombreOriginal != null) {
                int punto = nombreOriginal.lastIndexOf('.');

                if (punto >= 0) {
                    extension = nombreOriginal
                            .substring(punto)
                            .toLowerCase(java.util.Locale.ROOT);
                }
            }

            if (!List.of(".jpg", ".jpeg", ".png", ".webp")
                    .contains(extension)) {

                return ResponseEntity.badRequest()
                        .body("Formato de imagen no permitido.");
            }

            // Generar un nombre de archivo único.

            String nombreArchivo = "proveedor_"
                    + id
                    + "_"
                    + UUID.randomUUID()
                    + extension;

            Path rutaArchivo = carpeta
                    .resolve(nombreArchivo)
                    .normalize();

            if (!rutaArchivo.startsWith(carpeta)) {
                return ResponseEntity.badRequest()
                        .body("Ruta de archivo no válida.");
            }

            // Guardar la imagen.

            Files.copy(
                    foto.getInputStream(),
                    rutaArchivo,
                    StandardCopyOption.REPLACE_EXISTING
            );

            // Guardar la URL en la base de datos.

            String urlFoto = "/uploads/proveedores/"
                    + nombreArchivo;

            proveedor.setFotoUrl(urlFoto);
            Proveedor proveedorGuardado =
                    proveedorRepository.save(proveedor);

            logger.info(
                    "Imagen de proveedor guardada. ID: {}",
                    id
            );

            return ResponseEntity.ok(proveedorGuardado);

        } catch (IOException e) {
            logger.error(
                    "No se pudo guardar la imagen del proveedor. ID: {}",
                    id,
                    e
            );

            return ResponseEntity.internalServerError()
                    .body("No se pudo guardar la imagen.");
        }
    }

    // ==========================================
    // ELIMINAR UN PROVEEDOR Y SU INFORMACIÓN
    // ==========================================

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> eliminarProveedor(
            @PathVariable Integer id) {

        try {
            Proveedor proveedor = proveedorRepository
                    .findById(id)
                    .orElse(null);

            if (proveedor == null) {
                return ResponseEntity.notFound().build();
            }

            // Eliminar la foto del disco, si existe.

            if (proveedor.getFotoUrl() != null
                    && !proveedor.getFotoUrl().isBlank()) {

                String nombreArchivo = proveedor.getFotoUrl()
                        .substring(
                                proveedor.getFotoUrl().lastIndexOf("/") + 1
                        );

                Path carpeta = Paths.get(
                        "uploads",
                        "proveedores"
                ).toAbsolutePath().normalize();

                Path rutaFoto = carpeta
                        .resolve(nombreArchivo)
                        .normalize();

                if (!rutaFoto.startsWith(carpeta)) {
                    return ResponseEntity.badRequest()
                            .body("La ruta de la imagen no es válida.");
                }

                if (Files.exists(rutaFoto)) {
                    Files.delete(rutaFoto);
                }
            }

            // Eliminar evaluaciones relacionadas.

            evaluacionRepository.deleteByIdProveedor(id);

            // Eliminar proveedor.

            proveedorRepository.delete(proveedor);

            logger.info(
                    "Proveedor y sus evaluaciones eliminados. ID: {}",
                    id
            );

            return ResponseEntity.ok(
                    "Proveedor y toda su información fueron eliminados correctamente."
            );

        } catch (IOException e) {
            logger.error(
                    "No se pudo eliminar la foto del proveedor. ID: {}",
                    id,
                    e
            );

            return ResponseEntity.internalServerError()
                    .body("No se pudo eliminar la foto del proveedor.");

        } catch (Exception e) {
            logger.error(
                    "Error al eliminar el proveedor. ID: {}",
                    id,
                    e
            );

            return ResponseEntity.internalServerError()
                    .body("Ocurrió un error al eliminar el proveedor.");
        }
    }
}
