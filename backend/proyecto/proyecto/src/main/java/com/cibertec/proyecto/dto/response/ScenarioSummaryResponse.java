package com.cibertec.proyecto.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ScenarioSummaryResponse {
    private Long id;
    private String titulo;
    private String descripcionEmpresa;
    private String imagenUrl;
}
