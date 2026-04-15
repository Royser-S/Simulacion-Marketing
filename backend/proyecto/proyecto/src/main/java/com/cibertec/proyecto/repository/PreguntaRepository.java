package com.cibertec.proyecto.repository;

import com.cibertec.proyecto.model.Pregunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PreguntaRepository extends JpaRepository<Pregunta, Long> {
    List<Pregunta> findByEscenarioIdOrderByFaseAsc(Long escenarioId);
}
