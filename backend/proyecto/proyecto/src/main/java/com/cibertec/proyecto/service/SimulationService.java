package com.cibertec.proyecto.service;

import com.cibertec.proyecto.dto.request.SubmitAnswerRequest;
import com.cibertec.proyecto.dto.response.*;
import com.cibertec.proyecto.model.Simulacion;

import java.util.List;

public interface SimulationService {
    List<ScenarioSummaryResponse> listarEscenarios();
    Long iniciarSimulacion(Long usuarioId, Long escenarioId);
    List<QuestionResponse> obtenerPreguntas(Long escenarioId, Long simulacionId);
    FeedbackResponse enviarRespuesta(SubmitAnswerRequest request);
    SimulationResultResponse obtenerResultado(Long simulacionId);
    List<Simulacion> listarSimulacionesPorUsuario(Long usuarioId);
    List<Simulacion> listarTodasLasSimulaciones();
}
