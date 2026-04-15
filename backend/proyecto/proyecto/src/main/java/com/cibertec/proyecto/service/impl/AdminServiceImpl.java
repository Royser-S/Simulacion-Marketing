package com.cibertec.proyecto.service.impl;

import com.cibertec.proyecto.dto.request.*;
import com.cibertec.proyecto.model.*;
import com.cibertec.proyecto.repository.*;
import com.cibertec.proyecto.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final EscenarioRepository escenarioRepository;
    private final PreguntaRepository preguntaRepository;
    private final OpcionRepository opcionRepository;
    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Escenario crearEscenario(ScenarioRequest request) {
        Escenario escenario = new Escenario();
        escenario.setTitulo(request.getTitulo());
        escenario.setDescripcionEmpresa(request.getDescripcionEmpresa());
        escenario.setDescripcionProducto(request.getDescripcionProducto());
        escenario.setSituacionMercado(request.getSituacionMercado());
        return escenarioRepository.save(escenario);
    }

    @Override
    public Pregunta agregarPregunta(QuestionRequest request) {
        Escenario escenario = escenarioRepository.findById(request.getEscenarioId())
                .orElseThrow(() -> new RuntimeException("Escenario no encontrado"));
        
        Pregunta pregunta = new Pregunta();
        pregunta.setEscenario(escenario);
        pregunta.setFase(request.getFase());
        pregunta.setEnunciado(request.getEnunciado());
        return preguntaRepository.save(pregunta);
    }

    @Override
    public Opcion agregarOpcion(OptionRequest request) {
        Pregunta pregunta = preguntaRepository.findById(request.getPreguntaId())
                .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));

        Opcion opcion = new Opcion();
        opcion.setPregunta(pregunta);
        opcion.setTextoOpcion(request.getTextoOpcion());
        opcion.setFeedback(request.getFeedback());
        opcion.setPuntos(request.getPuntos());
        opcion.setEsMejorOpcion(request.getEsMejorOpcion() != null ? request.getEsMejorOpcion() : false);
        return opcionRepository.save(opcion);
    }

    @Override
    public List<Escenario> listarTodosEscenarios() {
        return escenarioRepository.findAll();
    }

    @Override
    public void eliminarEscenario(Long id) {
        escenarioRepository.deleteById(id);
    }

    @Override
    public Usuario registrarUsuario(RegisterRequest request) {
        // Buscar el rol
        Role rol = roleRepository.findAll().stream()
                .filter(r -> r.getNombre().equalsIgnoreCase(request.getRolNombre()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + request.getRolNombre()));

        Usuario usuario = new Usuario();
        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setCorreo(request.getCorreo());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);

        return usuarioRepository.save(usuario);
    }
}
