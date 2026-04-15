package com.cibertec.proyecto.dto.request;

import lombok.Data;

@Data
public class SubmitAnswerRequest {
    private Long simulacionId;
    private Long preguntaId;
    private Long opcionId;
}
