package com.cibertec.proyecto.service;

import com.cibertec.proyecto.dto.request.OptionRequest;
import com.cibertec.proyecto.dto.request.QuestionRequest;
import com.cibertec.proyecto.dto.request.RegisterRequest;
import com.cibertec.proyecto.dto.request.ScenarioRequest;
import com.cibertec.proyecto.model.Escenario;
import com.cibertec.proyecto.model.Opcion;
import com.cibertec.proyecto.model.Pregunta;
import com.cibertec.proyecto.model.Usuario;

import java.util.List;

public interface AdminService {
    Escenario crearEscenario(ScenarioRequest request);
    Pregunta agregarPregunta(QuestionRequest request);
    Opcion agregarOpcion(OptionRequest request);
    List<Escenario> listarTodosEscenarios();
    void eliminarEscenario(Long id);
    Usuario registrarUsuario(RegisterRequest request);
    List<Usuario> listarUsuarios();
    Usuario toggleEstadoUsuario(Long id);
}
