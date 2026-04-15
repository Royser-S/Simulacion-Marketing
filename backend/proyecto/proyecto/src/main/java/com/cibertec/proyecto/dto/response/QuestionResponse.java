package com.cibertec.proyecto.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class QuestionResponse {
    private Long id;
    private Integer fase;
    private String subFase;
    private Integer orden;
    private String enunciado;
    private List<OpcionResponse> opciones;
}
