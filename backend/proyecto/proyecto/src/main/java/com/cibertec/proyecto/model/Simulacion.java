package com.cibertec.proyecto.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "simulaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Simulacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "escenario_id")
    private Escenario escenario;

    @Column(name = "puntaje_total")
    private BigDecimal puntajeTotal = BigDecimal.ZERO;

    @Column(length = 20)
    private String estado; // 'EN_PROGRESO', 'FINALIZADO'

    @Column(name = "orden_preguntas", columnDefinition = "TEXT")
    private String ordenPreguntas;

    @Column(name = "fecha_inicio", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaInicio = LocalDateTime.now();
}
