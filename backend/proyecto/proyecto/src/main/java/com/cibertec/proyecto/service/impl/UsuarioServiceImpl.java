package com.cibertec.proyecto.service.impl;

import com.cibertec.proyecto.dto.request.LoginRequest;
import com.cibertec.proyecto.dto.request.RegisterRequest;
import com.cibertec.proyecto.dto.response.UsuarioResponse;
import com.cibertec.proyecto.model.Role;
import com.cibertec.proyecto.model.Usuario;
import com.cibertec.proyecto.repository.RoleRepository;
import com.cibertec.proyecto.repository.UsuarioRepository;
import com.cibertec.proyecto.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UsuarioResponse registrar(RegisterRequest request) {
        // Validar dominio
        if (!request.getCorreo().endsWith("@cibertec.edu.pe")) {
            throw new RuntimeException("Solo se permiten correos de @cibertec.edu.pe");
        }

        // Validar si ya existe
        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // Buscar rol (Públicamente SOLO se permite ESTUDIANTE)
        Role rol = roleRepository.findAll().stream()
                .filter(r -> r.getNombre().equalsIgnoreCase("ESTUDIANTE"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setCorreo(request.getCorreo());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);

        Usuario guardado = usuarioRepository.save(usuario);

        return mapToResponse(guardado);
    }

    @Override
    public UsuarioResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return mapToResponse(usuario);
    }

    private UsuarioResponse mapToResponse(Usuario usuario) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nombreCompleto(usuario.getNombreCompleto())
                .correo(usuario.getCorreo())
                .rolNombre(usuario.getRol().getNombre())
                .build();
    }
}
