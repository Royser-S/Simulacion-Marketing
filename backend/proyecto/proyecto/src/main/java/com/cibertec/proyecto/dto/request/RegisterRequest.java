package com.cibertec.proyecto.dto.request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nombreCompleto;
    private String correo;
    private String password;
    private String rolNombre; // 'ADMIN' o 'ESTUDIANTE'
}
