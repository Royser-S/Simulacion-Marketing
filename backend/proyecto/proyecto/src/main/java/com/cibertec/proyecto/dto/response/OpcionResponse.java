package com.cibertec.proyecto.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OpcionResponse {
    private Long id;
    private String textoOpcion;
    private String metadataVisual;
}
