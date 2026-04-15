package com.cibertec.proyecto.controller;

import com.cibertec.proyecto.dto.request.SubmitAnswerRequest;
import com.cibertec.proyecto.dto.response.*;
import com.cibertec.proyecto.model.Simulacion;
import com.cibertec.proyecto.service.SimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulaciones")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService simulationService;

    @GetMapping("/escenarios")
    public ResponseEntity<List<ScenarioSummaryResponse>> listarEscenarios() {
        return ResponseEntity.ok(simulationService.listarEscenarios());
    }

    @PostMapping("/iniciar")
    public ResponseEntity<Long> iniciarSimulacion(@RequestParam Long usuarioId, @RequestParam Long escenarioId) {
        return ResponseEntity.ok(simulationService.iniciarSimulacion(usuarioId, escenarioId));
    }

    @GetMapping("/preguntas/{escenarioId}")
    public ResponseEntity<List<QuestionResponse>> obtenerPreguntas(
            @PathVariable Long escenarioId,
            @RequestParam(required = false) Long simulacionId) {
        return ResponseEntity.ok(simulationService.obtenerPreguntas(escenarioId, simulacionId));
    }

    @PostMapping("/responder")
    public ResponseEntity<FeedbackResponse> enviarRespuesta(@RequestBody SubmitAnswerRequest request) {
        return ResponseEntity.ok(simulationService.enviarRespuesta(request));
    }

    @GetMapping("/resultado/{simulacionId}")
    public ResponseEntity<SimulationResultResponse> obtenerResultado(@PathVariable Long simulacionId) {
        return ResponseEntity.ok(simulationService.obtenerResultado(simulacionId));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Simulacion>> listarSimulacionesPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(simulationService.listarSimulacionesPorUsuario(usuarioId));
    }

    @GetMapping("/todas")
    public ResponseEntity<List<Simulacion>> listarTodasLasSimulaciones() {
        return ResponseEntity.ok(simulationService.listarTodasLasSimulaciones());
    }
}
