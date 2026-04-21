package com.cibertec.proyecto.service.impl;

import com.cibertec.proyecto.dto.request.SubmitAnswerRequest;
import com.cibertec.proyecto.dto.response.*;
import com.cibertec.proyecto.model.*;
import com.cibertec.proyecto.repository.*;
import com.cibertec.proyecto.service.SimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SimulationServiceImpl implements SimulationService {

    private final EscenarioRepository escenarioRepository;
    private final PreguntaRepository preguntaRepository;
    private final OpcionRepository opcionRepository;
    private final SimulacionRepository simulacionRepository;
    private final RespuestaUsuarioRepository respuestaUsuarioRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public List<ScenarioSummaryResponse> listarEscenarios() {
        return escenarioRepository.findAll().stream()
                .map(e -> ScenarioSummaryResponse.builder()
                        .id(e.getId())
                        .titulo(e.getTitulo())
                        .descripcionEmpresa(e.getDescripcionEmpresa())
                        .imagenUrl(e.getImagenUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Long iniciarSimulacion(Long usuarioId, Long escenarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Escenario escenario = escenarioRepository.findById(escenarioId)
                .orElseThrow(() -> new RuntimeException("Escenario no encontrado"));

        // Verificar si ya tiene una en progreso (Defensivo contra datos nulos)
        Simulacion existente = simulacionRepository.findAll().stream()
                .filter(s -> s.getUsuario() != null && s.getUsuario().getId().equals(usuarioId) && 
                            s.getEscenario() != null && s.getEscenario().getId().equals(escenarioId) && 
                            "EN_PROGRESO".equals(s.getEstado()))
                .findFirst().orElse(null);
        
        if (existente != null) {
            return existente.getId();
        }

        Simulacion simulacion = new Simulacion();
        simulacion.setUsuario(usuario);
        simulacion.setEscenario(escenario);
        simulacion.setEstado("EN_PROGRESO");

        // Generar orden aleatorio por fases (Requerimiento Blueprint)
        List<Pregunta> todas = preguntaRepository.findByEscenarioIdOrderByFaseAsc(escenarioId);
        
        // Agrupar y barajar por fase para mantener coherencia narrativa
        List<Long> ordenIds = new ArrayList<>();
        for (int f = 1; f <= 3; f++) {
            final int faseActual = f;
            List<Long> idsFase = todas.stream()
                    .filter(p -> p.getFase() == faseActual)
                    .map(Pregunta::getId)
                    .collect(Collectors.toList());
            Collections.shuffle(idsFase);
            ordenIds.addAll(idsFase);
        }

        simulacion.setOrdenPreguntas(ordenIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(",")));
        
        return simulacionRepository.save(simulacion).getId();
    }

    @Override
    public List<QuestionResponse> obtenerPreguntas(Long escenarioId, Long simulacionId) {
        List<Pregunta> todas = preguntaRepository.findByEscenarioIdOrderByFaseAsc(escenarioId);
        
        // Si hay una simulación con orden persistido, usarlo
        if (simulacionId != null) {
            Simulacion sim = simulacionRepository.findById(simulacionId).orElse(null);
            if (sim != null && sim.getOrdenPreguntas() != null) {
                List<Long> ordenIds = Arrays.stream(sim.getOrdenPreguntas().split(","))
                        .map(Long::valueOf)
                        .collect(Collectors.toList());
                
                // Reordenar la lista según el orden guardado
                todas.sort((p1, p2) -> {
                    int idx1 = ordenIds.indexOf(p1.getId());
                    int idx2 = ordenIds.indexOf(p2.getId());
                    return Integer.compare(idx1, idx2);
                });
            }
        }

        return todas.stream()
                .map(p -> QuestionResponse.builder()
                        .id(p.getId())
                        .fase(p.getFase())
                        .subFase(p.getSubFase())
                        .orden(p.getOrden())
                        .enunciado(p.getEnunciado())
                        .opciones(opcionRepository.findByPreguntaId(p.getId()).stream()
                                .map(o -> OpcionResponse.builder()
                                        .id(o.getId())
                                        .textoOpcion(o.getTextoOpcion())
                                        .metadataVisual(o.getMetadataVisual())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FeedbackResponse enviarRespuesta(SubmitAnswerRequest request) {
        Simulacion simulacion = simulacionRepository.findById(request.getSimulacionId())
                .orElseThrow(() -> new RuntimeException("Simulación no encontrada"));
        Pregunta pregunta = preguntaRepository.findById(request.getPreguntaId())
                .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));
        Opcion opcion = opcionRepository.findById(request.getOpcionId())
                .orElseThrow(() -> new RuntimeException("Opción no encontrada"));

        // Guardar respuesta
        RespuestaUsuario respuesta = new RespuestaUsuario();
        respuesta.setSimulacion(simulacion);
        respuesta.setPregunta(pregunta);
        respuesta.setOpcion(opcion);
        respuestaUsuarioRepository.save(respuesta);

        // Actualizar puntaje
        simulacion.setPuntajeTotal(simulacion.getPuntajeTotal().add(opcion.getPuntos()));
        
        // Verificar si se alcanzó la meta de decisiones (8 por sesión)
        List<RespuestaUsuario> respuestasDadas = respuestaUsuarioRepository.findBySimulacionId(simulacion.getId());
        
        if (respuestasDadas.size() >= 8) {
            simulacion.setEstado("FINALIZADO");
        }
        
        simulacionRepository.save(simulacion);

        return FeedbackResponse.builder()
                .feedback(opcion.getFeedback())
                .puntosObtenidos(opcion.getPuntos())
                .esMejorOpcion(opcion.getEsMejorOpcion())
                .hallazgos(opcion.getResultado())
                .build();
    }

    @Override
    public SimulationResultResponse obtenerResultado(Long simulacionId) {
        Simulacion simulacion = simulacionRepository.findById(simulacionId)
                .orElseThrow(() -> new RuntimeException("Simulación no encontrada"));

        BigDecimal puntaje = simulacion.getPuntajeTotal();
        String rango;
        String mensaje;

        // Lógica de rangos institucional (Escala 20)
        double score = puntaje.doubleValue();
        if (score >= 18.0) {
            rango = "Sobresaliente (A+)";
            mensaje = "¡Nivel Consultor Senior! Su capacidad para integrar VPD y diagnóstico estratégico garantiza el éxito comercial del SaaS.";
        } else if (score >= 14.0) {
            rango = "Competente (B)";
            mensaje = "Buen desempeño. Ha identificado los núcleos de decisión, aunque existen áreas de optimización en los ejes de posicionamiento.";
        } else if (score >= 10.5) {
            rango = "En Proceso (C)";
            mensaje = "Decisiones aceptables. Se recomienda profundizar en el análisis de instrumentos para captar mejor el insight del Buyer Persona.";
        } else {
            rango = "Básico (D)";
            mensaje = "Se requiere refuerzo en los conceptos de comportamiento del cliente y estrategias de conversión SaaS.";
        }

        List<RespuestaUsuario> historial = respuestaUsuarioRepository.findBySimulacionId(simulacionId);
        List<SimulationResultResponse.DecisionDetail> detalles = historial.stream()
                .filter(res -> res.getOpcion() != null) // Evitar NPE si la opción se perdió
                .map(res -> SimulationResultResponse.DecisionDetail.builder()
                        .preguntaId(res.getPregunta().getId())
                        .pregunta(res.getPregunta().getEnunciado())
                        .respuesta(res.getOpcion().getTextoOpcion())
                        .feedback(res.getOpcion().getFeedback())
                        .puntos(res.getOpcion().getPuntos())
                        .build())
                .collect(Collectors.toList());

        return SimulationResultResponse.builder()
                .puntajeTotal(puntaje)
                .escenarioId(simulacion.getEscenario() != null ? simulacion.getEscenario().getId() : 1L)
                .rango(rango)
                .mensajeFinal(mensaje)
                .decisiones(detalles)
                .build();
    }

    @Override
    public List<Simulacion> listarSimulacionesPorUsuario(Long usuarioId) {
        return simulacionRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public List<Simulacion> listarTodasLasSimulaciones() {
        return simulacionRepository.findAll();
    }
}
