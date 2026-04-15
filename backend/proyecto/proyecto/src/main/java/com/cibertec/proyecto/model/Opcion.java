package com.cibertec.proyecto.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "opciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Opcion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pregunta_id")
    private Pregunta pregunta;

    @Column(name = "texto_opcion", columnDefinition = "TEXT")
    private String textoOpcion;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private BigDecimal puntos;

    @Column(name = "es_mejor_opcion")
    private Boolean esMejorOpcion = false;

    @Column(name = "metadata_visual", columnDefinition = "TEXT")
    private String metadataVisual;

    @Column(columnDefinition = "TEXT")
    private String resultado;
}
