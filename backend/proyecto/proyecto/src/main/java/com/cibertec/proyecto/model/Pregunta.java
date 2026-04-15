package com.cibertec.proyecto.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "preguntas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pregunta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "escenario_id")
    private Escenario escenario;

    private Integer fase;
    
    @Column(name = "sub_fase")
    private String subFase;

    private Integer orden;

    @Column(columnDefinition = "TEXT")
    private String enunciado;
}
