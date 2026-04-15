package com.cibertec.proyecto.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OptionRequest {
    private Long preguntaId;
    private String textoOpcion;
    private String feedback;
    private BigDecimal puntos;
    private Boolean esMejorOpcion;
}
