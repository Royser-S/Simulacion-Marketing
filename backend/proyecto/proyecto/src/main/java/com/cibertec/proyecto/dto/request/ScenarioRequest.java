package com.cibertec.proyecto.dto.request;

import lombok.Data;

@Data
public class ScenarioRequest {
    private String titulo;
    private String descripcionEmpresa;
    private String descripcionProducto;
    private String situacionMercado;
}
