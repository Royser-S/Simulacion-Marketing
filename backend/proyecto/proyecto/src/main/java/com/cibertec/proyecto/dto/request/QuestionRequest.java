package com.cibertec.proyecto.dto.request;

import lombok.Data;

@Data
public class QuestionRequest {
    private Long escenarioId;
    private Integer fase;
    private String enunciado;
}
