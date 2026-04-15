package com.cibertec.proyecto.service;

import com.cibertec.proyecto.dto.request.LoginRequest;
import com.cibertec.proyecto.dto.request.RegisterRequest;
import com.cibertec.proyecto.dto.response.UsuarioResponse;

public interface UsuarioService {
    UsuarioResponse registrar(RegisterRequest request);
    UsuarioResponse login(LoginRequest request);
}
