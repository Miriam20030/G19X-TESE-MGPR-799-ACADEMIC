package com.evaluacionproveedores.backend.controller;

import com.evaluacionproveedores.backend.model.Usuario;
import com.evaluacionproveedores.backend.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/hash")
public String generarHash() {
    return passwordEncoder.encode("Admin123");
}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> datos) {

        String usuario = datos.get("usuario");
        String password = datos.get("password");

        if (usuario == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "mensaje",
                            "Usuario y contraseña son obligatorios"
                    ));
        }

        Usuario usuarioEncontrado =
                usuarioRepository.findByUsuario(usuario).orElse(null);

        if (usuarioEncontrado == null) {
            return ResponseEntity.status(401)
                    .body(Map.of(
                            "mensaje",
                            "Usuario o contraseña incorrectos"
                    ));
        }

        if (!usuarioEncontrado.getActivo()) {
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

        Map<String, Object> respuesta = new HashMap<>();

        respuesta.put("mensaje", "Inicio de sesión correcto");
        respuesta.put("idUsuario", usuarioEncontrado.getIdUsuario());
        respuesta.put("usuario", usuarioEncontrado.getUsuario());
        respuesta.put("nombre", usuarioEncontrado.getNombre());

        return ResponseEntity.ok(respuesta);
    }
}