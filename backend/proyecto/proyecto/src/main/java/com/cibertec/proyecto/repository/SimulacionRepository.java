package com.cibertec.proyecto.repository;

import com.cibertec.proyecto.model.Simulacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SimulacionRepository extends JpaRepository<Simulacion, Long> {
    List<Simulacion> findByUsuarioId(Long usuarioId);
}
