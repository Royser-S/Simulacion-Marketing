package com.cibertec.proyecto.repository;

import com.cibertec.proyecto.model.Opcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OpcionRepository extends JpaRepository<Opcion, Long> {
    List<Opcion> findByPreguntaId(Long preguntaId);
}
