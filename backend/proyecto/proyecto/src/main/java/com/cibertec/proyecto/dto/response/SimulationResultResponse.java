package com.cibertec.proyecto.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class SimulationResultResponse {
    private BigDecimal puntajeTotal;
    private Long escenarioId;
    private String rango;
    private String mensajeFinal;
    private java.util.List<DecisionDetail> decisiones;

    @Data
    @Builder
    public static class DecisionDetail {
        private Long preguntaId;
        private String pregunta;
        private String respuesta;
        private String feedback;
        private BigDecimal puntos;
    }
}
