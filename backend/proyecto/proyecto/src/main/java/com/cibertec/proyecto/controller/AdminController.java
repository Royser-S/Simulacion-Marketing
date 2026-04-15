package com.cibertec.proyecto.controller;

import com.cibertec.proyecto.dto.request.*;
import com.cibertec.proyecto.model.*;
import com.cibertec.proyecto.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/escenarios")
    public ResponseEntity<Escenario> crearEscenario(@RequestBody ScenarioRequest request) {
        return ResponseEntity.ok(adminService.crearEscenario(request));
    }

    @PostMapping("/preguntas")
    public ResponseEntity<Pregunta> agregarPregunta(@RequestBody QuestionRequest request) {
        return ResponseEntity.ok(adminService.agregarPregunta(request));
    }

    @PostMapping("/opciones")
    public ResponseEntity<Opcion> agregarOpcion(@RequestBody OptionRequest request) {
        return ResponseEntity.ok(adminService.agregarOpcion(request));
    }

    @GetMapping("/escenarios")
    public ResponseEntity<List<Escenario>> listarTodos() {
        return ResponseEntity.ok(adminService.listarTodosEscenarios());
    }

    @DeleteMapping("/escenarios/{id}")
    public ResponseEntity<Void> eliminarEscenario(@PathVariable Long id) {
        adminService.eliminarEscenario(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/usuarios")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(adminService.registrarUsuario(request));
    }
}
