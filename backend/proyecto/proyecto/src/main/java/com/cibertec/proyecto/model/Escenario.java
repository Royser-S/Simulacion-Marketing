package com.cibertec.proyecto.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "escenarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Escenario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String titulo;

    @Column(name = "descripcion_empresa", columnDefinition = "TEXT")
    private String descripcionEmpresa;

    @Column(name = "descripcion_producto", columnDefinition = "TEXT")
    private String descripcionProducto;

    @Column(name = "situacion_mercado", columnDefinition = "TEXT")
    private String situacionMercado;

    @Column(name = "imagen_url", columnDefinition = "TEXT")
    private String imagenUrl;
}
