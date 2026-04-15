package com.cibertec.proyecto.controller;

import com.cibertec.proyecto.dto.request.LoginRequest;
import com.cibertec.proyecto.dto.request.RegisterRequest;
import com.cibertec.proyecto.dto.response.UsuarioResponse;
import com.cibertec.proyecto.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(usuarioService.registrar(request));
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(usuarioService.login(request));
    }
}
