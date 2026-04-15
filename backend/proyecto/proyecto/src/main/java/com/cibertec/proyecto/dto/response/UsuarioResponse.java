package com.cibertec.proyecto.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioResponse {
    private Long id;
    private String nombreCompleto;
    private String correo;
    private String rolNombre;
}
