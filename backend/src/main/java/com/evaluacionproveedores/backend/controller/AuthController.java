
package com.evaluacionproveedores.backend.controller;

import com.evaluacionproveedores.backend.model.Usuario;
import com.evaluacionproveedores.backend.repository.UsuarioRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // =========================================================
    // INICIAR SESIÓN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> datos,
            HttpServletRequest request) {

        String usuario = datos.get("usuario");
        String password = datos.get("password");

        if (usuario == null || password == null
                || usuario.isBlank() || password.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "mensaje",
                            "Usuario y contraseña son obligatorios"
                    ));
        }

        Usuario usuarioEncontrado = usuarioRepository
                .findByUsuario(usuario)
                .orElse(null);

        if (usuarioEncontrado == null) {
            return ResponseEntity.status(401)
                    .body(Map.of(
                            "mensaje",
                            "Usuario o contraseña incorrectos"
                    ));
        }

        if (!Boolean.TRUE.equals(usuarioEncontrado.getActivo())) {
            return ResponseEntity.status(401)
                    .body(Map.of(
                            "mensaje",
                            "El usuario está desactivado"
                    ));
        }

        boolean passwordCorrecta = passwordEncoder.matches(
                password,
                usuarioEncontrado.getPassword()
        );

        if (!passwordCorrecta) {
            return ResponseEntity.status(401)
                    .body(Map.of(
                            "mensaje",
                            "Usuario o contraseña incorrectos"
                    ));
        }

        // Crear la autenticación reconocida por Spring Security.
        Authentication autenticacion =
                UsernamePasswordAuthenticationToken.authenticated(
                        usuarioEncontrado.getUsuario(),
                        null,
                        Collections.emptyList()
                );

        SecurityContext contexto =
                SecurityContextHolder.createEmptyContext();

        contexto.setAuthentication(autenticacion);
        SecurityContextHolder.setContext(contexto);

        // Guardar el contexto autenticado en la sesión HTTP.
        HttpSession sesion = request.getSession(true);

        sesion.setAttribute(
                HttpSessionSecurityContextRepository
                        .SPRING_SECURITY_CONTEXT_KEY,
                contexto
        );

        Map<String, Object> respuesta = new HashMap<>();

        respuesta.put("mensaje", "Inicio de sesión correcto");
        respuesta.put("idUsuario", usuarioEncontrado.getIdUsuario());
        respuesta.put("usuario", usuarioEncontrado.getUsuario());
        respuesta.put("nombre", usuarioEncontrado.getNombre());

        return ResponseEntity.ok(respuesta);
    }

    // =========================================================
    // CAMBIAR CONTRASEÑA
    // =========================================================

    @PostMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(
            @RequestBody Map<String, String> datos,
            Authentication autenticacion) {

        // Verificar que exista una sesión autenticada.
        if (autenticacion == null
                || !autenticacion.isAuthenticated()) {

            return ResponseEntity.status(401)
                    .body(Map.of(
                            "mensaje",
                            "Debes iniciar sesión para cambiar tu contraseña"
                    ));
        }

        String passwordActual = datos.get("passwordActual");
        String nuevaPassword = datos.get("nuevaPassword");

        if (passwordActual == null || nuevaPassword == null
                || passwordActual.isBlank()
                || nuevaPassword.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "mensaje",
                            "Todos los campos son obligatorios"
                    ));
        }

        // Obtener el usuario desde la autenticación.
        String nombreUsuario = autenticacion.getName();

        Usuario usuarioEncontrado = usuarioRepository
                .findByUsuario(nombreUsuario)
                .orElse(null);

        if (usuarioEncontrado == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("mensaje", "Usuario no encontrado"));
        }

        if (!Boolean.TRUE.equals(usuarioEncontrado.getActivo())) {
            return ResponseEntity.status(401)
                    .body(Map.of(
                            "mensaje",
                            "El usuario está desactivado"
                    ));
        }

        boolean passwordCorrecta = passwordEncoder.matches(
                passwordActual,
                usuarioEncontrado.getPassword()
        );

        if (!passwordCorrecta) {
            return ResponseEntity.status(401)
                    .body(Map.of(
                            "mensaje",
                            "La contraseña actual es incorrecta"
                    ));
        }

        if (nuevaPassword.length() < 8) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "mensaje",
                            "La nueva contraseña debe tener al menos 8 caracteres"
                    ));
        }

        usuarioEncontrado.setPassword(
                passwordEncoder.encode(nuevaPassword)
        );

        usuarioRepository.save(usuarioEncontrado);

        return ResponseEntity.ok(
                Map.of(
                        "mensaje",
                        "Contraseña actualizada correctamente"
                )
        );
    }
}
